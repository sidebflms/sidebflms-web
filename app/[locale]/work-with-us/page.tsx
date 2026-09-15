import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/motion/reveal";
import { JobsForm } from "@/components/ui/jobs-form";
import { FOTOS_EDITORIAL } from "@/content/team";
import { getDictionary } from "@/lib/dictionaries";
import { buildMetadata } from "@/lib/metadata";
import { isLocale, path } from "@/lib/routes";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/work-with-us">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({ locale, route: "jobs", copy: dict.meta.jobs });
}

/**
 * TRABAJA CON NOSOTROS.
 *
 * ── NO ES EL FORMULARIO COMERCIAL, Y HAY QUE NOTARLO ─────────────────────
 * Las dos páginas son un titular a la izquierda y un formulario oscuro a la
 * derecha. Quien llega de un enlace puede tardar en darse cuenta de en cuál
 * está, así que arriba del todo hay una línea que lo dice y lleva a la otra.
 *
 * ── NO SE ANUNCIAN PUESTOS QUE NO EXISTEN ────────────────────────────────
 * No hay convocatorias abiertas y la página lo dice: esto es una candidatura
 * espontánea. No se promete contratación, ni plazo de respuesta, ni
 * condiciones, porque nada de eso está decidido. Lo único que se explica es
 * qué ayuda a leer una candidatura, que sí se puede afirmar.
 *
 * ── LAS FOTOS SON LAS MISMAS QUE EN NOSOTROS ─────────────────────────────
 * `FOTOS_EDITORIAL`, la misma selección y el mismo recorte 4:5. Quien mira
 * esta página viene casi siempre de allí, y repetir el tratamiento hace que se
 * lean como la misma casa. Fotos de rodaje de verdad, no de archivo.
 */
export default async function WorkWithUsPage({ params }: PageProps<"/[locale]/work-with-us">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const j = dict.jobs;

  return (
    <main id="main" className="pt-40 pb-28">
      <div data-reglet={j.label} className="shell grid gap-x-16 gap-y-12 lg:grid-cols-12">
        {/* Cinco columnas y no cuatro: Akira Expanded es muy ancha y con cuatro
            el titular se partía a media palabra. */}
        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
          <Reveal>
            <p className="label">{j.label}</p>
            <h1 className="font-display text-page-title en-columna mt-4 text-bone">
              {j.headline.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h1>
            <p className="text-lead measure mt-6 text-bone">{j.intro}</p>

            {/* El desvío al formulario comercial. Va aquí arriba y no en el
                pie: si alguien se ha equivocado de página, cuanto antes lo
                sepa, mejor. */}
            <p className="mt-8 border-l-2 border-ink-500 pl-4 text-sm text-bone/90">
              {j.notClientLabel}{" "}
              <Link
                href={path(locale, "contact")}
                className="text-rust-300 underline underline-offset-4 transition-colors hover:text-bone"
              >
                {j.notClientLink}
              </Link>
            </p>
          </Reveal>
        </div>

        {/* El formulario, primero en el DOM después del titular: en móvil, lo
            que hay que poder alcanzar pronto es el primer campo. */}
        <div className="lg:col-span-7 lg:col-start-6 lg:row-span-2 lg:row-start-1">
          <Reveal>
            <h2 className="label mb-6">{j.formLabel}</h2>
            <JobsForm locale={locale} dict={dict} />
          </Reveal>
        </div>

        <div className="lg:col-span-5 lg:col-start-1 lg:row-start-2">
          <Reveal className="border-t border-ink-600 pt-8">
            <h2 className="label">{j.helpsLabel}</h2>
            <ul className="mt-4 space-y-3">
              {j.helps.map((linea) => (
                <li key={linea} className="flex gap-3 text-sm text-bone/90">
                  <span aria-hidden="true" className="text-rust-300">
                    —
                  </span>
                  {linea}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      {FOTOS_EDITORIAL.length > 0 && (
        <section className="shell mt-24">
          <Reveal stagger>
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {FOTOS_EDITORIAL.map((foto) => (
                <li
                  key={foto.src}
                  className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink-900"
                >
                  <Image
                    src={foto.src}
                    alt={foto.alt[locale]}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}
    </main>
  );
}
