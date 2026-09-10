# Actualizaciones

Qué cambió, por qué, y qué hay que hacer al traerse el repositorio. Lo más
reciente arriba.

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
