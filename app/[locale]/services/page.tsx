import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";

import { ProcesoTimeline } from "@/components/sections/proceso-timeline";
import { ServiciosVisor, type VideoDrone } from "@/components/sections/servicios-visor";
import { Reveal } from "@/components/motion/reveal";
import { traeEtapasFotos, traeProyectos } from "@/lib/contenido";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata, datosMigas } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "services", copy: dict.meta.services });
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const proyectos = await traeProyectos();
  const fotoEtapa = await traeEtapasFotos();

  // El bloque de Drone lleva de fondo la cinta de la pieza de drone destacada
  // (la del showpiece), o la primera pieza de drone con vídeo.
  const pieza =
    proyectos.find((p) => p.showpiece && p.media.video) ??
    proyectos.find((p) => p.categories.includes("drone") && p.media.video);
  const videoDrone: VideoDrone = pieza?.media.video
    ? { video: pieza.media.video.replace(/\.mp4$/, "-cinta.mp4"), poster: pieza.media.poster }
    : null;

  return (
    <main id="main" className="pagina">
      <header data-reglet={dict.services.label} className="shell">
        <Reveal>
          <p className="label">{dict.services.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {dict.services.headline.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{dict.services.intro}</p>

          {/* LA LÍNEA DE DISCIPLINAS: resume de un vistazo lo que desarrollan
              las tarjetas de más abajo. */}
          {/* Las disciplinas, en pastillas de cristal (versión glass). */}
          <ul className="mt-8 flex flex-wrap items-center gap-2">
            {dict.services.disciplinas.map((disciplina) => (
              <li
                key={disciplina}
                className="glass rounded-full px-4 py-2 text-xs font-medium tracking-[0.14em] text-bone uppercase"
              >
                {disciplina}
              </li>
            ))}
          </ul>
        </Reveal>
      </header>

      {/* QUÉ HACEMOS — los servicios, ANTES de las etapas. Quien llega aquí
          quiere saber primero qué se puede encargar; cómo se hace, después.
          Versión glass: rejilla «Visor», ver el componente. */}
      <ServiciosVisor dict={dict} locale={locale} videoDrone={videoDrone} />

      {/* CÓMO LO HACEMOS — la línea de tiempo de montaje, ver el componente. */}
      <ProcesoTimeline dict={dict} fotoEtapa={fotoEtapa} />

      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.services.ctaTitle}
        intro={dict.contact.intro}
      />

      {/* Migas de pan (SEO Fase 8): sólo el schema, sin rastro visible —ver
          la nota de `datosMigas` en lib/metadata.ts—. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            datosMigas(locale, dict.nav.home, [{ nombre: dict.nav.services, ruta: path(locale, "services") }])
          ),
        }}
      />
    </main>
  );
}
