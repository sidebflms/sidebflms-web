import "server-only";

/**
 * CUÁNTOS CORREOS PUEDE PROVOCAR UN VISITANTE.
 *
 * Los dos formularios mandan correo: uno al buzón de la empresa y otro —el
 * acuse— a la dirección que ha escrito quien rellena. Ese segundo es el
 * delicado: sin freno, cualquiera puede pedirle al servidor que le mande
 * correos a terceros, tantos como quiera, con la firma del dominio detrás.
 *
 * Esto pone el freno. No pretende parar a un atacante decidido con mil IPs;
 * pretende que el daño tenga techo: que no se pueda bombardear a nadie ni
 * quemar la reputación del dominio en una tarde.
 *
 * ── POR QUÉ EN MEMORIA Y NO EN UNA BASE DE DATOS ────────────────────────
 * La web corre como UN solo proceso de Node en el VPS (ver
 * `despliegue/sidebflms-web.sh`), así que un contador en memoria los ve todos.
 * Se pierde al reiniciar —un despliegue, el vigilante—, y eso es aceptable:
 * el tope diario global vuelve a cero como mucho una vez al día.
 *
 * Si algún día la web pasa a varios procesos o a un servicio sin estado, esto
 * DEJA DE VALER y hay que llevarlo a Redis o a la base de datos.
 *
 * ── DE DÓNDE SALE LA IP ─────────────────────────────────────────────────
 * De `x-real-ip`, que la pone `proxy.php` a partir de la IP real de la
 * conexión, NO de lo que diga el visitante. El proxy borra las cabeceras
 * `x-forwarded-*` que llegan de fuera justo para que esto no se pueda mentir.
 * Si aun así no hay IP, el envío cuenta igual para el tope global, que es el
 * que protege de verdad.
 */

/** Límites. Generosos para una persona, ridículos para un robot. */
export const LIMITES = {
  /** Envíos por IP en una hora. */
  porIpEnUnaHora: 3,
  /** Envíos por IP en un día. */
  porIpEnUnDia: 8,
  /** Envíos de toda la web en un día, vengan de donde vengan. */
  deTodaLaWebEnUnDia: 60,
} as const;

const UNA_HORA = 60 * 60 * 1000;
const UN_DIA = 24 * UNA_HORA;

/** Cuándo se envió cada cosa, por IP. Se poda en cada consulta. */
const porIp = new Map<string, number[]>();
/** El contador global, con la marca de cuándo empezó su día. */
let global = { desde: Date.now(), cuenta: 0 };

export type Veredicto = { ok: true } | { ok: false; motivo: "ip" | "global" };

/**
 * Apunta un envío y dice si se permite. Llamar UNA vez por envío, antes de
 * mandar nada: si devuelve `ok: false`, no se manda.
 */
export function permiteEnviar(ip: string | null): Veredicto {
  const ahora = Date.now();

  // El día global se reinicia solo.
  if (ahora - global.desde > UN_DIA) global = { desde: ahora, cuenta: 0 };
  if (global.cuenta >= LIMITES.deTodaLaWebEnUnDia) return { ok: false, motivo: "global" };

  if (ip) {
    // Poda: fuera todo lo de hace más de un día, y las IPs que se quedan sin
    // nada salen del mapa para que esto no crezca sin fin.
    for (const [clave, marcas] of porIp) {
      const vivas = marcas.filter((t) => ahora - t < UN_DIA);
      if (vivas.length) porIp.set(clave, vivas);
      else porIp.delete(clave);
    }

    const mias = porIp.get(ip) ?? [];
    const enUnaHora = mias.filter((t) => ahora - t < UNA_HORA).length;
    if (enUnaHora >= LIMITES.porIpEnUnaHora) return { ok: false, motivo: "ip" };
    if (mias.length >= LIMITES.porIpEnUnDia) return { ok: false, motivo: "ip" };

    porIp.set(ip, [...mias, ahora]);
  }

  global.cuenta += 1;
  return { ok: true };
}

/** Para las pruebas: deja los contadores como recién arrancado. */
export function olvidaTodo(): void {
  porIp.clear();
  global = { desde: Date.now(), cuenta: 0 };
}
