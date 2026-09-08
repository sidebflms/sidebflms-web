import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BrandStrip } from "@/components/sections/brand-strip";
import { ContactCta } from "@/components/sections/contact-cta";
import { EditorialBlock } from "@/components/sections/editorial-block";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Showpiece } from "@/components/sections/showpiece";
import { ButtonLink, Arrow } from "@/components/ui/button";
import { featuredProjects } from "@/content/projects";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "home", copy: dict.meta.home });
}

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  // El showpiece va primero en la lista de destacados; el resto se reparte en
  // bloques editoriales alternados debajo.
  const [, ...rest] = featuredProjects();

  return (
    <main id="main">
      <Hero locale={locale} dict={dict} />
      <BrandStrip dict={dict} />
      <Showpiece dict={dict} />

      {rest.map((project, index) => (
        <EditorialBlock
          key={project.slug}
          project={project}
          locale={locale}
          dict={dict}
          reverse={index % 2 === 1}
        />
      ))}

      <div className="shell -mt-6 pb-16">
        <ButtonLink href={path(locale, "portfolio")} variant="outline">
          {dict.featured.viewAll}
          <Arrow />
        </ButtonLink>
      </div>

      <Manifesto dict={dict} />
      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.contact.headline}
        intro={dict.contact.intro}
      />
    </main>
  );
}
