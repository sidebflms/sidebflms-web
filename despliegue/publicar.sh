#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Compila y publica la web en nastos. Lo llama GitHub Actions en cada
# empujón a `main`, y sirve igual a mano por SSH.
#
#   ssh -i ~/.ssh/nastos_gear_inventario bote@nastos.barrasa.dev
#   cd ~/sidebflms-web && ./despliegue/publicar.sh
# ---------------------------------------------------------------------
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUBLICO="$HOME/web/sidebflms.com/public_html"
NPM=/usr/local/bin/npm
export PATH=/usr/local/bin:/usr/bin:/bin

cd "$RAIZ"

# ── LA WEB SIGUE SIRVIENDO MIENTRAS SE PUBLICA ─────────────────────────
#
# Hasta el 23-09-2026 esto hacía `npm ci` y `npm run build` sobre las mismas
# carpetas de las que el proceso viejo estaba sirviendo. `npm ci` BORRA
# node_modules entero antes de reinstalarlo, y `build` reescribe `.next`
# trozo a trozo: durante ese minuto largo, cualquier página que no estuviera
# precompilada —el panel, la API del formulario— reventaba con «Cannot find
# module». Había 1.834 de esos en el registro y nadie lo había visto porque
# las páginas normales son estáticas y sí aguantaban.
#
# Ahora: las dependencias sólo se reinstalan si cambió package-lock.json, y la
# compilación va a `.next-nueva`; `estrenar` la cambia de nombre en el
# instante del reinicio.

echo "==> Dependencias"
# La huella se guarda DENTRO de node_modules a propósito: si alguien borra la
# carpeta a mano, la huella se va con ella y se reinstala sin preguntar.
SELLO="$RAIZ/node_modules/.sello-package-lock"
HUELLA="$(sha256sum "$RAIZ/package-lock.json" | cut -d' ' -f1)"
if [ -d "$RAIZ/node_modules" ] && [ "$(cat "$SELLO" 2>/dev/null)" = "$HUELLA" ]; then
  echo "    package-lock.json sin cambios: no se reinstala nada"
else
  "$NPM" ci --no-audit --no-fund
  echo "$HUELLA" > "$SELLO"
fi

# LAS MIGRACIONES DEL PANEL, ANTES DE COMPILAR Y NO DESPUÉS.
#
# Al compilar, la web genera sus páginas leyendo el contenido, así que las
# tablas tienen que existir ya. Y en producción Payload NO se crea las tablas
# solo —eso sólo lo hace en desarrollo—: hay que aplicarle las migraciones,
# que viven en `migrations/` y van en el repositorio.
#
# Si no hay base de datos configurada, no se intenta nada: la web tirará de los
# ficheros de contenido, que es su plan B (ver lib/contenido.ts).
if grep -q "^PGDATABASE=\|^DATABASE_URI=" "$RAIZ/.env" 2>/dev/null; then
  echo "==> Migraciones del panel"
  npx payload migrate
else
  echo "    sin base de datos configurada: el panel no se toca"
fi

echo "==> Compilando en .next-nueva (la web sigue sirviendo desde .next)"
rm -rf "$RAIZ/.next-nueva"
# La variable la lee next.config.ts (`distDir`). Al arrancar no se define, así
# que `next start` sirve desde `.next`, que es donde `estrenar` la deja.
SIDEB_CARPETA_COMPILACION=.next-nueva "$NPM" run build

echo "==> Preparando $PUBLICO"

# El .htpasswd NO se toca nunca desde aquí: lo crea una persona a mano y es lo
# único que decide si la web está abierta o cerrada. Borrarlo por accidente en
# un despliegue publicaría la web sin que nadie lo pidiera.
CON_CONTRASENA=0
[ -f "$PUBLICO/.htpasswd" ] && CON_CONTRASENA=1

# Limpieza de lo que hubiera antes, respetando el .htpasswd.
#
# Importante que sea limpieza y no sólo copia: `robots.txt` y `sitemap.xml` los
# GENERA Next (app/robots.ts, app/sitemap.ts), pero nginx mira primero si
# existen como fichero aquí. Un `robots.txt` viejo —el que trae Hestia por
# defecto, por ejemplo— se serviría en lugar del bueno y nadie se enteraría.
find "$PUBLICO" -mindepth 1 -maxdepth 1 ! -name '.htpasswd' -exec rm -rf {} +

cp "$RAIZ/despliegue/proxy-php/proxy.php" "$PUBLICO/proxy.php"
cp "$RAIZ/despliegue/proxy-php/htaccess"  "$PUBLICO/.htaccess"

if [ "$CON_CONTRASENA" = "1" ]; then
  # Con contraseña, aquí NO se deja ni un fichero más.
  #
  # La tentación es dejar igualmente `.next/static` y `public/` para que nginx
  # los sirva directamente, que es más rápido. Pero nginx los serviría SIN
  # pasar por Apache, y la contraseña vive en el `.htaccess` de Apache: las
  # imágenes, los vídeos y las fuentes quedarían descargables por cualquiera
  # que acertara la URL. Mientras la web sea privada, todo entra por la misma
  # puerta aunque cueste un proceso de PHP por fichero.
  echo "    hay .htpasswd -> web PRIVADA, todo pasa por la contraseña"
else
  # Sin contraseña la web es pública y sí interesa la ruta rápida: nginx sirve
  # los estáticos desde disco con `expires max` y no despierta ni a PHP ni a
  # Node. Es lo que hace que una web de fotos y vídeo no vaya como el barro.
  echo "    no hay .htpasswd -> web PÚBLICA, estáticos servidos por nginx"
  mkdir -p "$PUBLICO/_next"
  # De `.next-nueva`: en este punto la web aún sirve la compilación anterior.
  cp -r "$RAIZ/.next-nueva/static" "$PUBLICO/_next/static"
  # `public/` va al raíz, que es donde Next lo sirve. El `.` del origen copia
  # el contenido y no la carpeta.
  cp -r "$RAIZ/public/." "$PUBLICO/"

  # El material del panel (Fase 3), igual de rápido: un ENLACE, no una copia.
  #
  # `_next/static` y `public/` se pueden copiar porque sólo cambian con un
  # despliegue. `media/` no: Mario sube y borra fotos y vídeos desde
  # `/admin` sin pasar por git ni por aquí. Si se copiara, lo nuevo no se
  # vería hasta el siguiente `git push`, y lo borrado seguiría serviéndose
  # —justo lo contrario de lo que promete el panel («guardas y se ve»)—.
  # Con un enlace, nginx sigue leyendo del mismo sitio donde Payload escribe:
  # se entera en el momento, sin desplegar nada.
  if [ -d "$RAIZ/media" ]; then
    mkdir -p "$PUBLICO/api/media"
    ln -s "$RAIZ/media" "$PUBLICO/api/media/file"
  fi
fi

# Apache y nginx leen esto como www-data; sin permiso de lectura, 403.
chmod -R a+rX "$PUBLICO"
# El fichero de contraseñas tiene que poder leerlo Apache, que en esta máquina
# corre como `www-data`.
#
# Lo suyo sería `chown :www-data` y 640, para que no lo lea nadie más. No se
# puede: `bote` no está en el grupo `www-data` y meterlo ahí es cosa de root.
# Así que 644, y conviene saber lo que eso concede: cualquier otro usuario de
# la máquina puede leer el hash. Es aceptable porque esto es una puerta
# temporal mientras la web no es pública, no una credencial de valor — pero no
# se le ponga aquí una contraseña que se use para otra cosa.
#
# Desde internet no se llega: nginx corta todo lo que empieza por punto
# (`location ~ /\.`) y Apache deniega `.ht*` por defecto.
[ "$CON_CONTRASENA" = "1" ] && chmod 644 "$PUBLICO/.htpasswd"

echo "==> Estrenando la compilación (parar, cambiar .next-nueva por .next, arrancar)"
"$RAIZ/despliegue/sidebflms-web.sh" estrenar \
  || { echo "No arrancó:"; tail -30 "$RAIZ/sidebflms-web.log"; exit 1; }

echo "==> Comprobando por dentro"
codigo=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 http://127.0.0.1:3200/es)
echo "    GET 127.0.0.1:3200/es -> $codigo"
[ "$codigo" = "200" ] || { echo "La aplicación no sirve la portada"; exit 1; }

echo "==> Publicado: $(git rev-parse --short HEAD)"
