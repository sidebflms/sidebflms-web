# La analítica (GoatCounter)

Mide visitas, páginas más vistas, de dónde llega la gente, país y dispositivo.
**Sin cookies**, así que no hace falta cartel de consentimiento y se cuenta a
todo el mundo, no sólo a quien acepta.

## Dónde está

En el servidor, en `~/analitica/`, y no en este repositorio: es un servicio
aparte, con su propia base de datos.

    ~/analitica/bin/goatcounter        el binario (Go, estático)
    ~/analitica/datos/…sqlite3         la base de datos
    ~/analitica/analitica.sh           arrancar / parar / estado / vigilar
    ~/analitica/credenciales.txt       usuario y clave del panel (chmod 600)

Escucha en `127.0.0.1:3400` y lo levanta el cron cada minuto si no responde,
igual que la web y que el inventario.

## Por qué GoatCounter y no Umami

Umami era la primera opción, pero necesita un servidor de base de datos y en
este VPS **no se puede crear una**: el usuario no tiene `sudo`, las órdenes de
Hestia le dan permiso denegado, y el rol de PostgreSQL que existe —el de la app
de inventario— no tiene permiso para crear bases (`rolcreatedb = f`). La única
salida habría sido meter las tablas de la analítica dentro de la base del
inventario, y entonces una restauración del inventario se llevaría por delante
la analítica.

GoatCounter es un binario estático con SQLite dentro: ni servidor de base de
datos, ni root, ni Docker.

## Lo que falta para que empiece a contar

Un paso que sólo se puede dar desde el panel de Hestia, porque crear dominios
necesita root:

1. **Crear el subdominio** `analitica.sidebflms.com` en el panel
   (`https://nastos.barrasa.dev:8083`), con certificado Let's Encrypt.

2. **Copiar estos dos ficheros** a su `public_html`:

       scp despliegue/analitica/proxy.php  bote@nastos.barrasa.dev:~/web/analitica.sidebflms.com/public_html/proxy.php
       scp despliegue/analitica/htaccess   bote@nastos.barrasa.dev:~/web/analitica.sidebflms.com/public_html/.htaccess

3. **Encender el script en la web**, añadiendo al `.env.production` del
   servidor:

       NEXT_PUBLIC_ANALITICA=https://analitica.sidebflms.com

   y reiniciando la web. Sin esa variable el script no se pinta: ver
   `components/layout/analitica.tsx`.

## Si se prefiere no crear subdominio

Se puede colgar del dominio principal en `/analitica`, arrancando GoatCounter
con `-base-path /analitica` y desviando esa ruta en el `.htaccess` de
sidebflms.com. Funciona, pero mezcla la analítica con el enrutado y con la
contraseña de la web, y hay que deshacerlo el día que se le dé subdominio. Por
eso no se ha hecho así.
