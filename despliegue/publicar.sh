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

echo "==> Compilando"
"$NPM" ci --no-audit --no-fund
"$NPM" run build

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
  cp -r "$RAIZ/.next/static" "$PUBLICO/_next/static"
  # `public/` va al raíz, que es donde Next lo sirve. El `.` del origen copia
  # el contenido y no la carpeta.
  cp -r "$RAIZ/public/." "$PUBLICO/"
fi

# Apache y nginx leen esto como www-data; sin permiso de lectura, 403.
chmod -R a+rX "$PUBLICO"
# El fichero de contraseñas es la excepción: lo lee Apache (grupo www-data) y
# nadie más. Que no lo lea todo el mundo en la máquina.
[ "$CON_CONTRASENA" = "1" ] && chmod 640 "$PUBLICO/.htpasswd"

echo "==> Reiniciando la aplicación"
"$RAIZ/despliegue/sidebflms-web.sh" reiniciar \
  || { echo "No arrancó:"; tail -30 "$RAIZ/sidebflms-web.log"; exit 1; }

echo "==> Comprobando por dentro"
codigo=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 http://127.0.0.1:3200/es)
echo "    GET 127.0.0.1:3200/es -> $codigo"
[ "$codigo" = "200" ] || { echo "La aplicación no sirve la portada"; exit 1; }

echo "==> Publicado: $(git rev-parse --short HEAD)"
