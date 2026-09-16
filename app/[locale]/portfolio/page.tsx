import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandStrip } from "@/components/sections/brand-strip";
import { TrabajoYoutube } from "@/components/sections/trabajo/trabajo-youtube";
import { PROJECTS } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/portfolio">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "portfolio", copy: dict.meta.portfolio });
}

/**
 * «TRABAJO» — versión glass: la página de un vídeo de YouTube (reproductor
 * grande, lista de proyectos a la derecha y caja de descripción) en escritorio,
 * y tarjetas individuales en móvil y tableta. Ver
 * components/sections/trabajo/trabajo-youtube.tsx y trabajo-feed.tsx.
 *
 * Sustituye a la «Sala» desde el 2026-09-16 (cliente: «lo de YouTube,
 * aplícalo directamente a la página de trabajo»).
 *
 * El filtro vive en el propio componente, no en la URL: la página es estática.
 */
export default async function PortfolioPage({ params }: PageProps<"/[locale]/portfolio">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main id="main" className="pt-40 pb-28">
      {/* Sólo la parte del diccionario que usa: es componente de cliente y el
          diccionario entero viajaría como prop. */}
      <TrabajoYoutube projects={PROJECTS} locale={locale} copy={dict.portfolio} />

      {/* La credencial, justo después del trabajo que la respalda. */}
      <div className="mt-24">
        <BrandStrip dict={dict} />
      </div>
    </main>
  );
}
