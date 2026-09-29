import "server-only";
import { timingSafeEqual } from "node:crypto";

/**
 * LA CLAVE QUE PIDEN /admin-carga, /admin-migra-material Y /admin-volcado.
 *
 * Las tres comparaban `clave !== process.env.PAYLOAD_SECRET` directamente:
 * `!==` sale en cuanto el primer carácter no coincide, así que alguien que
 * pudiera medir la respuesta tiene una pista más para adivinar la clave
 * carácter a carácter en vez de tener que acertarla entera de golpe. Con
 * PAYLOAD_SECRET (un token largo, no una contraseña corta) la ventana real es
 * mínima, pero es el mismo cambio en las tres rutas y no cuesta nada.
 *
 * La longitud sí se sigue filtrando (se compara antes de mirar el
 * contenido), pero la longitud no es el secreto.
 */
export function claveAdminValida(peticion: Request): boolean {
  const secreto = process.env.PAYLOAD_SECRET;
  if (!secreto) return false;

  const clave = new URL(peticion.url).searchParams.get("clave") ?? "";
  const a = Buffer.from(clave);
  const b = Buffer.from(secreto);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
