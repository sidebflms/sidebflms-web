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
# ── Se para por PUERTO, no por nombre de proceso ──────────────────────
# En la máquina hay DOS aplicaciones Next con el mismo usuario, así que
# un `pkill -f next-server` mataría también a la otra. Aquí se pregunta
# quién escucha en el 3200 y se mata a ése y a nadie más. Da igual cómo
# se llame el proceso y da igual cuántas aplicaciones Next haya al lado.
#
# (`gear-inventario.sh` hacía el `pkill` amplio y tumbaba esta web en
# cada despliegue del inventario. Desde el 10-09-2026 para por puerto
# también, así que eso ya no pasa.)
#
# ── Dos arranques a la vez sobre el mismo puerto ─────────────────────
# El vigilante y una operación manual pueden coincidir. Si alguien lanza
# `reiniciar` —o si lo lanza `publicar.sh`, que es lo habitual—, el
# vigilante ve la web caída durante la ventana de `parar` y la levanta
# él, a la vez que la levanta el propio `reiniciar`. Los dos lanzan
# `npm start`, uno pierde la carrera por el puerto y muere con
# EADDRINUSE. Se cura solo, pero deja en el registro un error que no es
# un error y que tapa los que sí lo son.
#
# Por eso hay un segundo cerrojo, `.operacion.lock`, que se explica más
# abajo: mientras alguien para o arranca, nadie más lo hace.
# ---------------------------------------------------------------------
set -uo pipefail

RAIZ="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REGISTRO="$RAIZ/sidebflms-web.log"
# 3200 es la web. La versión de pruebas (despliegue/publicar-glass.sh) usa este
# mismo script desde su propia carpeta con `SIDEB_PUERTO=3201` y
# `SIDEB_RUTA=/prueba-glass-…`, que es donde contesta su portada.
PUERTO="${SIDEB_PUERTO:-3200}"
RUTA="${SIDEB_RUTA:-}"

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

# ── Los dos cerrojos ─────────────────────────────────────────────────
# `.vigilante.lock` es el de siempre: impide que dos pasadas del cron se
# solapen. Lo coge `vigilar` y lo tiene los 55 segundos que dura.
#
# `.operacion.lock` es el nuevo, y protege lo único que de verdad no puede
# hacerse dos veces a la vez: parar o arrancar la web. Lo cogen
# `arrancar`, `parar` y `reiniciar`, y también el vigilante cada vez que va a
# levantarla — pero sólo mientras lo hace, no los 55 segundos.
#
# Hacen falta los dos y no vale con uno solo. Si las operaciones manuales
# esperaran al cerrojo del vigilante, cada `reiniciar` se quedaría parado
# hasta casi un minuto esperando a que el vigilante terminara su ronda.
CERROJO_VIGILANTE="$RAIZ/.vigilante.lock"
CERROJO_OPERACION="$RAIZ/.operacion.lock"
VIGILANTE_TOMADO=0
OPERACION_TOMADO=0

# `mkdir` es atómico en cualquier sistema de ficheros: o lo crea uno, o lo
# crea el otro, nunca los dos. Dentro se deja el PID de quien lo cogió, que
# es lo que permite reconocer luego un cerrojo abandonado.
coger() {
  mkdir "$1" 2>/dev/null || return 1
  echo $$ > "$1/pid" 2>/dev/null
  return 0
}

# Un cerrojo que se queda puesto para siempre es PEOR que no tener cerrojo:
# deja la web sin poder arrancar y nada lo dice. Los `trap` de abajo lo
# sueltan casi siempre, pero no si al script lo matan con KILL o si la
# máquina se apaga de golpe. Por eso: si el PID que hay dentro ya no existe,
# el cerrojo es basura y se retira.
#
# Los 10 segundos de gracia son para no confundir un cerrojo recién creado,
# al que aún no le ha dado tiempo a escribir su PID, con uno abandonado.
huerfano() {
  local pid nacido
  nacido="$(stat -c%Y "$1" 2>/dev/null)" || return 1
  [ $(( $(date +%s) - nacido )) -ge 10 ] || return 1
  pid="$(cat "$1/pid" 2>/dev/null)"
  [ -n "$pid" ] || return 0
  kill -0 "$pid" 2>/dev/null && return 1
  return 0
}

# Coge el cerrojo de operación esperando como mucho $1 segundos (0 = una sola
# intentona y a otra cosa). Es REENTRANTE: si este mismo script ya lo tiene
# —`reiniciar` llamando a `parar` y después a `arrancar`, o `vigilar`
# llamando a `arrancar`— no lo vuelve a coger ni lo suelta antes de tiempo.
tomar_operacion() {
  local espera="${1:-90}" fin retirado=0
  [ "$OPERACION_TOMADO" = 1 ] && return 0
  fin=$(( $(date +%s) + espera ))
  while :; do
    if coger "$CERROJO_OPERACION"; then OPERACION_TOMADO=1; return 0; fi
    # Una sola vez por intento, para no acabar en un bucle infinito si el
    # cerrojo no se deja borrar.
    if [ "$retirado" = 0 ] && huerfano "$CERROJO_OPERACION"; then
      retirado=1
      echo "cerrojo de operación abandonado (su proceso ya no existe): lo retiro"
      rm -rf "$CERROJO_OPERACION"
      continue
    fi
    [ "$(date +%s)" -lt "$fin" ] || return 1
    sleep 1
  done
}

soltar_operacion() {
  [ "$OPERACION_TOMADO" = 1 ] || return 0
  OPERACION_TOMADO=0
  rm -rf "$CERROJO_OPERACION"
}

# Lo que hacen las operaciones manuales: o cogen el cerrojo, o no se hace
# nada. Seguir adelante sin él es exactamente lo que lanzaba dos `npm start`
# a la vez.
exigir_operacion() {
  tomar_operacion 90 && return 0
  echo "hay otra operación en marcha que lleva más de 90 segundos sin soltar"
  echo "el cerrojo. Quién es:            cat $CERROJO_OPERACION/pid"
  echo "Si seguro que no corre nada:     rm -rf $CERROJO_OPERACION"
  exit 1
}

# Los cerrojos se sueltan pase lo que pase: al terminar bien, al fallar, y al
# recibir un Ctrl-C o un TERM, que sin esto se llevarían el script por delante
# dejando el cerrojo puesto.
soltar_todo() {
  soltar_operacion
  [ "$VIGILANTE_TOMADO" = 1 ] && { VIGILANTE_TOMADO=0; rm -rf "$CERROJO_VIGILANTE"; }
  return 0
}
trap soltar_todo EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

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

# Poner en marcha una compilación hecha aparte. `publicar.sh` compila en
# `.next-nueva` mientras la web sigue sirviendo desde `.next`; aquí se para la
# web, se cambian las carpetas de nombre y se arranca. El cambio de nombre son
# milésimas, así que la web no llega a servir nunca una mezcla de ficheros
# viejos y nuevos, que era lo que daba «Cannot find module» en cada despliegue
# a quien pidiera una página no precompilada (el panel) mientras compilaba.
#
# La compilación anterior se queda en `.next-anterior` por si hay que volver:
#   ./despliegue/sidebflms-web.sh parar
#   mv .next .next-rota && mv .next-anterior .next
#   ./despliegue/sidebflms-web.sh arrancar
estrenar() {
  if [ ! -d "$RAIZ/.next-nueva" ]; then echo "no hay .next-nueva que estrenar: compila antes"; return 1; fi
  parar || return 1
  rm -rf "$RAIZ/.next-anterior"
  [ -d "$RAIZ/.next" ] && mv "$RAIZ/.next" "$RAIZ/.next-anterior"
  mv "$RAIZ/.next-nueva" "$RAIZ/.next"
  arrancar
}

case "${1:-}" in
  arrancar|start)     exigir_operacion; arrancar ;;
  parar|stop)         exigir_operacion; parar ;;
  reiniciar|restart)  exigir_operacion; parar; arrancar ;;
  estrenar)           exigir_operacion; estrenar ;;
  estado|status)
    if esta_viva; then
      echo "en marcha (escuchando en 127.0.0.1:$PUERTO, pid $(pids_del_puerto | tr '\n' ' '))"
      echo -n "responde con HTTP "
      curl -s -o /dev/null -w '%{http_code}\n' --max-time 10 "http://127.0.0.1:$PUERTO$RUTA/es"
    else
      echo "parada"
    fi ;;
  vigilar)
    # Lo que llama el cron cada minuto, pero NO comprueba una sola vez: se
    # queda mirando durante el minuto entero, cada pocos segundos. El cron no
    # baja del minuto, y hasta 60 segundos con la web de la empresa caída es
    # mucho cuando el enlace está en la bio de Instagram.
    #
    # El cerrojo del vigilante evita que dos pasadas del cron se solapen.
    if ! coger "$CERROJO_VIGILANTE"; then
      # Ya hay otra pasada mirando... o el cerrojo es de un vigilante que
      # murió sin soltarlo, y entonces nadie estaría vigilando nunca más.
      if huerfano "$CERROJO_VIGILANTE"; then
        echo "[$(date '+%F %T')] cerrojo de vigilante abandonado: lo retiro"
        rm -rf "$CERROJO_VIGILANTE"
        coger "$CERROJO_VIGILANTE" || exit 0
      else
        exit 0
      fi
    fi
    VIGILANTE_TOMADO=1

    # 55 y no 60: la pasada siguiente entra antes de que ésta termine, y así no
    # hay un hueco de unos segundos sin nadie mirando.
    FIN=$(( $(date +%s) + 55 ))
    while [ "$(date +%s)" -lt "$FIN" ]; do
      # Calla si todo va bien: un vigilante que escribe en cada pasada
      # convierte el registro en ruido y esconde el único mensaje que importa.
      if ! esta_viva; then
        # Antes de levantarla, el cerrojo de operación. Si no lo consigue a
        # la primera es que hay un `parar`, un `arrancar` o un `reiniciar` en
        # marcha: la web está caída a propósito y vuelve en un momento, así
        # que el vigilante se retira y calla. Meterse aquí era justo lo que
        # lanzaba un segundo `npm start` que moría con EADDRINUSE.
        if tomar_operacion 0; then
          echo "[$(date '+%F %T')] no respondía, levantándola"
          arrancar
          soltar_operacion
        else
          # Una línea, y sólo cuando de verdad ha coincidido. Sin esto, un
          # hueco en el servicio durante un despliegue no lo explicaría nada
          # y habría que adivinarlo.
          echo "[$(date '+%F %T')] caída, pero hay una operación en marcha: no me meto"
        fi
      fi
      sleep 5
    done ;;
  registro|logs) tail -f "$REGISTRO" ;;
  puerto|port)   echo "$PUERTO" ;;
  *) echo "uso: $0 {arrancar|parar|reiniciar|estrenar|estado|vigilar|registro|puerto}"; exit 1 ;;
esac
