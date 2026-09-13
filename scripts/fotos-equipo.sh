#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Prepara las fotos del equipo para la página de Nosotros.
#
#   ./scripts/fotos-equipo.sh /ruta/a/la/carpeta/con/las/fotos
#
# La carpeta de entrada tiene que tener los ficheros NOMBRADOS POR SLUG,
# que es el que figura para cada persona en `content/team.ts`:
#
#   mario-bote.jpg   fernando.jpg   galoguin.jpg   ivan.jpg    jota.jpg
#   kenny.jpg        maria.jpg      nacho-lopez.jpg natalia.jpg
#   ruben.jpg        sergio.jpg
#
#   grupo.jpg        ← la foto de grupo
#
# Y, si existe, una subcarpeta `trabajando/` con fotos del equipo en faena.
# Esas NO van por slug: son de gente sin identificar todavía, así que se
# procesan todas las que haya, con el nombre que traigan.
#
# Vale .jpg, .jpeg, .png o .heic (la del iPhone). Da igual el tamaño o
# la orientación: el script recorta y escala todas igual.
#
# ── POR QUÉ UN SCRIPT Y NO A MANO ────────────────────────────────────
# Once fotos hechas por gente distinta llegan con once tamaños, once
# encuadres y once pesos. A mano se acaba con una a 8 MB y otra
# pixelada. Aquí todas salen iguales: los retratos a 4:5 y 800×1000, la
# de grupo a 21:9 y 2400 de ancho. `next/image` las convierte después a
# WebP/AVIF según el navegador, así que basta con guardar JPG.
#
# NO toca `content/team.ts`: al terminar dice qué líneas cambiar.
# ---------------------------------------------------------------------
set -uo pipefail

IN="${1:?uso: $0 /carpeta/con/las/fotos}"
RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# OUT_EQUIPO permite probar el script sin escribir en el repositorio.
OUT="${OUT_EQUIPO:-$RAIZ/public/media/equipo}"
mkdir -p "$OUT"

command -v ffmpeg >/dev/null || { echo "falta ffmpeg"; exit 1; }

# La entrada nunca puede ser la propia salida: sobrescribiría los originales.
case "$(cd "$IN" && pwd)" in "$OUT"*) echo "la carpeta de entrada no puede ser $OUT"; exit 1;; esac

buscar() {
  for ext in jpg jpeg png heic JPG JPEG PNG HEIC; do
    [ -f "$IN/$1.$ext" ] && { echo "$IN/$1.$ext"; return; }
  done
}

# Los HEIC del iPhone hay que pasarlos antes por `sips`.
#
# ffmpeg los decodifica montando por dentro un filtergraph complejo (la imagen
# viene en baldosas y hay que recomponerla), y entonces ya no deja poner un
# `-vf` encima: «Simple and complex filtering cannot be used together». Así que
# se convierte primero a JPG sin tocar nada más y se recorta después.
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

normalizar() {
  case "$(echo "${1##*.}" | tr 'A-Z' 'a-z')" in
    heic)
      local o="$TMP/$(basename "${1%.*}").jpg"
      sips -s format jpeg "$1" --out "$o" >/dev/null 2>&1 || { echo "$1"; return; }
      echo "$o" ;;
    *) echo "$1" ;;
  esac
}

hechos=0; faltan=()
SLUGS=(mario-bote fernando galoguin ivan jota kenny maria nacho-lopez natalia ruben sergio)

for s in "${SLUGS[@]}"; do
  f="$(buscar "$s")"
  if [ -z "$f" ]; then faltan+=("$s"); continue; fi
  f="$(normalizar "$f")"
  # Recorte 4:5 centrado en horizontal y ANCLADO ARRIBA en vertical: en un
  # retrato lo que importa es la cabeza, y centrar en vertical la corta
  # cuando la foto viene de cuerpo entero.
  ffmpeg -v error -y -i "$f" \
    -vf "crop='min(iw,ih*4/5)':'min(ih,iw*5/4)':'(iw-min(iw,ih*4/5))/2':0,scale=800:1000:flags=lanczos" \
    -q:v 3 "$OUT/$s.jpg" && hechos=$((hechos+1)) && echo "  ✓ $s"
done

g="$(buscar grupo)"
if [ -n "$g" ]; then
  g="$(normalizar "$g")"
  # 3:2, no 21:9.
  #
  # Era 21:9 cuando la foto iba a todo lo ancho encima de la rejilla de
  # nombres. Desde el 2026-09-13 va en la cabecera, en media columna al
  # lado del titular, y ahí una franja de 21:9 quedaría como un sello.
  # Además el original es 3578×2433, que ya es casi 3:2: así se recorta
  # lo mínimo y no se pierde gente por los lados.
  ffmpeg -v error -y -i "$g" \
    -vf "crop='min(iw,ih*3/2)':'min(ih,iw*2/3)',scale=1800:1200:flags=lanczos" \
    -q:v 3 "$OUT/grupo.jpg" && echo "  ✓ grupo"
fi

# ── Fotos de equipo trabajando ────────────────────────────────────────
# Mismo recorte 4:5 que los retratos, para que la tira se lea como una serie
# aunque las fotos vengan de sitios distintos. Anclado arriba por lo mismo:
# lo que interesa es la persona, no el suelo.
trabajando=0
if [ -d "$IN/trabajando" ]; then
  mkdir -p "$OUT/trabajando"
  for f in "$IN"/trabajando/*; do
    [ -f "$f" ] || continue
    b="$(basename "${f%.*}")"
    f="$(normalizar "$f")"
    ffmpeg -v error -y -i "$f" \
      -vf "crop='min(iw,ih*4/5)':'min(ih,iw*5/4)':'(iw-min(iw,ih*4/5))/2':0,scale=800:1000:flags=lanczos" \
      -q:v 3 "$OUT/trabajando/$b.jpg" && trabajando=$((trabajando+1)) && echo "  ✓ trabajando/$b"
  done
fi

echo
echo "Retratos: $hechos de ${#SLUGS[@]}"
[ "$trabajando" -gt 0 ] && echo "Fotos trabajando: $trabajando" 
if [ ${#faltan[@]} -gt 0 ]; then
  echo "Faltan: ${faltan[*]}"
  echo "(Mientras falte uno, la web NO enseña retratos: ver HAY_RETRATOS en content/team.ts.)"
fi
echo
echo "Ahora, en content/team.ts, cambia 'foto: null' por la ruta en cada persona que tenga foto:"
echo '  foto: "/media/equipo/<slug>.jpg"'
[ -n "$g" ] && echo 'Y la de grupo:  FOTO_GRUPO = "/media/equipo/grupo.jpg"'
