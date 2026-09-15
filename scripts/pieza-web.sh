#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Prepara una pieza del portfolio para la web, a partir del máster.
#
#   ./scripts/pieza-web.sh /ruta/al/master.mp4 nombre-de-la-pieza [segundo-del-poster]
#
# Deja en public/media/ cuatro ficheros:
#
#   nombre.mp4            1280×720   (16:9, el de la rejilla)
#   nombre.jpg            el póster del anterior
#   nombre-vertical.mp4   1080×1350  (4:5, para los huecos altos del mosaico)
#   nombre-vertical.jpg   su póster
#
# ── DE DÓNDE SALEN ESAS MEDIDAS ──────────────────────────────────────
# De las piezas que ya había: 1280×720 y 1080×1350, H.264 a 25 fps y
# alrededor de 1,7 Mb/s. Se mantienen para que el portfolio pese y se
# vea igual de una pieza a otra.
#
# ── POR QUÉ DOS RECORTES Y NO UNO ────────────────────────────────────
# Los másters de dron vienen en 4:3 con encuadre abierto (3840×2880), y
# eso permite sacar el apaisado Y el vertical del original, cada uno con
# su encuadre. Recortar el vertical a partir del apaisado sería recortar
# un recorte: se pierde cielo y suelo que en el máster están.
#
# ── EL AUDIO SE CONSERVA (desde el 2026-09-15) ───────────────────────
# Hasta esa fecha esto llevaba `-an` y las piezas salían MUDAS. Tenía su
# lógica —son bucles de fondo, y un vídeo que arranca solo tiene que ir
# en silencio o el navegador ni lo reproduce—, pero el efecto fue que en
# TODA la web no había un solo vídeo con sonido, ni siquiera el del
# reproductor con controles de la ficha de cada trabajo, donde el
# visitante sí puede darle al volumen.
#
# Ahora se conserva en AAC a 128 kb/s. Los bucles de fondo siguen mudos
# igual, porque lo decide el `muted` del HTML, no el fichero; la
# diferencia es que donde hay controles, ahora hay algo que oír.
#
# Cuesta unos 16 kB por segundo de pieza — nada al lado del vídeo.
#
# ── LA TRAMPA DE ESTOS FICHEROS ──────────────────────────────────────
# Los HEVC de DJI declaran DOS flujos de vídeo. Sin `-map 0:v:0` ffmpeg
# intenta servir los dos y falla con «Error reinitializing filters», que
# no dice nada de la causa. Costó encontrarlo; por eso está escrito.
# ---------------------------------------------------------------------
set -euo pipefail

MASTER="${1:?uso: $0 master.mp4 nombre [segundo-del-poster]}"
NOMBRE="${2:?falta el nombre de la pieza}"

# ── CUÁNTO SE QUEDA ──────────────────────────────────────────────────
# 12 segundos como mucho, y desde DESDE (por defecto el 20 % del clip,
# para saltarse el arranque, que en metraje de dron suele ser el
# despegue o la corrección de encuadre).
#
# No es un capricho: las piezas que ya había duran 9-12 s y pesan 2-3 MB.
# Sin este tope, un máster de 65 s salía a 14 MB — cinco veces el resto—,
# y en un mosaico donde puede haber ocho vídeos cargados eso se nota.
MAX="${MAX_SEG:-12}"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${OUT_MEDIA:-$RAIZ/public/media}"
mkdir -p "$OUT"

DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$MASTER" | cut -d. -f1)
DUR=${DUR:-12}
if [ "$DUR" -gt "$MAX" ]; then DESDE=$(( DUR * 20 / 100 )); else DESDE=0; fi
POSTER_EN="${3:-$(( MAX * 45 / 100 ))}"

comun=(-ss "$DESDE" -t "$MAX" -map 0:v:0 -map 0:a:0? -c:a aac -b:a 128k -c:v libx264 -profile:v high -pix_fmt yuv420p -r 25 -b:v 1700k -maxrate 2200k -bufsize 4000k -movflags +faststart)

echo "==> $NOMBRE  (máster: $(basename "$MASTER"), ${DUR}s -> desde ${DESDE}s, ${MAX}s; póster en el ${POSTER_EN})"

# 16:9 — se recorta arriba y abajo del 4:3.
ffmpeg -v error -y -i "$MASTER" "${comun[@]}" \
  -vf "crop=iw:ih*9/16*(iw/ih)/(16/9)*16/9:0:(ih-ih*9/16*(iw/ih)/(16/9)*16/9)/2,scale=1280:720:flags=lanczos" \
  "$OUT/$NOMBRE.mp4" 2>/dev/null || \
ffmpeg -v error -y -i "$MASTER" "${comun[@]}" -vf "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale=1280:720:flags=lanczos" "$OUT/$NOMBRE.mp4"

# 4:5 — se recorta por los lados.
ffmpeg -v error -y -i "$MASTER" "${comun[@]}" \
  -vf "crop='min(iw,ih*4/5)':'min(ih,iw*5/4)',scale=1080:1350:flags=lanczos" "$OUT/$NOMBRE-vertical.mp4"

# Pósters: el MISMO instante en los dos, para que al arrancar el vídeo no
# haya salto entre la imagen fija y el primer fotograma.
ffmpeg -v error -y -ss "$POSTER_EN" -i "$OUT/$NOMBRE.mp4" -frames:v 1 -update 1 -q:v 3 "$OUT/$NOMBRE.jpg"
ffmpeg -v error -y -ss "$POSTER_EN" -i "$OUT/$NOMBRE-vertical.mp4" -frames:v 1 -update 1 -q:v 3 "$OUT/$NOMBRE-vertical.jpg"

for f in "$NOMBRE.mp4" "$NOMBRE-vertical.mp4" "$NOMBRE.jpg" "$NOMBRE-vertical.jpg"; do
  printf "    %-34s %s\n" "$f" "$(du -h "$OUT/$f" | cut -f1)"
done
