import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCta } from "@/components/sections/contact-cta";
import { Reveal } from "@/components/motion/reveal";
import { pad } from "@/lib/utils";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale } from "@/lib/routes";

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

  return (
    <main id="main" className="pt-40 pb-28">
      <header data-reglet={dict.services.label} className="shell">
        <Reveal>
          <p className="label">{dict.services.label}</p>
          <h1 className="font-display text-display-l mt-4 text-bone">
            {dict.services.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="text-lead measure mt-6 text-smoke">{dict.services.intro}</p>
        </Reveal>
      </header>

      <div className="mt-20">
        {dict.services.stages.map((stage, index) => (
          <Reveal
            key={stage.number}
            as="article"
            className="shell grid gap-8 border-t border-ink-600 py-14 lg:grid-cols-12 lg:items-start lg:gap-6"
            /* Alterna el fondo para que las 4 etapas del pipeline se lean
               como pasos distintos, no como una lista continua. */
          >
            <p
              aria-hidden="true"
              className="font-mono text-4xl font-medium text-ink-600 tabular-nums lg:col-span-2"
            >
              {pad(index + 1)}
            </p>

            <div className="lg:col-span-6">
              <h2 className="font-display text-display-m text-bone">{stage.title}</h2>
              {stage.pending && (
                <span className="label mt-3 inline-block border border-rust-500 px-2 py-1 text-rust-300">
                  {dict.services.pendingNote}
                </span>
              )}
              <p className="measure mt-4 text-smoke">{stage.body}</p>
            </div>

            <ul className="mt-2 space-y-2 lg:col-span-4 lg:mt-0">
              {stage.items.map((item) => (
                <li key={item} className="label flex gap-3 text-bone">
                  <span aria-hidden="true" className="text-rust-500">
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <ContactCta
        locale={locale}
        dict={dict}
        headline={dict.services.ctaTitle}
        intro={dict.contact.intro}
      />
    </main>
  );
}
