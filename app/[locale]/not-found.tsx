import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, path } from "@/lib/routes";

/**
 * 404 localizado. `notFound()` no tiene acceso a `params`, así que no hay
 * forma fiable de saber el idioma en curso aquí — se usa el diccionario por
 * defecto. Es una limitación conocida y aceptable: es una página de error,
 * no una de contenido indexable.
 */
export default async function NotFound() {
  const dict = await getDictionary(DEFAULT_LOCALE);

  return (
    <main id="main" className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="label">404</p>
      <h1 className="font-display text-display-l mt-4 text-bone">
        {dict.common.notFoundTitle.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-4 text-smoke">{dict.common.notFoundBody}</p>
      <ButtonLink href={path(DEFAULT_LOCALE, "home")} variant="outline" className="mt-10">
        {dict.common.backHome}
      </ButtonLink>
    </main>
  );
}
