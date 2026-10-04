<?php
/**
 * Puente entre Apache y la aplicación Node, escrito en PHP.
 *
 * ── Por qué existe esta rareza ───────────────────────────────────────────
 * Lo correcto es que nginx hable directamente con la aplicación. Hestia trae
 * la plantilla `NodeJS` para eso, pero necesita un fichero `node.conf` con el
 * puerto, y vive en un directorio de root. Sin alguien con permisos, no hay
 * forma de ponerlo.
 *
 * Lo que sí es tuyo es `public_html`, con `AllowOverride All`, `mod_rewrite`
 * y PHP-FPM. Así que el `.htaccess` manda aquí todas las peticiones y este
 * fichero las reenvía al 127.0.0.1:3200 y devuelve lo que conteste.
 *
 * ── Lo que cuesta ────────────────────────────────────────────────────────
 * Un proceso de PHP por cada petición y un salto más en cada carga. Para un
 * inventario que usan unas pocas personas no se nota, pero no es lo que uno
 * pondría si pudiera elegir. En cuanto exista `node.conf`, esto sobra: se
 * borra el .htaccess y ya.
 *
 * No es un proxy abierto: el destino está escrito aquí y no se puede
 * cambiar desde fuera.
 */

/**
 * El cuerpo de la petición, tal cual venía.
 *
 * ── El problema ──────────────────────────────────────────────────────────
 * PHP, por defecto, se TRAGA el cuerpo de las peticiones `multipart/form-data`
 * para rellenar `$_POST` y `$_FILES`. El efecto es que `php://input` queda
 * VACÍO, y este proxy reenviaba un formulario truncado. Next.js manda sus
 * acciones de servidor como multipart, así que eso rompía TODOS los
 * formularios de la aplicación —empezando por el de entrar— con un error que
 * no señala a ninguna parte:
 *
 *   ⨯ [Error: Unexpected end of form]
 *
 * Lo natural sería apagar esa lectura automática con
 * `enable_post_data_reading = Off`. No sirve: PHP-FPM lee el cuerpo ANTES de
 * aplicar el `.user.ini`, así que la directiva se acepta y no hace nada.
 * Ponerla donde sí funcionaría —la configuración del pool de FPM— necesita
 * root, y aquí no lo hay.
 *
 * ── La salida ────────────────────────────────────────────────────────────
 * Si `php://input` trae algo, se usa: es lo fiel. Si viene vacío pero hay
 * campos en `$_POST`, se reconstruye el multipart a partir de lo que PHP ya
 * parseó. No es lo mismo byte a byte —el separador es otro— pero es un
 * multipart equivalente y correcto, que es lo que el otro lado necesita.
 *
 * Los nombres de campo sobreviven porque son simples (`email`, `password`,
 * `$ACTION_ID_...`): PHP sólo destroza los que llevan puntos o corchetes.
 *
 * LIMITACIÓN, escrita aquí para que no se descubra por las malas: esto no
 * reenvía ficheros subidos. Hoy la aplicación no sube ninguno. El día que
 * suba, hay que mirar `$_FILES` — o, mejor, quitar este proxy y que nginx
 * hable directamente con la aplicación, que es lo que debería pasar en cuanto
 * exista el `node.conf` del que habla despliegue/README.md.
 */
function cuerpoDeLaPeticion(array &$cabeceras): string
{
    $crudo = file_get_contents('php://input');
    if ($crudo !== '' && $crudo !== false) {
        return $crudo;
    }
    if (empty($_POST)) {
        return '';
    }

    $separador = '----------------------------' . bin2hex(random_bytes(12));
    $partes = '';
    foreach ($_POST as $nombre => $valor) {
        foreach ((array) $valor as $uno) {
            $partes .= "--$separador\r\n"
                . 'Content-Disposition: form-data; name="' . $nombre . "\"\r\n\r\n"
                . $uno . "\r\n";
        }
    }
    $partes .= "--$separador--\r\n";

    // El Content-Type tiene que anunciar el separador NUEVO. Reenviar el de la
    // petición original dejaría al otro lado buscando un separador que ya no
    // existe en el cuerpo, y el fallo sería idéntico al que arreglamos.
    foreach ($cabeceras as $i => $c) {
        if (stripos($c, 'content-type:') === 0) {
            unset($cabeceras[$i]);
        }
    }
    $cabeceras[] = "Content-Type: multipart/form-data; boundary=$separador";
    $cabeceras = array_values($cabeceras);

    return $partes;
}

const DESTINO = 'http://127.0.0.1:3200';

/**
 * VERSIÓN DE PRUEBAS «GLASS» (2026-09-16). Lo que empieza por esta ruta va a
 * su propio proceso, en el 3201, compilado con esa ruta como `basePath`
 * (rama `glass`, despliegue/publicar-glass.sh). Todo lo demás, a la web.
 * Para retirarla, borrar estas dos constantes y `$esPrueba` más abajo, y la
 * línea de la ruta en el .htaccess.
 */
const RUTA_PRUEBAS = '/prueba-glass-47f47ad5';
const DESTINO_PRUEBAS = 'http://127.0.0.1:3201';

// Cabeceras que describen ESTA conexión, no el mensaje. Reenviarlas rompe
// cosas: `Connection` y `Upgrade` hablan del salto Apache↔PHP, y
// `Content-Length` deja de ser cierto en cuanto curl toca el cuerpo.
const NO_REENVIAR = [
    'host', 'connection', 'keep-alive', 'transfer-encoding', 'upgrade',
    'proxy-authorization', 'proxy-authenticate', 'te', 'trailer',
    'content-length', 'accept-encoding',
    // LAS DE «QUIÉN ERES», BORRADAS. Cualquiera puede mandar su propia
    // `X-Forwarded-For` en la petición, y si se reenvía, la aplicación se cree
    // que viene de esa IP: el límite de envíos del formulario sería mentira, y
    // `X-Forwarded-Host` además engaña a la comprobación anti-falsificación de
    // los formularios de Next. Las únicas válidas son las que pone este
    // fichero unas líneas más abajo, sacadas de la conexión de verdad.
    'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-proto', 'x-forwarded-port',
    'x-real-ip', 'forwarded', 'true-client-ip', 'cf-connecting-ip',
];

$ruta = $_SERVER['REQUEST_URI'] ?? '/';
// La ruta exacta, o seguida de «/» o «?»: `/prueba-glass-47f47ad5x` no cuenta.
$siguiente = substr($ruta, strlen(RUTA_PRUEBAS), 1);
$esPrueba = strncmp($ruta, RUTA_PRUEBAS, strlen(RUTA_PRUEBAS)) === 0
    && ($siguiente === '' || $siguiente === false || $siguiente === '/' || $siguiente === '?');
$ch = curl_init(($esPrueba ? DESTINO_PRUEBAS : DESTINO) . $ruta);

$cabeceras = [];
foreach ($_SERVER as $clave => $valor) {
    if (strncmp($clave, 'HTTP_', 5) !== 0) continue;
    $nombre = strtolower(str_replace('_', '-', substr($clave, 5)));
    if (in_array($nombre, NO_REENVIAR, true)) continue;
    $cabeceras[] = "$nombre: $valor";
}
// Content-Type sí, y no viene con prefijo HTTP_.
if (!empty($_SERVER['CONTENT_TYPE'])) {
    $cabeceras[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
}

// El Host original: es lo que mira Next.js para construir enlaces absolutos.
$host = $_SERVER['HTTP_HOST'] ?? 'sidebflms.com';
$cabeceras[] = "Host: $host";

// Sin esto, tras poner el HTTPS la aplicación creería que la petición vino
// por http y mandaría al usuario a una dirección sin cifrar.
$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
      || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
      || (($_SERVER['SERVER_PORT'] ?? '') === '443');
$cabeceras[] = 'X-Forwarded-Proto: ' . ($https ? 'https' : 'http');
$cabeceras[] = 'X-Forwarded-For: ' . ($_SERVER['REMOTE_ADDR'] ?? '');
$cabeceras[] = 'X-Real-IP: ' . ($_SERVER['REMOTE_ADDR'] ?? '');

$metodo = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// El cuerpo ANTES de entregar las cabeceras a curl, y no después.
//
// `cuerpoDeLaPeticion()` puede tener que reescribir el Content-Type —cuando
// reconstruye el multipart, el separador es otro— y si las cabeceras ya se
// han pasado a curl, ese cambio no llega a ninguna parte. El síntoma es
// desconcertante, porque el cuerpo viaja entero y aun así el otro lado
// responde «no boundary found in multipart body».
$cuerpo = ($metodo !== 'GET' && $metodo !== 'HEAD') ? cuerpoDeLaPeticion($cabeceras) : null;

curl_setopt_array($ch, [
    CURLOPT_CUSTOMREQUEST  => $metodo,
    CURLOPT_HTTPHEADER     => $cabeceras,
    CURLOPT_HEADER         => false,
    CURLOPT_RETURNTRANSFER => false,
    // NO seguir redirecciones: una redirección es una respuesta legítima que
    // el navegador tiene que ver. Seguirla aquí rompería el inicio de sesión,
    // que funciona precisamente a base de redirigir.
    CURLOPT_FOLLOWLOCATION => false,
    CURLOPT_TIMEOUT        => 300,
    CURLOPT_CONNECTTIMEOUT => 10,
]);

if ($cuerpo !== null) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, $cuerpo);
}

// HEAD: la respuesta trae `Content-Length` pero, por definición, NO trae
// cuerpo. Con `CURLOPT_CUSTOMREQUEST => 'HEAD'` a secas, curl se queda
// esperando ese cuerpo que nunca llega, hasta que la conexión se cae (se
// midió: 6-7 s) y `curl_exec` falla, así que cada HEAD acababa en el 502 de
// «La aplicación no responde» de más abajo. Para HEAD curl necesita
// `CURLOPT_NOBODY`, no sólo el nombre del método. Encontrado el 2026-10-04
// midiendo la web: `curl -I https://sidebflms.com/en` daba 502 y el GET, 200.
// Lo sufren los vigilantes de caída y los comprobadores de enlaces que usan
// HEAD. (Sin probar en local: esta máquina no tiene PHP; se comprueba con
// `curl -I` tras desplegar.)
if ($metodo === 'HEAD') {
    curl_setopt($ch, CURLOPT_NOBODY, true);
}

// Las cabeceras de la respuesta se van reenviando según llegan.
curl_setopt($ch, CURLOPT_HEADERFUNCTION, function ($ch, $linea) {
    $largo = strlen($linea);
    $recortada = trim($linea);
    if ($recortada === '') return $largo;

    if (stripos($recortada, 'HTTP/') === 0) {
        // El código de estado, tal cual lo dio la aplicación.
        http_response_code(curl_getinfo($ch, CURLINFO_HTTP_CODE));
        return $largo;
    }

    $partes = explode(':', $recortada, 2);
    if (count($partes) !== 2) return $largo;
    $nombre = strtolower(trim($partes[0]));

    // Las que describen cómo viajó el cuerpo dejan de ser ciertas aquí: quien
    // decide la longitud y la codificación de lo que sale es Apache.
    if (in_array($nombre, ['transfer-encoding', 'content-encoding', 'content-length', 'connection', 'keep-alive'], true)) {
        return $largo;
    }

    // `false` en el tercer argumento: puede haber VARIAS Set-Cookie, y con
    // `true` cada una borraría la anterior. Ahí se perdería la sesión.
    header($recortada, false);
    return $largo;
});

// El cuerpo se escribe según llega, sin acumularlo entero en memoria: un
// pliego de etiquetas o un PDF pueden ser grandes.
curl_setopt($ch, CURLOPT_WRITEFUNCTION, function ($ch, $trozo) {
    echo $trozo;
    return strlen($trozo);
});

if (curl_exec($ch) === false) {
    http_response_code(502);
    header('Content-Type: text/plain; charset=utf-8');
    echo "La aplicación no responde.\n\n";
    echo "Si esto dura más de un minuto, el vigilante del cron no ha podido\n";
    echo "levantarla. Mira: tail -50 ~/sidebflms-web/sidebflms-web.log\n";
}
curl_close($ch);
