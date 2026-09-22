import "server-only";

import { headers } from "next/headers";

/**
 * LA IP DEL VISITANTE, la de verdad.
 *
 * La pone `proxy.php` en `x-real-ip` a partir de la IP de la conexión. NO se
 * mira `x-forwarded-for`: esa la puede escribir cualquiera en su petición, y
 * el proxy borra la que llega de fuera precisamente por eso.
 *
 * Puede no haber ninguna (al arrancar en local, o si algún día se sirve sin
 * ese proxy). Quien llama tiene que aguantar el `null`: el tope global de
 * `lib/limite-envios.ts` sigue contando igual.
 *
 * Vive aparte del límite para que aquél no dependa de Next y se pueda probar
 * suelto, que es como se comprobó el 2026-09-22.
 */
export async function ipDelVisitante(): Promise<string | null> {
  const cabeceras = await headers();
  const ip = cabeceras.get("x-real-ip")?.trim();
  return ip && ip.length <= 45 ? ip : null;
}
