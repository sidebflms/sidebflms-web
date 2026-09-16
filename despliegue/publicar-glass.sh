#!/usr/bin/env bash
# ---------------------------------------------------------------------
# VERSIÓN DE PRUEBAS «GLASS» (2026-09-16).
#
# Compila la rama `glass` y la sirve DENTRO del dominio de la web, en una
# ruta que sólo conoce quien tiene el enlace:
#
#   https://sidebflms.com/prueba-glass-47f47ad5/es
#
# Lo llama GitHub Actions en cada empujón a `glass`
# (.github/workflows/publicar-glass.yml). Vive en ~/sidebflms-glass, al lado
# de la web (~/sidebflms-web), y es un proceso Node aparte:
#
#   · Escucha en 127.0.0.1:3201. La web sigue en el 3200.
#   · Se compila con `basePath` = la ruta, así que todo lo suyo (páginas,
#     `_next/`, vídeos, fotos) cuelga de ella. Ver lib/base.ts.
#   · El `proxy.php` de la web manda a este puerto lo que empieza por la ruta,
#     y el `.htaccess` deja pasar esa ruta sin la contraseña. Esos dos
#     ficheros son de la WEB (rama main), no de aquí: este script no toca
#     `public_html` para nada.
#   · Va con `X-Robots-Tag: noindex` (next.config.ts).
#
# Para retirarla: quitar su línea del crontab, parar el 3201 y borrar la
# carpeta; y en main, las dos líneas de la ruta en proxy.php y .htaccess.
# ---------------------------------------------------------------------
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUTA=/prueba-glass-47f47ad5
PUERTO=3201
NPM=/usr/local/bin/npm
export PATH=/usr/local/bin:/usr/bin:/bin
export SIDEB_PUERTO="$PUERTO" SIDEB_RUTA="$RUTA"

cd "$RAIZ"

# ── ¿El puerto es nuestro? ───────────────────────────────────────────────
# En la máquina hay más aplicaciones Node del mismo usuario. Si el 3201 lo
# tuviera otra, `reiniciar` la mataría. `ss -p` sólo enseña el PID de los
# procesos propios; se comprueba que su carpeta de trabajo sea ésta.
if ss -ltn "sport = :$PUERTO" 2>/dev/null | grep -q ":$PUERTO"; then
  pid="$(ss -ltnp "sport = :$PUERTO" 2>/dev/null | grep -o 'pid=[0-9]*' | head -1 | cut -d= -f2)"
  if [ -z "$pid" ] || [ "$(readlink "/proc/$pid/cwd" 2>/dev/null)" != "$RAIZ" ]; then
    echo "El puerto $PUERTO lo usa otra aplicación (pid ${pid:-ajeno}). No sigo."
    exit 1
  fi
fi

# ── .env ─────────────────────────────────────────────────────────────────
# El de la web (configuración del correo) más lo propio de las pruebas. Los
# formularios funcionan y llegan al buzón de siempre, con «[PRUEBA GLASS]»
# delante del asunto. Se regenera en cada despliegue.
{
  [ -f "$HOME/sidebflms-web/.env" ] && cat "$HOME/sidebflms-web/.env"
  echo
  echo "NEXT_PUBLIC_BASE_PATH=$RUTA"
  echo "NEXT_PUBLIC_SITE_URL=https://sidebflms.com$RUTA"
  echo 'CORREO_PREFIJO_ASUNTO="[PRUEBA GLASS] "'
} > "$RAIZ/.env"

echo "==> Compilando (ruta $RUTA)"
export NEXT_PUBLIC_BASE_PATH="$RUTA" NEXT_PUBLIC_SITE_URL="https://sidebflms.com$RUTA"
"$NPM" ci --no-audit --no-fund
"$NPM" run build

echo "==> Reiniciando en el $PUERTO"
"$RAIZ/despliegue/sidebflms-web.sh" reiniciar \
  || { echo "No arrancó:"; tail -30 "$RAIZ/sidebflms-web.log"; exit 1; }

# ── Que siga viva: su propio vigilante en el cron ─────────────────────────
# Idempotente: quita la línea anterior de ESTA carpeta (no la de la web) y la
# vuelve a poner.
LINEA="* * * * * SIDEB_PUERTO=$PUERTO SIDEB_RUTA=$RUTA $RAIZ/despliegue/sidebflms-web.sh vigilar >> $RAIZ/vigilante.log 2>&1"
{
  { crontab -l 2>/dev/null || true; } | { grep -vF "$RAIZ/despliegue/sidebflms-web.sh" || true; }
  echo "$LINEA"
} | crontab -

echo "==> Comprobando por dentro"
codigo=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "http://127.0.0.1:$PUERTO$RUTA/es")
echo "    GET 127.0.0.1:$PUERTO$RUTA/es -> $codigo"
[ "$codigo" = "200" ] || { echo "La versión de pruebas no sirve la portada"; exit 1; }

echo "==> Publicada: $(git rev-parse --short HEAD 2>/dev/null || echo sin-git) en https://sidebflms.com$RUTA/es"
