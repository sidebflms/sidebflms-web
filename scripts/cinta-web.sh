#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Versiones ligeras de las piezas para las CINTAS de la portada.
#
#   ./scripts/cinta-web.sh
#
# Por cada `public/media/<pieza>.mp4` deja dos ficheros al lado:
#
#   <pieza>-cinta.mp4    854×480, ~800 kb/s, SIN audio
#   <pieza>-cinta.webp   el póster, 854×480
#
# ── POR QUÉ HACEN FALTA ──────────────────────────────────────────────
# La portada tiene tres cintas con veintiún vídeos distintos. Servía el
# mismo fichero que la ficha de cada trabajo: 1280×720 a 1,76 Mb/s, unos
# 2,5 MB cada uno. Recorrer la portada entera son 52 MB.
#
# Y esos vídeos se ven en un recuadro de 398 px de ancho. O sea que se
# estaban mandando más de tres veces los píxeles que caben en pantalla.
# A 854×480 sigue sobrando resolución para una pantalla de densidad
# doble, y el fichero baja a unos 1,1 MB.
#
# ── POR QUÉ SIN AUDIO ────────────────────────────────────────────────
# Las cintas van mudas (lo decide el `muted` del HTML). Mandar la pista
# de audio para no reproducirla nunca son ~190 kB por pieza tirados.
# El sonido sigue donde se puede oír: en el fichero grande de la ficha.
#
# ── EL PÓSTER, EN WEBP ───────────────────────────────────────────────
# Es lo PRIMERO que se ve, antes de que el vídeo tenga un fotograma. En
# JPEG pesaban entre 60 y 180 kB cada uno; en WebP a este tamaño bajan a
# unos 35. Con veintiuno en pantalla, eso es lo que se nota al entrar.
#
# ── SI FALTA ALGUNO NO PASA NADA ─────────────────────────────────────
# El componente pide la versión de cinta y, si no existe, se cae a la
# grande (ver `components/sections/home-sliders.tsx`). Así, añadir una
# pieza nueva sin acordarse de este script se ve más lento, pero no se
# rompe.
# ---------------------------------------------------------------------
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MEDIA="${MEDIA:-$RAIZ/public/media}"

ANCHO=854
ALTO=480
BITRATE=800k

hechas=0
for origen in "$MEDIA"/*.mp4; do
  nombre="$(basename "$origen" .mp4)"

  # Ni los verticales (no se usan en las cintas), ni el reel (es otra cosa),
  # ni las propias versiones de cinta.
  case "$nombre" in
    *-vertical|*-cinta|reel-*) continue ;;
  esac

  destino="$MEDIA/$nombre-cinta.mp4"
  poster="$MEDIA/$nombre-cinta.webp"

  # `-n` no sobrescribe: volver a lanzarlo sólo hace lo que falta.
  if [ -f "$destino" ] && [ -f "$poster" ]; then
    continue
  fi

  echo "==> $nombre"

  ffmpeg -v error -y -i "$origen" \
    -map 0:v:0 -an \
    -vf "scale=$ANCHO:$ALTO:flags=lanczos" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -r 25 \
    -b:v "$BITRATE" -maxrate 1100k -bufsize 2000k \
    -movflags +faststart \
    "$destino"

  # El póster sale del propio recorte, no del máster: así coincide con el
  # primer fotograma que se va a ver y no hay salto al arrancar.
  #
  # En dos pasos porque el ffmpeg de esta máquina viene SIN codificador WebP
  # («Default encoder for format webp is probably disabled»). Se saca un PNG
  # y lo convierte `cwebp`, que sí está. Si algún día falta `cwebp`, se queda
  # el JPEG de siempre y el componente lo usa igual.
  tmp_png="$(mktemp -t cinta).png"
  ffmpeg -v error -y -i "$destino" -frames:v 1 -update 1 "$tmp_png"
  cwebp -quiet -q 72 "$tmp_png" -o "$poster"
  rm -f "$tmp_png"

  hechas=$((hechas + 1))
done

echo
echo "Listas: $hechas"
du -sh "$MEDIA" | cut -f1 | xargs echo "Peso total de media:"
