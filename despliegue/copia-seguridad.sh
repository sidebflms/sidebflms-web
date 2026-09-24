#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Copia de seguridad de la base del panel Y del material, cifrada y
# verificada. El mismo patrón que ya funciona en inventario-sidebfilms
# (`despliegue/copia-seguridad.sh` de ese repo), adaptado a dos cosas
# distintas de aquí:
#
#   1. La conexión no es una URL: son campos sueltos (PGHOST, PGUSER,
#      PGDATABASE...) y la contraseña vive en su propio fichero
#      (`PGPASSWORD_FILE`), tal y como la lee `payload.config.ts`. Una
#      URL se parte por la arroba o el interrogante que traiga la
#      contraseña generada por Hestia — por eso no se usa aquí tampoco.
#   2. Hay un segundo sitio que hace falta salvar: `~/sidebflms-web/media`.
#      Desde la Fase 3 del panel, las fotos y vídeos subidos ya NO viven
#      en la base de datos ni en el repositorio: son ficheros sueltos en
#      esa carpeta. Un `pg_dump` a secas no los toca. Van en el mismo
#      paquete cifrado que la base para que restaurar sea un solo paso.
#
#   La frase de cifrado se lee de la ENTRADA ESTÁNDAR, nunca de un
#   argumento: un argumento aparece en `ps`, donde lo lee cualquier
#   usuario de la máquina.
#
#     printf '%s' "$FRASE" | ./despliegue/copia-seguridad.sh
#
#   Y para restaurar: ver `docs/RESTAURAR.md`.
# ---------------------------------------------------------------------
set -euo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DESTINO="${DESTINO:-$HOME/backups}"
CUANTAS_GUARDAR="${CUANTAS_GUARDAR:-12}"
MINIMO_PROYECTOS="${MINIMO_PROYECTOS:-20}"
MINIMO_MATERIAL="${MINIMO_MATERIAL:-150}"

FRASE=$(cat)
[ -n "$FRASE" ] || { echo "No he recibido la frase de cifrado por la entrada estándar." >&2; exit 1; }

set -a; . "$RAIZ/.env"; set +a
: "${PGHOST:?falta PGHOST en el .env}"
: "${PGUSER:?falta PGUSER en el .env}"
: "${PGDATABASE:?falta PGDATABASE en el .env}"

# Misma lógica que `payload.config.ts`: la contraseña vive en su propio
# fichero, nunca en el `.env`, porque la almohadilla que pueda traer
# comentaría el resto de la línea. `pg_dump` la coge sola de PGPASSWORD.
if [ -n "${PGPASSWORD_FILE:-}" ]; then
  PGPASSWORD="$(cat "$PGPASSWORD_FILE")"
  export PGPASSWORD
elif [ -z "${PGPASSWORD:-}" ]; then
  echo "Ni PGPASSWORD_FILE ni PGPASSWORD están puestos: no hay con qué conectar." >&2
  exit 1
fi
export PGHOST PGPORT PGUSER PGDATABASE

MEDIA="$RAIZ/media"
[ -d "$MEDIA" ] || { echo "No existe $MEDIA — nada que copiar." >&2; exit 1; }

SELLO=$(date -u +%F)
TRABAJO=$(mktemp -d)
trap 'rm -rf "$TRABAJO"' EXIT

# Tres volcados, cada uno para un caso distinto de restauración — igual que en
# inventario-sidebfilms (ver el porqué de cada uno en su propio script):
#   completo → levantar la base entera en una máquina nueva  ← EL BUENO
#   datos    → repoblar un esquema que ya existe
#   esquema  → comparar con las migraciones y ver qué se movió por fuera
#
# --no-owner --no-privileges: el rol se llama distinto en cada máquina
# (aquí bote_panelweb, en otra otra cosa). Sin esto la restauración falla por
# un rol que no existe, justo el día que menos ganas hay de investigarlo.
echo "Volcando la base..."
pg_dump --no-owner --no-privileges              -f "$TRABAJO/completo.sql"
pg_dump --no-owner --no-privileges --data-only  -f "$TRABAJO/datos.sql"
pg_dump --no-owner --no-privileges --schema-only -f "$TRABAJO/esquema.sql"

# Una copia vacía que termina en verde es peor que una que falla: da la
# sensación de estar cubierto sin estarlo.
contar() {
  awk -v t="$1" '$0 ~ ("^COPY public\\." t " ") {c=1; next} c && /^\\\.$/ {exit} c {n++} END {print n+0}' "$TRABAJO/datos.sql"
}

echo "Filas por tabla:"
for t in proyectos equipo media cifras_items clientes_items preguntas; do
  printf '  %-20s %s\n' "$t" "$(contar "$t")"
done

PROYECTOS=$(contar proyectos)
MATERIAL=$(contar media)
if [ "$PROYECTOS" -lt "$MINIMO_PROYECTOS" ]; then
  echo "ERROR: la copia trae $PROYECTOS proyectos y debería haber más de $MINIMO_PROYECTOS." >&2
  echo "Algo va mal. No te fíes de esta copia." >&2
  exit 1
fi
if [ "$MATERIAL" -lt "$MINIMO_MATERIAL" ]; then
  echo "ERROR: la copia trae $MATERIAL ficheros de material en la base y debería haber más de $MINIMO_MATERIAL." >&2
  echo "Algo va mal. No te fíes de esta copia." >&2
  exit 1
fi

FICHEROS_MEDIA=$(find "$MEDIA" -type f | wc -l | tr -d ' ')
if [ "$FICHEROS_MEDIA" -lt "$MINIMO_MATERIAL" ]; then
  echo "ERROR: $MEDIA trae $FICHEROS_MEDIA ficheros y debería haber más de $MINIMO_MATERIAL." >&2
  echo "Algo va mal. No te fíes de esta copia." >&2
  exit 1
fi
echo "  carpeta media/     $FICHEROS_MEDIA ficheros, $(du -sh "$MEDIA" | cut -f1)"

echo "Empaquetando base + material..."
tar czf "$TRABAJO/plano.tar.gz" -C "$TRABAJO" completo.sql datos.sql esquema.sql -C "$RAIZ" media

mkdir -p "$DESTINO"
FICHERO="$DESTINO/sidebflms-web-$SELLO.tar.gz.gpg"
printf '%s' "$FRASE" | gpg --batch --yes --symmetric --cipher-algo AES256 \
  --passphrase-fd 0 -o "$FICHERO" "$TRABAJO/plano.tar.gz"

# Descifrar y comparar con el original. Si el cifrado hubiera salido mal, es
# mil veces mejor enterarse ahora que el día que haya que restaurar.
printf '%s' "$FRASE" | gpg --batch --yes --decrypt --passphrase-fd 0 "$FICHERO" \
  | cmp - "$TRABAJO/plano.tar.gz"
echo "cifrado verificado (se descifra y coincide con el original)"

# Rotar. Con una semanal, doce son unos tres meses.
ls -1t "$DESTINO"/sidebflms-web-*.tar.gz.gpg 2>/dev/null | tail -n +$((CUANTAS_GUARDAR + 1)) | xargs -r rm -f

echo
ls -lh "$FICHERO"
echo "copias guardadas: $(ls -1 "$DESTINO"/sidebflms-web-*.tar.gz.gpg 2>/dev/null | wc -l)"
