# Despliegue de sidebflms.com

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
 htpasswd -bc ~/web/sidebflms.com/public_html/.htpasswd sideb 'LA_CONTRASEÑA'
chmod 640 ~/web/sidebflms.com/public_html/.htpasswd
```

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
  `public/`. nginx los sirve desde disco con `expires max` sin despertar ni a
  PHP ni a Node — que es lo que hace que una web de fotos y vídeo no vaya
  como el barro.

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
```

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

### CUIDADO con el inventario

`gear-inventario.sh` para su aplicación con `pkill -f next-server`. Eso valía
cuando era la única aplicación Next.js de la máquina; ahora hay dos con el
mismo usuario, así que **cada despliegue del inventario también mata esta
web**. El vigilante la repone en unos segundos, pero conviene arreglarlo allí:
que pare por puerto, como hace `sidebflms-web.sh`.

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

## Despliegue automático

`.github/workflows/deploy.yml`: cada empujón a `main` sube el código con
rsync, compila en el VPS y reinicia.

Secretos en GitHub → Settings → Secrets and variables → Actions:

| Secreto | Valor |
|---|---|
| `VPS_HOST` | `nastos.barrasa.dev` |
| `VPS_USER` | `bote` |
| `VPS_SSH_KEY` | La clave **privada** de `~/.ssh/nastos_gear_inventario` |

Son los mismos tres que ya tiene el repositorio del inventario; los secretos
no se comparten entre repositorios, hay que añadirlos también aquí.

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
| **404 en imágenes o fuentes** | Se quitó el `.htpasswd` sin volver a ejecutar `publicar.sh`, o al revés |
| **`robots.txt` raro** | Quedó un fichero viejo en `public_html` tapando el que genera Next. `publicar.sh` limpia el directorio justo por esto |

**Volver a la versión anterior:**

```bash
cd ~/sidebflms-web
git log --oneline -5
git checkout <commit-bueno>
./despliegue/publicar.sh
```
