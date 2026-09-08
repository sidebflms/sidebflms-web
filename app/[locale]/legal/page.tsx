import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalPage } from "@/components/sections/legal-page";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/legal">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "legal", copy: dict.meta.legal });
}

export default async function LegalNoticePage({ params }: PageProps<"/[locale]/legal">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  return <LegalPage title={dict.legal.title} entries={dict.legal.body} />;
}
