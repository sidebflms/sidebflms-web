import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/ui/contact-form";
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

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <main id="main" className="pt-40 pb-28">
      <div data-reglet={dict.contact.label} className="shell grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="label">{dict.contact.label}</p>
            <h1 className="font-display text-display-l mt-4 text-bone">
              {dict.contact.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="text-lead measure mt-6 text-smoke">{dict.contact.intro}</p>
          </Reveal>

          <Reveal className="mt-12 border-t border-ink-600 pt-8">
            <p className="label">{dict.contact.directLabel}</p>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href={`mailto:${dict.contact.email}`}
                  className="text-lead text-bone transition-colors hover:text-rust-300"
                >
                  {dict.contact.email}
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/sidebflms"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-bone transition-colors hover:text-rust-300"
                >
                  {dict.contact.instagram}
                </a>
              </li>
              <li>
                <a
                  href="https://vimeo.com/sidebflms"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-bone transition-colors hover:text-rust-300"
                >
                  {dict.contact.vimeo}
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        <Reveal className="lg:col-span-7">
          <ContactForm locale={locale} dict={dict} />
        </Reveal>
      </div>
    </main>
  );
}
