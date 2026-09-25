import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { CIUDAD_DRONE, CIUDADES_DRONE, type SlugCiudad } from "@/content/ciudades-drone";
import { traeProyectos } from "@/lib/contenido";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path, type RouteKey } from "@/lib/routes";

/**
 * PÁGINAS DE CIUDAD (SEO Fase 6, 2026-09-24).
 *
 * Una única carpeta física para las tres ciudades —no una por ciudad—: el
 * contenido real vive en `content/ciudades-drone.ts`, esta página sólo lo
 * pinta. La URL bonita (`/es/grabacion-con-drone-madrid`) la sirve un
 * rewrite de `next.config.ts` sobre esta misma ruta interna
 * (`/es/ciudad-drone/madrid`); mismo mecanismo que ya usa `/grabacion-con-drone`
 * a secas para la página de drone. Ver la nota de `droneMadrid` en
 * `lib/routes.ts`.
 *
 * NADA DE PLANTILLA CON LA CIUDAD CAMBIADA: `generateStaticParams` sólo
 * genera las ciudades de `CIUDADES_DRONE`, que son las que de verdad tienen
 * trabajo real —Mario asignó cada proyecto de viva voz, ver la cabecera de
 * `content/ciudades-drone.ts`—. Cualquier otra ciudad da 404, no una página
 * de relleno.
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
  const copy = CIUDAD_DRONE[ciudad];

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
  const copy = CIUDAD_DRONE[ciudad];
  const proyectos = await traeProyectos();
  const piezas = copy.proyectos
    .map((slug) => proyectos.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p && !p.placeholder);

  const otrasCiudades = CIUDADES_DRONE.filter((c) => c !== ciudad);

  return (
    <main id="main" className="pagina">
      <header data-reglet={copy.nombre} className="shell">
        <Reveal>
          <p className="label">{dict.drone.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {copy.headline[locale].map((line) => (
              <span key={line} className="block">
                {line}
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
                    {CIUDAD_DRONE[c].nombre}
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
