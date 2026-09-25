import { Suspense } from "react";
import { Gutter } from "@payloadcms/ui";
import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";

import { ficheroDeOrigen, horasDesde, leerPaginas, leerSalud, type Pagina } from "./seo-datos";
import { type Enlace, SeoTablaPaginas } from "./seo-tabla-paginas";
import { SeoVisitas } from "./seo-visitas";

/**
 * "SEO Y ESTADÍSTICAS". Fase 22, 2026-09-25.
 *
 * Vista de sólo lectura: no guarda nada, no toca ninguna colección. Tres
 * bloques —visitas, salud (la nota) y la tabla por página—, en ese orden en
 * el código pero NO en pantalla: la tabla por página es la que de verdad se
 * usa para arreglar cosas, así que la nota general va pequeña y discreta, no
 * como lo más grande de la pantalla (pedido explícito: un número grande
 * invita a optimizar el número, no la web).
 *
 * OJO, ESTO NO ES OPCIONAL: Payload NO exige sesión en las vistas
 * personalizadas por defecto —a diferencia de las de colección, que sí la
 * exigen solas—. `RootPage` mira `isCustomAdminView()` y, si es una vista
 * de las registradas en `admin.components.views`, SALTA su propio redirect a
 * /admin/login. Comprobado con un `curl` sin ninguna cookie contra
 * producción tras el primer despliegue: la vista entera —la tabla, los
 * problemas de cada página— se servía en un 200 a cualquiera. El caso lo
 * tiene que cubrir cada vista personalizada, así que se cubre aquí.
 */

function Frescura({ fechaISO, etiqueta }: { fechaISO: string | undefined; etiqueta: string }) {
  if (!fechaISO) {
    return (
      <p style={{ fontSize: 13, color: "var(--theme-warning-500)" }}>
        {etiqueta}: el cron nocturno todavía no ha corrido ninguna vez.
      </p>
    );
  }
  const horas = horasDesde(fechaISO);
  const vieja = horas > 48;
  const fecha = new Date(fechaISO).toLocaleString("es-ES", { dateStyle: "medium", timeStyle: "short" });
  return (
    <p style={{ fontSize: 13, color: vieja ? "var(--theme-error-500)" : undefined }}>
      {etiqueta}: {fecha} {vieja && `— hace más de 48 horas, puede estar desactualizado`}
    </p>
  );
}

function BloqueSalud({ salud }: { salud: ReturnType<typeof leerSalud> }) {
  if (!salud) return null;
  return (
    <details>
      <summary style={{ cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
        Nota general: {salud.pct}/100 ({salud.total}/{salud.max} puntos)
      </summary>
      <div style={{ marginTop: 10, display: "grid", gap: 4 }}>
        {salud.checks.map((c) => (
          <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, gap: 12 }}>
            <span>{c.titulo}</span>
            <span style={{ opacity: 0.7, whiteSpace: "nowrap" }}>
              {c.puntos}/{c.max} — {c.detalle}
            </span>
          </div>
        ))}
      </div>
    </details>
  );
}

/**
 * EL ENLACE DE CADA FILA. Sólo las fichas de trabajo son documentos de
 * Payload de verdad; para todo lo demás se enseña el fichero de origen en
 * vez de fingir un enlace que no lleva a ningún sitio (pedido explícito).
 */
async function resolverEnlaces(paginas: Pagina[], props: AdminViewServerProps): Promise<Record<string, Enlace>> {
  const payload = props.initPageResult.req.payload;
  const slugs = [...new Set(paginas.filter((p) => p.tipo === "proyecto").map((p) => p.slug).filter((s): s is string => !!s))];

  const idPorSlug = new Map<string, string | number>();
  await Promise.all(
    slugs.map(async (slug) => {
      const r = await payload.find({ collection: "proyectos", where: { slug: { equals: slug } }, limit: 1, depth: 0 });
      if (r.docs[0]) idPorSlug.set(slug, r.docs[0].id);
    })
  );

  const enlaces: Record<string, Enlace> = {};
  for (const p of paginas) {
    if (p.tipo === "proyecto" && p.slug && idPorSlug.has(p.slug)) {
      enlaces[p.ruta] = { tipo: "editar", href: `/admin/collections/proyectos/${idPorSlug.get(p.slug)}` };
    } else {
      enlaces[p.ruta] = { tipo: "fichero", ruta: ficheroDeOrigen(p.ruta) };
    }
  }
  return enlaces;
}

export async function SeoView(props: AdminViewServerProps) {
  // Ver el aviso de arriba: sin esto, la vista es pública. `props.user` es
  // el usuario autenticado con permisos de lectura de campo ya aplicados
  // (no `req.user`, que es el principal completo para control de acceso, y
  // que no hace falta aquí: sólo hace falta saber si hay alguien logueado).
  if (!props.user) redirect("/admin/login");

  const salud = leerSalud();
  const paginas = leerPaginas();
  const enlaces = paginas ? await resolverEnlaces(paginas.paginas, props) : {};

  return (
    <Gutter>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>SEO y estadísticas</h1>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 20 }}>
        Sólo lectura: no edita ninguna ficha. Los datos de salud y de la tabla por página los recalcula un cron cada
        noche —esta vista no ejecuta nada al abrirla—, salvo el botón «Volver a medir esta página» de cada fila, que
        vuelve a medir sólo esa URL al pulsarlo.
      </p>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Visitas (últimos 30 días)</h2>
        <Suspense fallback={<p style={{ fontSize: 13, opacity: 0.7 }}>Hablando con GoatCounter…</p>}>
          <SeoVisitas />
        </Suspense>
      </section>

      <section style={{ marginBottom: 32 }}>
        <Frescura fechaISO={salud?.fecha} etiqueta="Última salud SEO" />
        <BloqueSalud salud={salud} />
      </section>

      <section>
        <h2 style={{ fontSize: 16, marginBottom: 4 }}>Páginas ({paginas?.paginas.length ?? 0})</h2>
        <Frescura fechaISO={paginas?.fecha} etiqueta="Último barrido" />
        {!paginas ? (
          <p style={{ fontSize: 13, opacity: 0.7, marginTop: 8 }}>
            Sin datos todavía. En cuanto corra <code>despliegue/seo-nocturno.sh</code> por primera vez, esta tabla se
            rellena sola.
          </p>
        ) : (
          <div style={{ marginTop: 10 }}>
            <SeoTablaPaginas paginas={paginas.paginas} enlaces={enlaces} fechaBarrido={paginas.fecha} />
          </div>
        )}
      </section>
    </Gutter>
  );
}
