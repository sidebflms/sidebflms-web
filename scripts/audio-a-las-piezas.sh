#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Le pone sonido a las piezas de la web SIN volver a comprimir el vídeo.
#
#   ./scripts/audio-a-las-piezas.sh [/Volumes/@SIDEB404L/SHOWREEL]
#
# ── POR QUÉ EXISTE ───────────────────────────────────────────────────
# Las piezas de `public/media/` se generaron con `pieza-web.sh`, que
# llevaba un `-an`: salieron MUDAS, las 44. Por eso no suena un solo
# vídeo en la web, ni siquiera el reproductor con controles de la ficha
# de cada trabajo, donde el visitante sí puede subir el volumen.
#
# ── POR QUÉ NO SE VUELVE A CODIFICAR ─────────────────────────────────
# Porque no hace falta y es peor. Volver a pasar el máster por
# `pieza-web.sh` recomprime la imagen (pérdida de calidad sobre la que
# ya hay) y, sobre todo, **no reproduce el mismo corte**: el script
# arranca al 20 % de la duración, pero varias piezas se cortaron a mano
# antes de que el script existiera —la de DURO, por ejemplo, sale del
# segundo 171 de un máster de 4:22—. Recodificar cambiaría lo que se ve.
#
# Así que este script COPIA el vídeo publicado tal cual (`-c:v copy`,
# byte a byte) y sólo le añade la pista de audio del máster. La imagen
# queda idéntica; lo único que cambia es que ahora suena.
#
# ── CÓMO SABE DE QUÉ SEGUNDO DEL MÁSTER SACAR EL AUDIO ───────────────
# No lo supone: lo busca. Compara el primer fotograma de la pieza con
# fotogramas del máster hasta encontrar dónde encaja, primero de segundo
# en segundo y luego afinando de 40 en 40 ms. Si no encuentra un encaje
# claro, avisa y NO toca esa pieza — antes dejar una muda que meterle un
# audio desplazado.
#
# ── QUÉ ES «TENER AUDIO» AQUÍ ────────────────────────────────────────
# No basta con que el fichero traiga una pista: casi todos la traen. Lo
# que hay que mirar es si esa pista suena. Los planos de dron llevan
# pista de audio y está a −91 dB, que es silencio digital — el dron no
# tiene micrófono. Así que el script mide el nivel y descarta cualquier
# cosa por debajo de −60 dB.
#
# (Detalle que costó un rato: `ffprobe -select_streams a` saca una línea
# EN BLANCO antes del resultado en los ficheros de DJI, que declaran dos
# flujos de vídeo. Leer «la primera línea» hace creer que no hay audio
# donde sí lo hay. Por eso se filtran las vacías.)
#
# ── LO QUE ESTE SCRIPT NO HACE ───────────────────────────────────────
# - El reel de la portada se queda mudo a propósito (Mario, 2026-09-15:
#   «el reel de portada que no lleve sonido, no pasa nada»). Arranca
#   solo, así que iría `muted` de todas formas.
# - Las piezas cuyo máster no suena se saltan. Son las de dron, y no hay
#   nada que hacer con ellas: el sonido no existe en el origen.
# ---------------------------------------------------------------------
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# `MEDIA` se puede apuntar a otro sitio para probar el script sin tocar lo
# publicado. En uso normal no se toca.
MEDIA="${MEDIA:-$RAIZ/public/media}"
DISCO="${1:-/Volumes/@SIDEB404L/SHOWREEL}"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# El disco puede no estar: hay piezas cuyo máster está en este ordenador y
# ésas se pueden hacer igual. Sólo se avisa.
if [ ! -d "$DISCO" ]; then
  echo "Aviso: no está el disco de producción ($DISCO)."
  echo "Sigo con las piezas cuyo máster está en este ordenador."
  echo
fi

# ── QUÉ PIEZA SALE DE QUÉ MÁSTER ─────────────────────────────────────
# Sale de los comentarios `FUENTE:` de content/projects.ts, que es donde
# se anotó al crear cada ficha. Si se añade una pieza nueva, va aquí.
# ── QUÉ PIEZA SALE DE QUÉ MÁSTER ─────────────────────────────────────
# Las ocho primeras salen de los comentarios `FUENTE:` de
# content/projects.ts y viven en el disco de producción (ruta relativa).
#
# Las seis últimas están en este ordenador y se identificaron comparando
# fotogramas: el primero de la pieza publicada contra los del máster,
# aplicando antes el mismo recorte a 16:9 que hizo `pieza-web.sh`. Sin
# ese recorte no encaja ninguna, que es lo que pasó en el primer intento.
# Las rutas absolutas se usan tal cual; las relativas cuelgan del disco.
#
# NO ESTÁN TODAS, y es correcto: las piezas de dron —postales de Madrid,
# la costa, el pueblo, el recinto de Monegros— tienen el audio a −91 dB
# en el origen. El dron no graba sonido.
PIEZAS=(
  "fatima-hajji-fabrik|AFTERMOVIES/@sidebflms_17012026_FATIMA_HAJJI_FABRIK_Aftermovie.mp4"
  "adrian-mills-area19|AFTERMOVIES/@sidebflms_070326_ADRIAN MILLS ANL_AFTERMOVIE.mp4"
  "fabrik-150|AFTERMOVIES/@sidebflms_21022026_150_FABRIK_Aftermovie.mp4"
  "gordo-lebanon|MULTICAM/15082026 GORDO LEBANON HORIZONTA 1.mp4"
  "prospa-multicam|MULTICAM/@SIDEBFLMS_31132026_PROSPA_MULTICAM_1.mp4"
  "monegros-hora-dorada|DRONE/@SIDEBFLMS_MONEGROS POSTCARD4.mp4"
  "duro-pyroshow|DRONE/DURO PYROSHOW 2 HORIZONTAL.mp4"
  "metropolitano|DRONE/@sidebflms_METROPOLITANO.mp4"
  "sala-llena|$HOME/Desktop/PARA-LA-WEB/clubes-y-festivales/SIDEBFLMS BTS - 16 of 64.mp4"
  "sala-en-rojo|$HOME/Desktop/PARA-LA-WEB/clubes-y-festivales/SIDEBFLMS BTS - 23 of 64.mp4"
  "cabina-y-publico|$HOME/Desktop/PARA-LA-WEB/clubes-y-festivales/SIDEBFLMS BTS - 15 of 64.mp4"
  "en-cabina|$HOME/Desktop/PARA-LA-WEB/clubes-y-festivales/SIDEBFLMS BTS - 28 of 64.mp4"
  "escenario-de-noche|$HOME/Desktop/PARA-LA-WEB/duro/SIDEBFLMS BTS - 13 of 64.mp4"
  "mitt-motors|$HOME/Desktop/PARA-LA-WEB/mitt-motors/SIDEBFLMS BTS - 60 of 64.mp4"
)


# Huella de un fotograma: 64×36 en gris, en crudo.
huella() { # fichero  segundo  salida
  ffmpeg -v error -y -ss "$2" -i "$1" -frames:v 1 -map 0:v:0 \
    -vf "crop='min(iw,ih*16/9)':'min(ih,iw*9/16)',scale=64:36,format=gray" \
    -f rawvideo "$3" 2>/dev/null
}

# Distancia media entre dos huellas (0 = iguales).
distancia() {
  python3 - "$1" "$2" <<'PY'
import sys
a=open(sys.argv[1],'rb').read(); b=open(sys.argv[2],'rb').read()
print(999 if len(a)!=len(b) or not a else sum(abs(x-y) for x,y in zip(a,b))/len(a))
PY
}

hechas=0; saltadas=0
for fila in "${PIEZAS[@]}"; do
  nombre="${fila%%|*}"; relativa="${fila#*|}"
  case "$relativa" in /*) master="$relativa" ;; *) master="$DISCO/$relativa" ;; esac
  pieza="$MEDIA/$nombre.mp4"

  echo "── $nombre"
  if [ ! -f "$master" ]; then echo "   máster no encontrado: $relativa"; saltadas=$((saltadas+1)); continue; fi
  if [ ! -f "$pieza" ];  then echo "   pieza no encontrada"; saltadas=$((saltadas+1)); continue; fi

  # Hay pista? (filtrando la línea en blanco que sacan los ficheros de DJI)
  if [ -z "$(ffprobe -v error -select_streams a:0 -show_entries stream=codec_name -of csv=p=0 "$master" | grep -v '^$' | head -1)" ]; then
    echo "   el máster no trae pista de audio"; saltadas=$((saltadas+1)); continue
  fi
  # ¿Y suena? Los planos de dron traen pista a −91 dB: silencio digital.
  pico=$(ffmpeg -hide_banner -nostats -i "$master" -map 0:a:0 -af volumedetect -f null /dev/null 2>&1 | grep max_volume | awk '{print $5}')
  if [ -z "$pico" ] || (( $(echo "$pico < -60" | bc -l) )); then
    echo "   la pista del máster es silencio (pico ${pico:-?} dB): no hay nada que añadir"
    saltadas=$((saltadas+1)); continue
  fi

  huella "$pieza" 0 "$TMP/pieza.raw"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$master" | cut -d. -f1)

  mejor=""; mejorD=999
  for (( s=0; s<dur; s++ )); do
    huella "$master" "$s" "$TMP/m.raw" || continue
    d=$(distancia "$TMP/pieza.raw" "$TMP/m.raw")
    if (( $(echo "$d < $mejorD" | bc -l) )); then mejorD=$d; mejor=$s; fi
  done

  # Afinado de 40 en 40 ms alrededor del segundo encontrado.
  for off in -0.8 -0.6 -0.4 -0.2 0.2 0.4 0.6 0.8; do
    s=$(echo "$mejor + $off" | bc -l)
    (( $(echo "$s < 0" | bc -l) )) && continue
    huella "$master" "$s" "$TMP/m.raw" || continue
    d=$(distancia "$TMP/pieza.raw" "$TMP/m.raw")
    if (( $(echo "$d < $mejorD" | bc -l) )); then mejorD=$d; mejor=$s; fi
  done

  if (( $(echo "$mejorD > 8" | bc -l) )); then
    echo "   no encuentro dónde encaja (diferencia $mejorD): la dejo muda"
    saltadas=$((saltadas+1)); continue
  fi
  echo "   audio desde el segundo $mejor del máster (diferencia $mejorD)"

  for variante in "" "-vertical"; do
    destino="$MEDIA/$nombre$variante.mp4"
    [ -f "$destino" ] || continue
    ffmpeg -v error -y -ss "$mejor" -i "$master" -i "$destino" \
      -map 1:v:0 -map 0:a:0 -c:v copy -c:a aac -b:a 128k -shortest \
      -movflags +faststart "$TMP/salida.mp4"
    mv "$TMP/salida.mp4" "$destino"
    echo "   $(basename "$destino") ← con sonido"
  done
  hechas=$((hechas+1))
done

echo
echo "Listas: $hechas   ·   Sin tocar: $saltadas"
echo "El reel de la portada se queda mudo a propósito."
