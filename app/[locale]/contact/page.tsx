import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { Faq } from "@/components/sections/faq";
import { ContactForm } from "@/components/ui/contact-form";
import { REDES } from "@/components/layout/social-icons";
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
  const c = dict.contact;

  /** Los mismos tres enlaces que la cabecera y el pie: una sola lista. */
  const etiquetas: Record<string, string> = {
    instagram: c.instagram,
    linkedin: c.linkedin,
    youtube: c.youtube,
  };

  return (
    <main id="main" className="pt-40 pb-28">
      {/* EL ORDEN DEL DOM ES EL ORDEN DE MÓVIL: titular, formulario y después
          las vías directas. Antes, el bloque de la izquierda entero —titular,
          entradilla y los cuatro enlaces— iba delante, así que en un móvil
          había que pasar toda esa columna antes de ver el primer campo.

          A partir de `lg` la rejilla los recoloca: el formulario ocupa la
          derecha entera y los enlaces vuelven debajo del titular. */}
      <div data-reglet={c.label} className="shell grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <Reveal>
            <p className="label">{c.label}</p>
            {/* `en-columna`: este titular vive en `lg:col-span-5`, no en el
                ancho de la página. Sin eso, a partir de `lg` pedía un cuerpo
                que no cabe y «CUÉNTANOS» se partía. Ver app/globals.css. */}
            <h1 className="font-display text-page-title en-columna mt-4 text-bone">
              {c.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="text-lead measure mt-6 text-bone">{c.intro}</p>
          </Reveal>
        </div>

        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <Reveal>
            <h2 className="label mb-6">{c.form.formLabel}</h2>
            <ContactForm locale={locale} dict={dict} />
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
          <Reveal className="border-t border-ink-600 pt-8">
            <h2 className="label">{c.directLabel}</h2>
            <a
              href={`mailto:${c.email}`}
              className="text-lead mt-4 inline-block text-bone underline underline-offset-4 transition-colors hover:text-rust-300"
            >
              {c.email}
            </a>

            {/* UN ELEMENTO POR RED.
                LinkedIn y YouTube estaban dentro del MISMO `<li>`, sin nada
                entre ellos: en pantalla se leían pegados («LinkedInYouTube») y
                un lector de pantalla los anunciaba como un solo ítem. */}
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {REDES.map((red) => (
                <li key={red.key}>
                  <a
                    href={red.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="label text-bone transition-colors hover:text-rust-300"
                  >
                    {etiquetas[red.key] ?? red.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {/* Las preguntas, debajo del formulario. Ver components/sections/faq.tsx. */}
      <Faq locale={locale} dict={dict} />
    </main>
  );
}
