import Link from "next/link";

import { IconoServicio } from "@/components/glass/iconos-servicio";
import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { PlaceholderMedia } from "@/components/ui/placeholder-media";
import { mediosLigeros } from "@/components/sections/trabajo/medios";
import { PROJECTS, type Project } from "@/content/projects";
import type { Dictionary } from "@/lib/dictionaries";
import { path, type Locale } from "@/lib/routes";
import { pad } from "@/lib/utils";

import { FichaVecinos, type LadoVecino } from "./ficha-vecinos";
import { FichaVisor } from "./ficha-visor";
import { tallaAkira } from "./talla-akira";

export type PropsProyecto = {
  project: Project;
  anterior: Project;
  siguiente: Project;
  dict: Dictionary;
  locale: Locale;
};

/**
 * FICHA DE PROYECTO — «MARCO CON MUESCAS». Elegida entre tres el 2026-09-17.
 *
 *   1. La pieza abre la página a todo el ancho del contenedor, en el marco
 *      mordido del hero: el nombre en la muesca de abajo a la izquierda y la
 *      vuelta al trabajo con el número en la de arriba a la derecha.
 *   2. Debajo, la categoría a la izquierda y venue y fecha a la derecha (sólo
 *      lo que se sabe).
 *   3. La descripción en una tarjeta: el rótulo arriba y el texto a dos
 *      columnas, no más (cliente: con el rótulo en su propia columna quedaban
 *      tres).
 *   4. Anterior y siguiente, uno al lado del otro.
 *
 * En móvil no hay muescas: la vuelta y el número van encima de la pieza y el
 * nombre debajo.
 */

export function FichaProyecto({ project, anterior, siguiente, dict, locale }: PropsProyecto) {
  const copy = dict.portfolio.detail;
  const { media } = project;
  const titulo = project.title[locale];
  const esFoto = !media.video && Boolean(media.poster);
  const numero = PROJECTS.findIndex((p) => p.slug === project.slug) + 1;
  const parrafos = project.brief[locale].split("\n\n");
  const lugarYFecha = [project.venue, project.date?.[locale]].filter(Boolean).join(" · ");

  return (
    // `shell` baja a un contenedor propio (2026-10-01) para que la tarjeta de
    // contacto del final, que lleva su propio `shell`, no sume dos márgenes.
    <main id="main" className="pagina">
      <div className="shell">
      <div className="mb-4 flex items-center justify-between gap-4 sm:hidden">
        <Link
          href={path(locale, "portfolio")}
          className="label group relative inline-flex items-center gap-2 transition-colors after:absolute after:inset-x-0 after:-inset-y-[15px] after:content-[''] hover:text-rust-300"
        >
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          {copy.backToAll}
        </Link>
        <span aria-hidden="true" className="label shrink-0 tabular-nums">
          {pad(numero)} / {pad(PROJECTS.length)}
        </span>
      </div>

      <FichaVisor
        video={media.video}
        poster={media.poster}
        imagen={esFoto ? media.poster : null}
        titulo={titulo}
        textoVer={copy.watch}
        textoSonido={copy.sound}
        textoAmpliar={dict.portfolio.player.fullscreen}
        textoReducir={dict.portfolio.player.exitFullscreen}
        muesca={
          // Aire arriba en la línea: Akira recortaría las tildes.
          <h1 className="font-display pt-[0.15em] text-[clamp(1rem,0.4rem+1.5vw,2.5rem)] leading-[1.02] text-balance text-bone">
            {titulo}
          </h1>
        }
        muescaArriba={
          <div className="flex items-center gap-2">
            <Link
              href={path(locale, "portfolio")}
              className="glass inline-flex h-11 items-center gap-2 rounded-full px-5 text-xs font-medium tracking-[0.08em] text-bone uppercase transition-colors hover:text-rust-300"
            >
              <span aria-hidden="true">←</span>
              {copy.backToAll}
            </Link>
            <span aria-hidden="true" className="glass inline-flex h-11 items-center rounded-full px-4 text-xs text-bone tabular-nums">
              {pad(numero)} / {pad(PROJECTS.length)}
            </span>
          </div>
        }
      >
        <PlaceholderMedia project={project} label={titulo} badge={dict.placeholder.videoBadge} className="h-full" />
      </FichaVisor>

      {/* El nombre en móvil, donde no hay muesca. Por encima de `sm` está
          oculto y manda el de la muesca.

          `<p>` Y NO `<h1>`: el de la muesca está en el HTML siempre, también
          en móvil —sólo se esconde con CSS—, así que los dos juntos dejaban
          DOS encabezados de primer nivel en cada ficha. Se ve igual. */}
      <p
        aria-hidden="true"
        className="font-display mt-4 px-1 pt-[0.15em] text-[clamp(1.125rem,5.5vw,1.5rem)] leading-[1.05] text-bone sm:hidden"
      >
        {titulo}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-1">
        <ul className="flex flex-wrap gap-2">
          {project.categories.map((c) => (
            <li
              key={c}
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.03] py-1.5 pr-3.5 pl-2 text-xs font-medium tracking-[0.06em] text-bone uppercase"
            >
              <IconoServicio clave={c} className="h-5 w-5 text-rust-500" />
              {dict.portfolio.categories[c]}
            </li>
          ))}
        </ul>
        {lugarYFecha && <p className="label">{lugarYFecha}</p>}
      </div>

      <Reveal bidirectional className="glass glass-strong mt-6 rounded-[1.75rem] p-5 sm:p-7 lg:p-10">
        <h2 className="label text-bone">{copy.about}</h2>
        {/* Dos columnas como mucho. Cada párrafo entero en su columna. */}
        <div className="mt-5 text-bone/90 md:columns-2 md:gap-10">
          {parrafos.map((p) => (
            <p key={p} className="mb-4 break-inside-avoid last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </Reveal>

      <Reveal bidirectional className="glass mt-6 rounded-[1.75rem] p-2 sm:p-2.5">
        <FichaVecinos
          etiqueta={`${copy.prev} · ${copy.next}`}
          lados={[lado(anterior, copy.prev, "anterior", dict, locale), lado(siguiente, copy.next, "siguiente", dict, locale)]}
        />
      </Reveal>
      </div>

      {/* Lo último que se ve tras el trabajo es la invitación a contarnos el
          suyo (auditoría 2026-10-01): las demás páginas ya la llevan y la ficha
          era justo donde más convence. Mismos textos que la página de drone. */}
      <ContactCta locale={locale} dict={dict} headline={dict.drone.ctaTitle} intro={dict.contact.intro} />
    </main>
  );
}

/**
 * Los datos de una pieza de anterior/siguiente: versión ligera (cinta y póster
 * WebP) y, por si faltara, la ruta del fichero grande para caer a ella. El
 * cuerpo del título se calcula para Akira contra el ancho de la pieza (ver
 * talla-akira.ts): dos líneas como mucho y techo de 2,5 rem.
 */
function lado(
  p: Project,
  etiqueta: string,
  sentido: LadoVecino["sentido"],
  dict: Dictionary,
  locale: Locale
): LadoVecino {
  const ligeros = p.placeholder ? { video: null, poster: null } : mediosLigeros(p);
  return {
    href: path(locale, "portfolio", p.slug),
    etiqueta,
    titulo: p.title[locale],
    meta: [...p.categories.map((c) => dict.portfolio.categories[c]), p.venue].filter(Boolean).join(" · "),
    talla: tallaAkira(p.title[locale], { lineas: 2, techo: 2.5 }),
    video: ligeros.video,
    poster: ligeros.poster,
    videoCompleto: p.placeholder ? null : p.media.video,
    posterCompleto: p.placeholder ? null : p.media.poster,
    sentido,
  };
}
