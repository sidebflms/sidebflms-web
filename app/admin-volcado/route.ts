import { getPayload } from "payload";
import config from "@payload-config";

/**
 * LA SALIDA DE EMERGENCIA: saca todo el contenido del panel a un fichero.
 *
 *   curl "http://localhost:3005/admin-volcado?clave=LA_CLAVE" > respaldo.json
 *
 * Devuelve los proyectos y el equipo tal como están en la base de datos, en
 * JSON, con los dos idiomas.
 *
 * ── PARA QUÉ SIRVE Y PARA QUÉ NO ────────────────────────────────────────
 * Sirve para que el contenido NO quede atrapado: si algún día se deja el
 * panel, esto es lo que hay que leer para volver a escribir
 * `content/projects.ts` y `content/team.ts`. También vale como respaldo suelto
 * que se puede guardar en cualquier sitio.
 *
 * NO devuelve los ficheros de contenido listos para pegar. Esos llevan
 * comentarios largos explicando de dónde sale cada dato —el nombre del fichero
 * del que salió un proyecto, por qué una foto está recortada a mano, qué está
 * pendiente de confirmar—, y eso no está en la base de datos porque no es
 * contenido, es memoria del equipo. Reconstruirlos sería tirar esa memoria.
 * Por eso los ficheros SIGUEN en el repositorio, aunque la web ya no los lea:
 * son la referencia y el plan B (ver lib/contenido.ts).
 *
 * Pide la misma clave que la carga, y por lo mismo.
 */
export async function GET(peticion: Request): Promise<Response> {
  const clave = new URL(peticion.url).searchParams.get("clave");
  if (!process.env.PAYLOAD_SECRET || clave !== process.env.PAYLOAD_SECRET) {
    return new Response("No encontrado", { status: 404 });
  }

  const payload = await getPayload({ config });
  const pide = (collection: "proyectos" | "equipo", locale: "es" | "en") =>
    payload.find({ collection, locale, limit: 500, sort: "orden", depth: 0 });

  const [proyectosEs, proyectosEn, equipoEs, equipoEn] = await Promise.all([
    pide("proyectos", "es"),
    pide("proyectos", "en"),
    pide("equipo", "es"),
    pide("equipo", "en"),
  ]);

  return Response.json(
    {
      sacadoEl: new Date().toISOString(),
      deDonde: "base de datos del panel (/admin)",
      proyectos: { es: proyectosEs.docs, en: proyectosEn.docs },
      equipo: { es: equipoEs.docs, en: equipoEn.docs },
    },
    {
      headers: {
        "Content-Disposition": `attachment; filename="contenido-sidebflms-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    }
  );
}
