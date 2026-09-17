import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TrabajaTarjetas } from "@/components/sections/trabaja/trabaja-tarjetas";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work-with-us">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "jobs", copy: dict.meta.jobs });
}

/**
 * «TRABAJA CON NOSOTROS» — versión glass, con el mismo diseño que
 * «Contacto»: cabecera con botones y formulario por pasos. Ver
 * components/sections/trabaja/trabaja-tarjetas.tsx.
 */
export default async function WorkWithUsPage({ params }: PageProps<"/[locale]/work-with-us">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return <TrabajaTarjetas locale={locale} dict={dict} />;
}
