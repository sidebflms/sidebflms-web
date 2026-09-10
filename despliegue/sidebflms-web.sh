#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Arrancar, parar y vigilar la web SIN systemd.
#
# Es el mismo patrón que `gear-inventario.sh` en el repositorio del
# inventario, y por las mismas razones: en nastos el usuario `bote` no
# tiene sudo, así que no hay servicio de systemd (haría falta
# `loginctl enable-linger`, que es root) ni Docker (haría falta estar en
# el grupo `docker`). Lo que sí hay:
#
#   1. `KillUserProcesses` no está fijado, así que un proceso lanzado en
#      segundo plano SOBREVIVE al cierre de la sesión SSH.
#   2. El usuario tiene `crontab`, que arranca con la máquina.
#
# Con eso, `vigilar` en el cron cada minuto hace el trabajo de systemd:
# levanta la web tras un reinicio del servidor y la repone si se cae.
#
# ── UNA DIFERENCIA QUE IMPORTA frente a gear-inventario.sh ────────────
# Aquel para la aplicación con `pkill -f next-server`. Eso valía cuando
# era la única aplicación Next.js de la máquina, pero ahora hay DOS con
# el mismo usuario: un `pkill` por nombre mataría también a la otra.
#
# Aquí se para por PUERTO: se pregunta quién escucha en el 3200 y se
# mata a ése y a nadie más. Da igual cómo se llame el proceso y da igual
# cuántas aplicaciones Next haya al lado.
#
# (`gear-inventario.sh` sigue teniendo el `pkill` amplio, así que un
# despliegue del inventario tumbará esta web unos segundos. El vigilante
# la repone sola, pero conviene arreglarlo allí.)
# ---------------------------------------------------------------------
set -uo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGISTRO="$RAIZ/sidebflms-web.log"
PUERTO=3200

# Ruta completa a propósito. En nastos conviven dos instalaciones de Node
# (/usr/bin/npm es npm 9 sobre Node 18; /usr/local/bin/npm es npm 11 sobre
# Node 26, que es con el que se instalan y compilan las dependencias), y el
# cron corre con un PATH mínimo que no incluye /usr/local/bin.
NPM=/usr/local/bin/npm
export PATH=/usr/local/bin:/usr/bin:/bin

# El puerto es lo que identifica al proceso, no un fichero con el PID: un
# fichero se queda obsoleto si la máquina se apaga de golpe, y entonces el
# vigilante cree que está viva cuando no lo está. Preguntar quién escucha en
# el puerto es la verdad, no una copia de la verdad.
esta_viva() { ss -ltn "sport = :$PUERTO" 2>/dev/null | grep -q ":$PUERTO"; }

# Quién escucha en NUESTRO puerto. `ss -p` sólo revela el PID de los procesos
# propios, que es justo lo que hace falta y todo lo que se puede saber sin
# privilegios.
pids_del_puerto() {
  ss -ltnp "sport = :$PUERTO" 2>/dev/null |
    grep -o 'pid=[0-9]*' | cut -d= -f2 | sort -u
}

rotar_registro() {
  # 5 MB. Sin esto el registro crece sin freno y acaba llenando el disco,
  # que es una forma tonta de tirar la web abajo.
  if [ -f "$REGISTRO" ] && [ "$(stat -c%s "$REGISTRO" 2>/dev/null || echo 0)" -gt 5242880 ]; then
    mv -f "$REGISTRO" "$REGISTRO.1"
  fi
}

arrancar() {
  if esta_viva; then echo "ya estaba en marcha"; return 0; fi
  if [ ! -d "$RAIZ/.next" ]; then echo "falta compilar: npm run build"; return 1; fi

  rotar_registro
  cd "$RAIZ" || return 1

  # El .env es opcional: la web arranca sin él. Lo único que vive ahí es la
  # configuración del correo del formulario de contacto, y si falta, el
  # formulario avisa en el registro en vez de tirar la página entera abajo.
  if [ -f "$RAIZ/.env" ]; then set -a; . ./.env; set +a; fi
  export NODE_ENV=production

  # `--hostname 127.0.0.1` explícito: `next start` escucha en 0.0.0.0 por
  # defecto, y entonces la web sería accesible por el puerto 3200 desde
  # fuera, saltándose el proxy de Hestia, el HTTPS y la contraseña.
  #
  # `setsid` la desliga de esta terminal para que no se vaya con ella.
  setsid nohup "$NPM" start -- --hostname 127.0.0.1 --port "$PUERTO" \
    >> "$REGISTRO" 2>&1 < /dev/null &
  disown 2>/dev/null || true

  for _ in $(seq 1 30); do sleep 1; esta_viva && { echo "en marcha"; return 0; }; done
  echo "NO arrancó. Últimas líneas de $REGISTRO:"; tail -20 "$REGISTRO"; return 1
}

parar() {
  local pids
  pids="$(pids_del_puerto)"
  if [ -z "$pids" ]; then echo "no había nada en el $PUERTO"; return 0; fi

  # TERM primero para que Next cierre a su ritmo; KILL sólo si se atasca.
  # shellcheck disable=SC2086
  kill $pids 2>/dev/null
  for _ in $(seq 1 15); do esta_viva || { echo "parada"; return 0; }; sleep 1; done

  echo "no se fue con TERM, mando KILL"
  # shellcheck disable=SC2086
  kill -9 $(pids_del_puerto) 2>/dev/null
  for _ in $(seq 1 5); do esta_viva || { echo "parada"; return 0; }; sleep 1; done
  echo "sigue viva tras 20s"; return 1
}

case "${1:-}" in
  arrancar|start)     arrancar ;;
  parar|stop)         parar ;;
  reiniciar|restart)  parar; arrancar ;;
  estado|status)
    if esta_viva; then
      echo "en marcha (escuchando en 127.0.0.1:$PUERTO, pid $(pids_del_puerto | tr '\n' ' '))"
      echo -n "responde con HTTP "
      curl -s -o /dev/null -w '%{http_code}\n' --max-time 10 "http://127.0.0.1:$PUERTO/es"
    else
      echo "parada"
    fi ;;
  vigilar)
    # Lo que llama el cron cada minuto, pero NO comprueba una sola vez: se
    # queda mirando durante el minuto entero, cada pocos segundos. El cron no
    # baja del minuto, y hasta 60 segundos con la web de la empresa caída es
    # mucho cuando el enlace está en la bio de Instagram.
    #
    # El cerrojo evita que dos pasadas se solapen. `mkdir` es atómico en
    # cualquier sistema de ficheros: si existe, es que ya hay una vigilando, y
    # dos a la vez podrían arrancar dos webs peleándose por el puerto.
    CERROJO="$RAIZ/.vigilante.lock"
    mkdir "$CERROJO" 2>/dev/null || exit 0
    # Se borra pase lo que pase, incluso si el script muere: un cerrojo
    # olvidado deja la web sin vigilancia y nada lo dice.
    trap 'rmdir "$CERROJO" 2>/dev/null' EXIT

    # 55 y no 60: la pasada siguiente entra antes de que ésta termine, y así no
    # hay un hueco de unos segundos sin nadie mirando.
    FIN=$(( $(date +%s) + 55 ))
    while [ "$(date +%s)" -lt "$FIN" ]; do
      # Calla si todo va bien: un vigilante que escribe en cada pasada
      # convierte el registro en ruido y esconde el único mensaje que importa.
      esta_viva || { echo "[$(date '+%F %T')] no respondía, levantándola"; arrancar; }
      sleep 5
    done ;;
  registro|logs) tail -f "$REGISTRO" ;;
  puerto|port)   echo "$PUERTO" ;;
  *) echo "uso: $0 {arrancar|parar|reiniciar|estado|vigilar|registro|puerto}"; exit 1 ;;
esac
