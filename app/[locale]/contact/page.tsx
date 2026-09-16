import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactoTarjetas } from "@/components/sections/contacto/contacto-tarjetas";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/contact">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "contact", copy: dict.meta.contact });
}

/**
 * «CONTACTO» — versión glass: tarjetas de contacto directo, formulario por
 * pasos y preguntas en mosaico. Ver
 * components/sections/contacto/contacto-tarjetas.tsx.
 */
export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return <ContactoTarjetas locale={locale} dict={dict} />;
}
