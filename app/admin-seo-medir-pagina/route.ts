import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { getPayload } from "payload";
import config from "@payload-config";

import { BASE, CARPETA_DATOS, medirPagina } from "@/scripts/seo-lib.mjs";

type Pagina = Awaited<ReturnType<typeof medirPagina>> & { medida?: string };

/**
 * "VOLVER A MEDIR ESTA PÁGINA" (2026-09-26).
 *
 * Mide UNA sola URL con `medirPagina()` de `scripts/seo-lib.mjs` —la misma
 * función que usa `scripts/seo-paginas.mjs` dentro de su barrido de las 72,
 * no una copia— y actualiza sólo esa fila del `paginas.json` que lee la
 * vista. El cron nocturno sigue igual; esto es sólo para ver el efecto de
 * una edición sin esperar a la madrugada.
 *
 * ── AUTENTICACIÓN, NO OPCIONAL ───────────────────────────────────────────
 * Payload NO protege solo una ruta como ésta —no es una vista de las suyas,
 * es una ruta de la propia web—, y aquí importa más que en la vista: esto
 * EJECUTA algo (peticiones de red hacia nuestro propio dominio), no sólo
 * enseña un número. `payload.auth()` es la misma comprobación que hace
 * Payload por dentro para sus propias rutas; sin sesión válida, 401 antes
 * de tocar nada.
 */
export async function POST(peticion: Request): Promise<Response> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: peticion.headers });
  if (!user) return Response.json({ error: "No autenticado" }, { status: 401 });

  let ruta: unknown;
  try {
    ({ ruta } = await peticion.json());
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Sólo rutas con forma de página real de la web, con idioma delante. No es
  // una defensa contra quien ya tiene sesión —ésa la da el `auth` de
  // arriba—, es para no pedir por error algo que no es una URL de la web.
  if (typeof ruta !== "string" || !/^\/(es|en)\//.test(ruta)) {
    return Response.json({ error: "Ruta inválida" }, { status: 400 });
  }

  const fila: Pagina = await medirPagina(BASE + ruta);
  fila.medida = new Date().toISOString();

  // Se actualiza SÓLO esa fila del fichero que ya existe (si existe: si el
  // cron no ha corrido nunca, se crea con ésta como única fila). El resto se
  // queda exactamente como lo dejó el último barrido nocturno.
  const f = join(CARPETA_DATOS, "paginas.json");
  let datos: { fecha: string | null; base: string; paginas: Pagina[] };
  try {
    datos = JSON.parse(readFileSync(f, "utf8"));
  } catch {
    datos = { fecha: null, base: BASE, paginas: [] };
  }
  const i = datos.paginas.findIndex((p) => p.ruta === ruta);
  if (i >= 0) datos.paginas[i] = fila;
  else datos.paginas.push(fila);

  mkdirSync(dirname(f), { recursive: true });
  writeFileSync(f, JSON.stringify(datos, null, 2));

  return Response.json(fila);
}
