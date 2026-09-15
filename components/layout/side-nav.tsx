"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * EL MENÚ, EN COLUMNA A LA DERECHA.
 *
 * Tres sitios en un día. Estaba arriba a la derecha; Mario lo bajó al borde
 * inferior —«las pestañas de work contact y demás las ponemos en la parte de
 * abajo»—, luego lo mandó a la derecha, y al verlo aclaró lo que quería:
 * «me refería en vertical, a la derecha de capture the energy». O sea, una
 * columna pegada al lado derecho y a la altura del titular, no una cápsula
 * horizontal en una esquina.
 *
 * ── POR QUÉ CENTRADO EN VERTICAL ─────────────────────────────────────────
 * «A la altura de capture the energy» es, literalmente, el centro vertical de
 * la ventana: ahí es donde el hero centra su titular. Con `top-1/2` y
 * `-translate-y-1/2` el menú queda a esa altura sea cual sea la pantalla, y
 * sin depender del alto del propio menú.
 *
 * ── LOS RÓTULOS NO VAN GIRADOS ───────────────────────────────────────────
 * «En vertical» es la disposición, uno debajo de otro; no el texto tumbado.
 * Texto girado 90° ya hay en esta página —la regleta del lado izquierdo— y es
 * deliberadamente decorativo. Un menú hay que poder leerlo de un vistazo.
 *
 * ── POR QUÉ FIJO Y NO AL FINAL DE LA PÁGINA ──────────────────────────────
 * Porque es el menú: tiene que estar siempre a mano. Si viviera al final del
 * documento, para cambiar de página habría que recorrerse la página entera.
 *
 * ── POR QUÉ NO SE VE HASTA 1024 px ───────────────────────────────────────
 * Por debajo manda el botón de menú de la cabecera, que abre la lista a
 * pantalla completa. Dos menús para lo mismo es peor que uno.
 *
 * El corte está en `lg` y no en `md` por una medición concreta: a 768 px la
 * columna se metía por encima de la frase de apoyo del hero (acababa en 633,
 * la columna empezaba en 605) y del titular de la página de Trabajo. A 1024
 * sobran 53 px. Al subir el corte hay que subir también el del botón de menú
 * de la cabecera, o entre 768 y 1023 no habría menú ninguno.
 *
 * La cápsula lleva fondo y desenfoque porque flota sobre vídeo: sin eso, los
 * rótulos desaparecen cada vez que pasa por debajo un plano claro.
 */
export function SideNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      // `pr-[var(--edge)]`: el mismo margen derecho que usa `.shell`, para que
      // la columna caiga a plomo con los iconos de redes de la cabecera.
      className="pointer-events-none fixed inset-y-0 right-0 z-50 hidden items-center pr-[var(--edge)] lg:flex"
    >
      <div className="pointer-events-auto flex flex-col items-end gap-4 rounded-3xl border border-ink-600 bg-ink-900/80 px-6 py-6 backdrop-blur-md">
        {links.map((link) => {
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-200",
                active ? "text-rust-300" : "text-bone hover:text-rust-300"
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
