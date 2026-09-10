# Actualizaciones

Qué cambió, por qué, y qué hay que hacer al traerse el repositorio. Lo más
reciente arriba.

---

## 2026-09-10 (4) — Cobertura aérea: confirmado, y fuera el cartel

Mario confirma que **hay piloto certificado**. Era el último TODO marcado como
BLOQUEANTE ANTES DE PUBLICAR.

Lo que se veía hasta ahora: en la página de Servicios, junto al título
«Cobertura aérea», se le pintaba al visitante un **cartel naranja que decía
"Redacción pendiente de verificación"**. Una nota interna, en la web, a la
vista de cualquiera. Ya no está: `pending` pasa a `false` en los dos idiomas.

**La redacción se deja tal cual, genérica a propósito.** Lo confirmado es que
hay piloto certificado, y eso es exactamente lo que el texto dice, ni más ni
menos. Concretar más —la categoría de vuelo, el número de operador, qué se
coordinó con ENAIRE— exigiría sacarlo del papeleo, y eso no se escribe de
memoria: todo el argumento de venta del sitio es "somos los que sí tienen los
permisos", así que es el peor sitio posible para una imprecisión.

Con esto **no queda ningún TODO bloqueante** en el código. Lo que sigue
pendiente es material, no texto: los logos reales de clientes (con su permiso
de uso por escrito), las piezas de vídeo y foto de verdad, y el error de
hidratación.

---

## 2026-09-10 (3) — La dirección de correo, los logos y el compromiso de 24 h

### `hola@` pasa a ser `contact@`

La web anunciaba `hola@sidebflms.com` en el pie, en la página de contacto y en
los dos textos legales. **Ese buzón no existe**: todo el que escribiera ahí a
mano recibía un rebote, y nadie se enteraba de que había escrito.

Cambiado a `contact@sidebflms.com`, que sí existe como buzón en la máquina —
10 sitios entre `es.ts` y `en.ts`. Ahora coincide con el destinatario al que
ya entregaba el formulario, así que hay una sola dirección en todo el sistema
en vez de dos.

Si algún día se cambia la dirección visible, hay que cambiarla **también** en
`lib/correo.ts` (`CORREO_DESTINO`), o vuelve a haber dos y una de ellas
vuelve a ser mentira.

### Los nombres de la franja de clientes

Eran «Festival A», «Club B», «Festival C»… Tan sosos que no dejaban juzgar si
el diseño de la franja funcionaba. Sustituidos por nombres con la forma y la
longitud de wordmarks reales.

**Y son inventados. Ni uno corresponde a un cliente ni a un local que exista.**
Están puestos para ver el diseño. Publicarlos como clientes sería mentir, y el
que suenen creíbles es justo lo que los hace peligrosos: un visitante no puede
distinguirlos de los de verdad.

Por eso el rótulo «Logos pendientes de permiso de uso» **sigue visible debajo**
y no se quita hasta que estén los logos reales. Sigue haciendo falta el
permiso de uso de marca por escrito de cada cliente antes de publicar ninguno
— el brief lo marca como condición, no como formalidad.

### El compromiso de 24 h laborables: confirmado

Era el TODO que quedaba desde el principio. Mario confirma que es real, así
que la frase se queda. Sigue apareciendo una sola vez, en el acuse de recibo.

### El aviso legal se queda como está

Sin CIF ni domicilio, por decisión expresa. Queda incumpliendo el art. 10 de
la LSSI-CE; los sitios donde habría que ponerlos siguen señalados en el código
por si algún día se quiere arreglar.

---

## 2026-09-10 (2) — Los textos, al castellano de España

Todos los cambios son de copy y de textos legales; no se ha tocado nada del
despliegue ni del código.

### El castellano estaba en voseo rioplatense

«Contanos qué evento tenés», «Podés marcar varias», «Elegí una opción»,
«Seguinos», «Filtrá por disciplina», «Probá otra vez»… La empresa es española
y el grueso del tráfico llega de España, donde eso se lee como escrito por
alguien de fuera. Pasado entero a castellano peninsular: 15 cadenas en
`es.ts`.

**Comprobado a 375 px**, que es donde importa: los titulares son arrays de
líneas porque Akira Expanded es extremadamente ancha, y «Cuéntanos» es más
largo que «Contanos». Encaja, y la fuente tiene la É acentuada — que era el
riesgo de verdad, no el ancho.

### El aviso legal: sólo SIDEBFLMS

Tenía `[Razón social] · [CIF] · [Domicilio fiscal]` sin rellenar. Por decisión
de Mario se queda **sólo «SIDEBFLMS»** y los otros dos se quitan *de momento*.

**Que conste, porque no es gratis:** el art. 10 de la LSSI-CE obliga a que un
sitio comercial publique nombre, NIF y domicilio de quien lo opera. Sin ellos
el aviso legal **no cumple**. Cuando se quieran poner, están señalados con un
comentario en `es.ts` y en `en.ts`, en el aviso legal y en el responsable de
la política de privacidad.

### La privacidad decía que la web está en Vercel, y ya no lo está

Decía «El sitio se aloja en Vercel Inc., que actúa como encargado del
tratamiento». Desde el despliegue de hoy eso es **falso**, y en un documento
legal un dato falso es peor que un hueco.

Comprobado quién es el proveedor real antes de escribirlo (RDAP de la IP
161.97.179.70): **Contabo GmbH, Alemania**. Así que ahora dice eso, y que los
datos no salen de la Unión Europea — que además es verdad y es información que
al visitante le sirve.

También se quitó el `[12]` de los corchetes del plazo de conservación: son 12
meses.

### La línea del aéreo ya dice algo

En la pieza destacada, la fila «Aéreo» decía literalmente «Redacción pendiente
de verificación» — visible en la web. Ahora dice **«Un drone por encima del
aforo»**.

Eso respeta el TODO original, que prohibía publicar afirmaciones sobre
permisos de vuelo sin el papeleo delante: esta frase describe el plano y no
afirma nada sobre categoría ni autorizaciones.

**Sigue pendiente** el bloque de «Cobertura aérea» en Servicios, que sí dice
«piloto certificado» y sigue sin contrastar.

### La promesa de 24 h estaba dos veces

Aparecía en la introducción de Contacto y otra vez en el acuse de recibo. Se
queda sólo en el acuse, que es donde el visitante la necesita — acaba de
enviar y quiere saber cuándo le contestan. Sigue **sin confirmarse que sea
real**; hay una nota en el código junto a la frase.

### Ojo, un fallo que ya venía de antes

Las páginas dan un **error de hidratación** de React en el navegador.
Comprobado que **no lo provocan estos cambios**: sale igual con el código
original (probado apartando los cambios con `git stash`). No se ha tocado,
pero está ahí y conviene mirarlo antes de abrir la web al público: en
producción hace que React vuelva a dibujar en el cliente, y eso se ve como un
parpadeo.

---

## 2026-09-10 — La web se publica en nastos

Hasta ahora esto era un proyecto que sólo corría en el portátil de quien lo
estuviera tocando. Ahora vive en el VPS **nastos.barrasa.dev**, detrás de
`sidebflms.com` y **con contraseña** mientras no se abra al público.

### Qué hacer si te traes el repositorio

1. `npm ci` — hay una dependencia nueva (`nodemailer`).
2. Nada más para desarrollar: `npm run dev` sigue funcionando igual. El
   formulario de contacto intentará enviar correo por `127.0.0.1:25`, no lo
   conseguirá en tu máquina, y lo dirá en la consola. Es lo esperado.
3. Si vas a tocar el despliegue, lee **`despliegue/README.md`** entero antes.

### Lo nuevo

**`despliegue/`** — todo el montaje del servidor. Es una copia adaptada del de
`gear.sidebflms.com`, que ya llevaba meses funcionando en la misma máquina, y
por las mismas razones: el usuario `bote` no tiene sudo ni Docker, así que no
hay systemd ni contenedores. Un proceso Node en `127.0.0.1:3200`, Apache
delante a través de un `proxy.php`, y un vigilante en el cron cada minuto.

Tres cosas que **no** son copia:

- **`sidebflms-web.sh` para el proceso por PUERTO**, no con
  `pkill -f next-server` como hace el del inventario. Da igual el nombre del
  proceso: se pregunta quién escucha en el 3200 y se mata a ése.

  *Por qué importa:* ahora hay **dos** aplicaciones Next.js con el mismo
  usuario en la misma máquina. Un `pkill` por nombre mata las dos. (Y eso es
  exactamente lo que sigue haciendo `gear-inventario.sh`, así que cada
  despliegue del inventario tumba esta web unos segundos hasta que el
  vigilante la repone. Conviene arreglarlo en aquel repositorio.)

- **La contraseña se activa con la sola presencia de un fichero.** Si existe
  `public_html/.htpasswd`, Apache la pide; si no, la web es pública. El
  bloque va dentro de un `<IfFile>`, y eso no es adorno: sin él, un
  `AuthUserFile` apuntando a un fichero que no está da **500 en toda la web**,
  no «sin contraseña».

  Y el despliegue **cambia lo que sirve** según eso. Con contraseña no deja ni
  un fichero estático en `public_html`, porque nginx los serviría sin pasar
  por Apache y las imágenes y los vídeos quedarían descargables saltándose la
  puerta. Sin contraseña sí los deja, y entonces nginx los sirve desde disco
  con `expires max` sin despertar a PHP ni a Node.

- **El despliegue automático empuja, no tira.** El workflow del inventario
  hace `git pull` dentro del servidor, lo que obliga a darle al servidor una
  deploy key de GitHub. Aquí el runner ya tiene el código y ya tiene llave del
  VPS: se lo lleva con rsync. Una credencial menos que crear y que rotar.

### El formulario de contacto ahora envía de verdad

**Antes no enviaba nada.** Validaba, decía «Recibido» al visitante, y escribía
la consulta en el log del servidor. Cualquiera que rellenara el formulario se
perdía sin que nadie se enterara — ni el visitante, que veía un acuse de
recibo, ni nosotros. El propio código lo tenía marcado como bloqueante.

Ahora va por SMTP contra el **Exim de la propia máquina**, sin proveedor
externo ni claves de API: el buzón de destino está en ese mismo servidor, así
que es entrega local y el mensaje ni sale a internet.

Dos detalles que parecen menores y no lo son, explicados en `lib/correo.ts`:

- El **`From` es nuestro y el visitante va en `Reply-To`**. Poner al visitante
  en el `From` es lo intuitivo, y es justo lo que el SPF de *su* dominio
  prohíbe: nuestro servidor no está autorizado a mandar correo en nombre de
  gmail.com. Acabaría en spam. Al responder desde el buzón, la respuesta le
  llega igual.
- **Si el envío falla, el formulario lo dice.** La pantalla ya sabía mostrar
  un error general; ahora se usa. Es mejor pedirle al visitante que escriba a
  mano que decirle «recibido» y perder la consulta.

Se configura por `~/sidebflms-web/.env` en el servidor, y es opcional:
`CORREO_DESTINO`, `CORREO_REMITENTE`, `SMTP_HOST`, `SMTP_PORT`. Sin fichero,
todo va a `contact@sidebflms.com` por `127.0.0.1:25`.

### `public/__mockup-preview.html` sale de `public/`

Está ahora en `docs/mockup-final.html`. Todo lo que hay en `public/` lo sirve
Next.js en internet tal cual, así que cualquiera podía abrir
`https://sidebflms.com/__mockup-preview.html` y bajarse 3,5 MB con la fuente
comercial **Akira Expanded incrustada en base64** dentro. No se ha borrado —
sigue a mano para consultarlo—, sólo se ha sacado de lo que se publica.

### Pendiente, y bloquea abrir la web al público

- **`hola@sidebflms.com` no existe.** La web lo anuncia en el pie, en la
  página de contacto y en los textos legales. Quien escriba ahí a mano recibe
  un rebote. Hay que crear el buzón en Hestia o cambiar los textos. El
  formulario, mientras tanto, entrega en `contact@`, que sí lo lee alguien.
- **Los textos legales tienen huecos sin rellenar**: `[Razón social]`,
  `[CIF]`, `[Domicilio fiscal]`. En España esos datos en el aviso legal son
  obligatorios (LSSI-CE).
- **Los textos en castellano están en voseo rioplatense** — «Contanos qué
  evento tenés», «Podés marcar varias», «Elegí una opción», «Seguinos». La
  empresa es española y el grueso del tráfico llega de España, donde eso se
  lee como escrito por alguien de fuera.
- **La promesa de «respondemos en 24 horas laborables»** aparece dos veces y
  el propio código la marca como pendiente de confirmar. Si no es real, hay
  que quitarla, no rebajarla.
