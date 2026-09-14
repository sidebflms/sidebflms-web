import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { JobsForm } from "@/components/ui/jobs-form";
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

export default async function WorkWithUsPage({ params }: PageProps<"/[locale]/work-with-us">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main id="main" className="pt-40 pb-28">
      <div data-reglet={dict.jobs.label} className="shell grid gap-16 lg:grid-cols-12">
        {/* Cinco columnas, no cuatro.
            Akira Expanded es muy ancha y con cuatro el titular se partía a
            media palabra: «BUSCAM / OS». `.font-display` lleva
            `overflow-wrap: anywhere` como red de seguridad —está explicado en
            globals.css— y eso hace que, en vez de desbordar, corte donde sea.
            Cinco columnas es lo que usa la página de contacto, donde
            «Cuéntanos» (nueve letras) entra bien. */}
        <div className="lg:col-span-5">
          <Reveal>
            <p className="label">{dict.jobs.label}</p>
            <h1 className="font-display text-display-l mt-4 text-bone">
              {dict.jobs.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="text-lead measure mt-6 text-smoke">{dict.jobs.intro}</p>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="label mb-8">{dict.jobs.formLabel}</p>
            <JobsForm locale={locale} dict={dict} />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
