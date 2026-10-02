import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { CIUDADES_DRONE, type SlugCiudad } from "@/content/ciudades-drone";
import { traeCiudad, traeCiudades, traeProyectos } from "@/lib/contenido";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path, type RouteKey } from "@/lib/routes";

/**
 * PÁGINAS DE CIUDAD (SEO Fase 6, 2026-09-24; pasadas al panel en el roadmap
 * de 2026-09-26).
 *
 * Una única carpeta física para las tres ciudades —no una por ciudad—: el
 * contenido real sale de `traeCiudad`/`traeCiudades` (`lib/contenido.ts`),
 * que leen la colección `Ciudades` del panel y caen a
 * `content/ciudades-drone.ts` si la base no responde — el mismo mecanismo
 * que Proyectos o Equipo. Esta página sólo lo pinta. La URL bonita
 * (`/es/grabacion-con-drone-madrid`) la sirve un rewrite de
 * `next.config.ts` sobre esta misma ruta interna (`/es/ciudad-drone/madrid`);
 * mismo mecanismo que ya usa `/grabacion-con-drone` a secas para la página
 * de drone. Ver la nota de `droneMadrid` en `lib/routes.ts`.
 *
 * NADA DE PLANTILLA CON LA CIUDAD CAMBIADA: `generateStaticParams` sólo
 * genera las ciudades de `CIUDADES_DRONE` —el mapa de rutas fijo, no la
 * lista que devuelva el panel—, que son las que de verdad tienen trabajo
 * real y, sobre todo, las que tienen una URL que las sirva (ver el aviso de
 * `Ciudades` en `panel/colecciones.ts`: añadir una ciudad al panel no le da
 * dirección propia sola). Cualquier otra ciudad da 404, no una página de
 * relleno.
 */

const CLAVE_RUTA: Record<SlugCiudad, RouteKey> = {
  madrid: "droneMadrid",
  barcelona: "droneBarcelona",
  mallorca: "droneMallorca",
};

export async function generateStaticParams() {
  return CIUDADES_DRONE.map((ciudad) => ({ ciudad }));
}

function esCiudad(valor: string): valor is SlugCiudad {
  return (CIUDADES_DRONE as string[]).includes(valor);
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/ciudad-drone/[ciudad]">): Promise<Metadata> {
  const { locale, ciudad } = await params;
  if (!isLocale(locale) || !esCiudad(ciudad)) return {};
  const copy = await traeCiudad(ciudad);
  if (!copy) return {};

  return buildMetadata({
    locale,
    route: CLAVE_RUTA[ciudad],
    copy: {
      title:
        locale === "es"
          ? `Grabación con drone en ${copy.nombre} — SIDEBFLMS`
          : `Drone filming in ${copy.nombre} — SIDEBFLMS`,
      description: copy.intro[locale],
    },
  });
}

export default async function CiudadDronePage({
  params,
}: PageProps<"/[locale]/ciudad-drone/[ciudad]">) {
  const { locale: rawLocale, ciudad } = await params;
  if (!isLocale(rawLocale) || !esCiudad(ciudad)) notFound();
  const locale = rawLocale;

  const dict = await getDictionary(locale);
  const copy = await traeCiudad(ciudad);
  if (!copy) notFound();
  const proyectos = await traeProyectos();
  const piezas = copy.proyectos
    .map((slug) => proyectos.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p && !p.placeholder);

  // Las «otras ciudades» del enlace cruzado de más abajo también salen del
  // panel, no de la lista fija: si un día hay cuatro en Payload —aunque
  // sólo tres tengan URL propia todavía— este enlace lo refleja sin tocar
  // código. Se filtra a las que SÍ tienen ruta (`CLAVE_RUTA`), para no
  // enlazar a una ciudad sin dirección.
  const todasLasCiudades = await traeCiudades();
  const otrasCiudades = todasLasCiudades
    .map((c) => c.slug)
    .filter((s): s is SlugCiudad => s !== ciudad && esCiudad(s));
  const nombrePorSlug = new Map(todasLasCiudades.map((c) => [c.slug, c.nombre]));

  return (
    <main id="main" className="pagina">
      <header data-reglet={copy.nombre} className="shell">
        <Reveal>
          <p className="label">{dict.drone.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {copy.headline[locale].map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{copy.intro[locale]}</p>
        </Reveal>
      </header>

      <section className="shell seccion border-t border-ink-600 pt-14">
        <Reveal>
          <p className="measure text-lead whitespace-pre-line text-bone">{copy.cuerpo[locale]}</p>
        </Reveal>
      </section>

      {piezas.length > 0 && (
        <section className="shell seccion border-t border-ink-600 pt-14">
          <Reveal>
            <h2 className="font-display subtitulo">{dict.drone.portfolioLabel}</h2>
          </Reveal>
          <Reveal stagger>
            <ul className="mt-8 grid gap-px bg-ink-600 sm:grid-cols-2 lg:grid-cols-3">
              {piezas.map((p) => (
                <li key={p.slug} className="bg-ink-800">
                  <Link
                    href={path(locale, "portfolio", p.slug)}
                    className="block p-7 text-bone transition-colors hover:text-rust-300"
                  >
                    {p.title[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* Enlace cruzado entre las páginas de ciudad, no al resto del sitio:
          la lista de ciudades no se reparte por el sitio a propósito, ver la
          decisión de 2026-09-10 en content/dictionaries/es.ts (footer). */}
      {otrasCiudades.length > 0 && (
        <section className="shell seccion border-t border-ink-600 pt-14">
          <Reveal>
            <p className="text-smoke">
              {locale === "es" ? "También volamos en " : "We also fly in "}
              {otrasCiudades.map((c, i) => (
                <span key={c}>
                  {i > 0 && ", "}
                  <Link
                    href={path(locale, CLAVE_RUTA[c])}
                    className="text-bone underline decoration-ink-600 underline-offset-4 transition-colors hover:text-rust-300"
                  >
                    {nombrePorSlug.get(c) ?? c}
                  </Link>
                </span>
              ))}
              .
            </p>
          </Reveal>
        </section>
      )}

      <ContactCta locale={locale} dict={dict} headline={dict.drone.ctaTitle} intro={dict.contact.intro} />
    </main>
  );
}
