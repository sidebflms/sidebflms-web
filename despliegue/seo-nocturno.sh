#!/usr/bin/env bash
# ---------------------------------------------------------------------
# EL BARRIDO DE SEO DE CADA NOCHE (Fase 22, 2026-09-25).
#
# Lo llama el cron, una vez por noche. Hace dos cosas, en orden:
#   1. node scripts/seo-audit.mjs --guardar nocturno   (la nota, 7 páginas)
#   2. node scripts/seo-paginas.mjs                    (la tabla, todo el sitemap)
#
# Los dos escriben en $SEO_DATOS_DIR, FUERA de este repositorio (por
# defecto, ~/datos-seo): el despliegue hace `rsync --delete` sobre
# ~/sidebflms-web/ y cualquier cosa de aquí dentro que no esté en su lista
# de exclusiones desaparece en la siguiente publicación. Igual que pasa con
# ~/analitica/datos/, que tampoco vive dentro de un repositorio desplegado.
#
# RUTA ABSOLUTA A `node`, a propósito: el cron NO hereda el PATH del
# usuario, así que un simple `node` de aquí no encontraría nada y el script
# fallaría en silencio —el mismo motivo por el que sidebflms-web.sh usa
# NPM=/usr/local/bin/npm en vez de confiar en el PATH—. En este servidor
# conviven dos Node (18 en /usr/bin, 26 en /usr/local/bin); el bueno es el
# segundo.
# ---------------------------------------------------------------------
set -uo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE=/usr/local/bin/node
export PATH=/usr/local/bin:/usr/bin:/bin
export SEO_DATOS_DIR="${SEO_DATOS_DIR:-$HOME/datos-seo}"

mkdir -p "$SEO_DATOS_DIR"
cd "$RAIZ" || exit 1

echo "[$(date '+%F %T')] salud (7 páginas)"
"$NODE" scripts/seo-audit.mjs --guardar nocturno
estado_audit=$?

echo "[$(date '+%F %T')] tabla por página (todo el sitemap)"
"$NODE" scripts/seo-paginas.mjs
estado_paginas=$?

if [ "$estado_audit" -ne 0 ] || [ "$estado_paginas" -ne 0 ]; then
  echo "[$(date '+%F %T')] ALGO FALLÓ (salud=$estado_audit, páginas=$estado_paginas)"
  exit 1
fi
echo "[$(date '+%F %T')] hecho"
