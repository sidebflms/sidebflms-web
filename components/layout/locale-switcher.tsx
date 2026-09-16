"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALES, translatePath, type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * EL IDIOMA: UN SOLO BOTÓN QUE LLEVA AL OTRO.
 *
 * Eran dos enlaces, «ES · EN», con el actual resaltado. Mario, 2026-09-16:
 * «¿puede ser el mismo botón y que al darle una vez cambie al otro idioma?».
 *
 * ── ENSEÑA EL IDIOMA AL QUE VAS, NO EN EL QUE ESTÁS ─────────────────────
 * En la web en castellano pone «EN»; en la inglesa, «ES». Un botón tiene que
 * decir lo que hace al pulsarlo. Si pusiera el idioma actual, quien no lee
 * español vería «ES» y no sabría que ahí está su versión.
 *
 * ── PARA UN LECTOR DE PANTALLA ──────────────────────────────────────────
 * «EN» a secas se lee como la preposición. El nombre accesible es el del
 * idioma escrito EN ese idioma —«English», «Español»— y lleva su `lang`, para
 * que se pronuncie bien: es lo que busca quien no entiende la página actual.
 *
 * Etiquetas de texto, NUNCA banderas: una bandera es un país, no un idioma.
 *
 * Conserva la ruta al cambiar: desde `/es/trabajo` va a `/en/work`, no a la
 * portada. El mapa de traducción es el mismo que usan los `hreflang`.
 *
 * SI ALGÚN DÍA HAY UN TERCER IDIOMA, esto deja de valer: un conmutador tiene
 * sentido con dos opciones, no con tres. Habría que volver a una lista.
 */
const NOMBRE: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

export function LocaleSwitcher({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const otro = LOCALES.find((l) => l !== locale) ?? locale;

  return (
    <Link
      href={translatePath(pathname, otro)}
      hrefLang={otro}
      lang={otro}
      aria-label={NOMBRE[otro]}
      // El `title` en el idioma de la página: es la pista que ve quien pasa el
      // ratón y sí lee el idioma en el que está.
      title={`${label}: ${NOMBRE[otro]}`}
      className={cn(
        "inline-flex h-8 min-w-10 items-center justify-center rounded-full border border-ink-500 px-3",
        "text-xs font-medium tracking-[0.08em] text-bone uppercase",
        "transition-colors duration-200 hover:border-rust-300 hover:text-rust-300",
        className
      )}
    >
      {otro}
    </Link>
  );
}
