import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NosotrosBento } from "@/components/sections/nosotros/nosotros-bento";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "about", copy: dict.meta.about });
}

/**
 * «NOSOTROS» — versión glass: bento de cristal, ver
 * components/sections/nosotros/nosotros-bento.tsx.
 */
export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return <NosotrosBento dict={dict} locale={locale} />;
}
