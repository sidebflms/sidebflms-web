"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALES, translatePath, type Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * Selector de idioma. Etiquetas de texto `ES / EN`, NUNCA banderas: una bandera
 * es un país, no un idioma — un booker suizo que lee en inglés no se identifica
 * con la Union Jack.
 *
 * Conserva la ruta al cambiar: desde `/es/trabajo` va a `/en/work`, no a la
 * home. El mapa de traducción es el mismo que usan los `hreflang`.
 */
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

  return (
    <nav aria-label={label} className={cn("flex items-center gap-2", className)}>
      {LOCALES.map((target, index) => {
        const isCurrent = target === locale;
        return (
          <span key={target} className="flex items-center gap-2">
            {index > 0 && (
              <span aria-hidden="true" className="text-ink-600">
                ·
              </span>
            )}
            <Link
              href={translatePath(pathname, target)}
              hrefLang={target}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200",
                isCurrent ? "text-bone" : "text-smoke hover:text-rust-300"
              )}
            >
              {target}
            </Link>
          </span>
        );
      })}
    </nav>
  );
}
