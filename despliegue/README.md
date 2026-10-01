# Despliegue de sidebflms.com

> **Desde el 2026-10-01 la web se COMPILA EN GITHUB, no aquí.** El servidor
> tiene ~2,2 GB libres y ningún swap (sin root no se puede crear): `next build`
> moría con «Killed». `publicar.sh preparar` instala y migra, GitHub compila y
> sube `.next-nueva`, y `publicar.sh estrenar` la pone en marcha.
> `./despliegue/publicar.sh` sin argumentos sigue compilando aquí (sólo para
> emergencias). Ver `.github/actions/compilar-fuera/action.yml`.

Servidor **nastos.barrasa.dev** (161.97.179.70): Debian 12, Hestia 1.10.4,
usuario `bote` **sin sudo y sin Docker**. Node v26 ya instalado.

La web es Next.js: hay una ruta que se renderiza en el servidor
(`/[locale]/portfolio`), un redirector de idioma y una acción de servidor para
el formulario. **No se puede servir como ficheros sueltos** — hace falta un
proceso Node permanente.

Ese proceso escucha **sólo en 127.0.0.1:3200**. Si escuchara en todas las
interfaces, cualquiera podría entrar por el 3200 saltándose el HTTPS y la
contraseña.

---

## El camino que sigue una petición

```
navegador
  → nginx        (HTTPS, puerto 443)
  → Apache       (puerto 8443, es quien lee el .htaccess → LA CONTRASEÑA)
  → proxy.php    (un proceso PHP por petición)
  → Node         (127.0.0.1:3200)
```

El salto por PHP es un apaño, y está explicado con detalle en la cabecera de
`proxy-php/proxy.php`: lo correcto sería que nginx hablara directamente con
Node, y Hestia trae una plantilla `NodeJS` para eso, pero necesita un fichero
en un directorio de root. Sin administrador, no hay forma. Lo que sí es
nuestro es `public_html`, con `AllowOverride All` y PHP-FPM.

Es el mismo montaje que `gear.sidebflms.com`, del que se copió.

---

## La contraseña

Mientras la web no sea pública, Apache pide usuario y contraseña.

**Se activa sola con la sola presencia del fichero.** El `.htaccess` mete el
bloque de autenticación dentro de un `<IfFile>`, así que:

| | |
|---|---|
| **Existe** `public_html/.htpasswd` | Web privada: pide contraseña |
| **No existe** | Web pública, sin más |

(El `<IfFile>` no es adorno: si `AuthUserFile` apuntara a un fichero que no
está, Apache devolvería **500 en toda la web**, no «sin contraseña».)

### Ponerla

Con un espacio delante, para que no quede en el historial del shell:

```bash
htpasswd -c ~/web/sidebflms.com/public_html/.htpasswd sideb
chmod 644 ~/web/sidebflms.com/public_html/.htpasswd
```

Sin `-b`: así la pide por teclado y no queda en el historial del shell.

**644 y no 640**, aunque chirríe: Apache corre como `www-data` y tiene que
poder leerla. Lo correcto sería `chown :www-data` con 640, pero `bote` no está
en ese grupo y meterlo ahí es cosa de root. Con 644 cualquier otro usuario de
la máquina puede leer el hash — vale para una puerta temporal, no le pongas
una contraseña que uses para otra cosa. Desde internet no se llega: nginx
corta todo lo que empiece por punto y Apache deniega `.ht*` por defecto.

Si se queda en 640, el síntoma es **500 en toda la web**, no «sin
contraseña».

### Quitarla, el día de publicar

```bash
rm ~/web/sidebflms.com/public_html/.htpasswd
cd ~/sidebflms-web && ./despliegue/publicar.sh
```

El `publicar.sh` hace falta después de quitarla, y no es un detalle: **cambia
lo que se sirve**, no sólo si se pide contraseña.

- **Con contraseña**, `public_html` no lleva ni un fichero estático. Todo —
  imágenes, fuentes, vídeos, JavaScript — entra por Apache y pasa por la
  puerta. Cuesta un proceso PHP por fichero, y da igual: es lo que hace que
  la web sea de verdad privada.
- **Sin contraseña**, el despliegue deja ahí una copia de `.next/static` y de
  `public/`, y un ENLACE (no una copia) de `api/media/file` hacia
  `~/sidebflms-web/media`, la carpeta donde vive el material subido desde el
  panel. nginx sirve todo eso desde disco con `expires max` sin despertar ni a
  PHP ni a Node — que es lo que hace que una web de fotos y vídeo no vaya
  como el barro. Que sea un enlace y no una copia importa: si fuera copia,
  una foto subida o borrada en `/admin` no se vería hasta el siguiente
  despliegue.

Si se quita el `.htpasswd` y no se vuelve a desplegar, la web queda pública
**y** lenta, sirviéndolo todo por PHP.

---

## Los mandos

```bash
cd ~/sidebflms-web
./despliegue/sidebflms-web.sh estado       # ¿viva? ¿y responde?
./despliegue/sidebflms-web.sh reiniciar
./despliegue/sidebflms-web.sh registro     # el log, en directo
./despliegue/publicar.sh                   # compilar y publicar entero
./despliegue/sidebflms-web.sh estrenar     # poner en marcha una .next-nueva ya compilada
```

### La web no se para mientras se compila

`publicar.sh` compila en `.next-nueva` mientras el proceso viejo sigue sirviendo
desde `.next`, y `estrenar` cambia las carpetas de nombre en el instante del
reinicio (la anterior queda en `.next-anterior` por si hay que volver). Las
dependencias sólo se reinstalan si cambió `package-lock.json`: `npm ci` borra
`node_modules` entero, y hacerlo bajo un proceso en marcha dejaba «Cannot find
module» a quien pidiera el panel durante ese minuto. Un despliegue que sí
cambie dependencias sigue teniendo esa ventana; es el precio de no tener root.

### Que siga viva sin systemd

Un vigilante en el cron del usuario, cada minuto:

```
* * * * * /home/bote/sidebflms-web/despliegue/sidebflms-web.sh vigilar >> /home/bote/sidebflms-web/vigilante.log 2>&1
```

No comprueba una sola vez: se queda mirando el minuto entero, **cada cinco
segundos**. El cron no baja del minuto, y hasta 60 segundos con la web de la
empresa caída es mucho cuando el enlace está en la bio de Instagram.

Un cerrojo con `mkdir` —atómico en cualquier sistema de ficheros— evita que
dos pasadas se solapen y arranquen dos procesos peleándose por el puerto.

*(Y no systemd, que necesitaría `loginctl enable-linger`, que es root. Se puede
prescindir de él porque en esta máquina `KillUserProcesses` no está fijado: un
proceso en segundo plano sobrevive al cierre de la sesión SSH.)*

### Los dos cerrojos

`.vigilante.lock` evita que dos pasadas del cron se solapen. `.operacion.lock`
—el que se coge para parar o arrancar— evita lo otro: que el vigilante levante
la web justo en el hueco en que la está reiniciando una publicación, y acaben
los dos lanzando `npm start` sobre el mismo puerto. Cuando el vigilante se
encuentra ese caso lo anota y se aparta:

```
[2026-09-10 13:15:08] caída, pero hay una operación en marcha: no me meto
```

Si un despliegue se queda parado diciendo que hay otra operación en marcha, el
mensaje trae las dos órdenes: `cat .operacion.lock/pid` para ver quién lo tiene
y `rm -rf .operacion.lock` si no corre nada.

### El inventario ya no tumba esta web

`gear-inventario.sh` paraba su aplicación con `pkill -f next-server`, que valía
cuando era la única aplicación Next.js de la máquina pero mataba también a
ésta. **Arreglado el 10-09-2026**: para por puerto, igual que este script. Si
algún día se añade una tercera aplicación Node, mientras cada una tenga su
puerto no hay nada que tocar.

---

## El correo del formulario

Va por SMTP contra el **Exim de la propia máquina** (127.0.0.1:25), sin claves
de API ni proveedor externo. El razonamiento completo está en `lib/correo.ts`.

| Variable (`~/sidebflms-web/.env`) | Por defecto |
|---|---|
| `CORREO_DESTINO` | `contact@sidebflms.com` |
| `CORREO_REMITENTE` | `contact@sidebflms.com` |
| `SMTP_HOST` | `127.0.0.1` |
| `SMTP_PORT` | `25` |

El `.env` es **opcional**: sin él la web arranca igual con esos valores.

**Pendiente, y hay que resolverlo antes de abrirla al público:** la web
anuncia `hola@sidebflms.com` en el pie, en la página de contacto y en los
textos legales, y **ese buzón no existe**. Quien escriba ahí a mano recibe un
rebote. Hay que crearlo en Hestia o cambiar los textos.

---

## El panel de "SEO y estadísticas" (Fase 22, 2026-09-25)

Vista de sólo lectura en `/admin/seo`. Dos cosas que no vienen solas con el
código y hay que dar de alta a mano en el servidor:

### 1. El cron nocturno

```bash
crontab -e
```

y añadir (una vez; no lo pone ningún script de despliegue):

```
7 3 * * * /home/bote/sidebflms-web/despliegue/seo-nocturno.sh >> /home/bote/datos-seo/seo-nocturno.log 2>&1
```

`despliegue/seo-nocturno.sh` usa `/usr/local/bin/node` con ruta absoluta a
propósito —el cron no hereda el `PATH` del usuario, y un `node` a secas no
encontraría nada—, y escribe en `~/datos-seo/`, **fuera** de
`~/sidebflms-web/`: el despliegue hace `rsync --delete` sobre esa carpeta y
cualquier cosa de aquí dentro que no esté en su lista de exclusiones
desaparece en la siguiente publicación. Es el mismo motivo por el que
`~/analitica/datos/` tampoco vive en un repositorio desplegado.

Para verlo funcionar sin esperar a las 3 de la noche:

```bash
~/sidebflms-web/despliegue/seo-nocturno.sh
cat ~/datos-seo/nocturno.json | head -5
```

Si la carpeta `~/datos-seo/` no existe, el script la crea solo.

### 2. El token de GoatCounter

El bloque de visitas llama a GoatCounter (`127.0.0.1:3400`) con un token que
**no genera ningún script**: se crea a mano desde su propio panel.

```bash
ssh -N -L 3400:127.0.0.1:3400 bote@nastos.barrasa.dev
```

y con eso abierto, en `http://localhost:3400` → Ajustes → API → crear un
token. Copiarlo en `~/sidebflms-web/.env`:

```
GOATCOUNTER_TOKEN=el-token-de-verdad
```

y reiniciar la web (`./despliegue/sidebflms-web.sh reiniciar`). El `.env` ya
está excluido del `rsync --delete` del despliegue (ver más abajo), así que el
token sobrevive a cada publicación sin tocar nada más. Sin este token, el
bloque de visitas lo dice con claridad en la propia vista — no rompe nada.

---

## Despliegue automático

`.github/workflows/deploy.yml`: cada empujón a `main` sube el código con
rsync, compila en el VPS y reinicia.

Secretos en GitHub → Settings → Secrets and variables → Actions:

| Secreto | Valor |
|---|---|
| `VPS_HOST` | `nastos.barrasa.dev` |
| `VPS_USER` | `bote` |
| `VPS_SSH_KEY` | La clave **privada** de `~/.ssh/nastos_web` |

**Su propia clave, y no la del inventario.** Es un par ed25519 creado el
2026-09-10 sólo para esto (`github-actions-deploy-web@20260910`, huella
`SHA256:j4+merEy53h4O66PSeMVAq5ThMa+TIbgTvLaUbGz0R4`), con la pública dada de
alta en `~/.ssh/authorized_keys` del VPS.

Reutilizar `nastos_gear_inventario` habría sido un comando y ya está, pero
entonces una sola clave abriría las dos aplicaciones y **revocarla las tumbaría
las dos**. Con una por sitio, el día que haya que retirar una, la otra sigue
desplegando. Es lo mismo que ya hacen `sidebfilms-studio-manager` y el
inventario entre sí.

Para retirarla: quitar la línea de `github-actions-deploy-web@20260910` de
`~/.ssh/authorized_keys` en el VPS. Con eso deja de entrar, sin tocar nada más.

A diferencia del inventario, el servidor **no** necesita deploy key: no lee de
GitHub, es el runner quien le empuja el código.

---

## Cuando algo va mal

```bash
./despliegue/sidebflms-web.sh estado           # ¿está viva?
tail -50 ~/sidebflms-web/sidebflms-web.log     # qué dijo al morir
tail -20 ~/sidebflms-web/vigilante.log         # cuándo tuvo que levantarla
curl -I http://127.0.0.1:3200/es               # ¿responde por dentro?
```

Si responde por dentro pero no desde fuera, el problema está en Apache, en
nginx o en el DNS, no en la web.

| Síntoma | Casi seguro |
|---|---|
| **500 en todo el sitio** | `AuthUserFile` apunta a un `.htpasswd` que no está, o Apache no puede leerlo (`chmod 640` y grupo `www-data`) |
| **502 «La aplicación no responde»** | Node caído y el vigilante sin poder levantarlo. Mira el registro |
| **500 sólo en `/admin` o en la API, un minuto, justo tras un empujón** | Un despliegue que cambió dependencias: `npm ci` vacía `node_modules` bajo el proceso viejo. Se cura solo al reiniciar; vuelve a probar |
| **404 en imágenes o fuentes** | Se quitó el `.htpasswd` sin volver a ejecutar `publicar.sh`, o al revés |
| **`robots.txt` raro** | Quedó un fichero viejo en `public_html` tapando el que genera Next. `publicar.sh` limpia el directorio justo por esto |

**Volver a la versión anterior:**

```bash
cd ~/sidebflms-web
git log --oneline -5
git checkout <commit-bueno>
./despliegue/publicar.sh
```

Ojo: el siguiente empujón a `main` vuelve a publicar lo que haya en `main`.
Para que la vuelta atrás dure, hay que revertir también en el repositorio.

### Las copias de seguridad

Cada despliegue, ANTES de subir nada, copia lo que está publicado en
`~/copias-web/sidebflms-web-<fecha>-<commit>/` (paso «Copia de seguridad» de
`deploy.yml`). Se guardan las tres últimas. Cada una lleva:

- `codigo/`: la carpeta `~/sidebflms-web` tal cual, con `.git`, `.env` y la
  compilación `.next` (sin `node_modules` ni la caché de Next).
- `public_html/`: el `.htaccess`, el `proxy.php` y el `.htpasswd`.

Restaurar una entera, sin depender de git:

```bash
COPIA=~/copias-web/sidebflms-web-<fecha>-<commit>
rsync -a --delete --exclude node_modules "$COPIA/codigo/" ~/sidebflms-web/
cd ~/sidebflms-web && ./despliegue/publicar.sh
```

Además, en GitHub, la etiqueta `web-anterior-2026-09-17` marca la última web
publicada antes de pasar a la versión glass.
