"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/**
 * EL MENÚ, ABAJO Y A LA DERECHA.
 *
 * Estaba arriba a la derecha. Mario lo bajó el 2026-09-15 —«las pestañas de
 * work contact y demás las ponemos en la parte de abajo»— y ese mismo día lo
 * mandó al lado derecho: «lo de work services about lo ponemos a la derecha».
 *
 * A la derecha vuelve a alinearse con la columna de la cabecera (los iconos de
 * redes) y, sobre todo, deja libre el centro de la pantalla, que es por donde
 * cae el titular del hero.
 *
 * ── LO QUE ESO DESBLOQUEÓ ────────────────────────────────────────────────
 * Al vaciarse la derecha de la cabecera, el logotipo cabe centrado en
 * cualquier ancho. Hasta ahora sólo se centraba a partir de 1536 px porque el
 * menú se le montaba encima. O sea que el cambio arregla de paso algo que
 * estaba a medias.
 *
 * ── POR QUÉ FIJO Y NO AL FINAL DE LA PÁGINA ──────────────────────────────
 * Porque es el menú: tiene que estar siempre a mano. Si viviera al final del
 * documento, para cambiar de página habría que recorrerse la página entera
 * primero.
 *
 * ── POR QUÉ NO SE VE EN MÓVIL ────────────────────────────────────────────
 * Ahí ya está el botón de menú de la cabecera, que abre la lista a pantalla
 * completa. Dos menús para lo mismo, y uno de ellos tapando el contenido en
 * una pantalla pequeña, es peor que uno.
 *
 * La cápsula lleva fondo y desenfoque porque flota sobre vídeo: sin eso, los
 * rótulos desaparecen cada vez que pasa por debajo un plano claro.
 */
export function BottomNav({
  links,
}: {
  links: { href: string; label: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Principal"
      // `pr-[var(--edge)]`: el mismo margen derecho que usa `.shell`, para que
      // la cápsula caiga a plomo con el resto de la columna derecha en vez de
      // pegarse al borde del navegador.
      className="pointer-events-none fixed inset-x-0 bottom-6 z-50 hidden justify-end pr-[var(--edge)] md:flex"
    >
      <div className="pointer-events-auto flex items-center gap-8 rounded-full border border-ink-600 bg-ink-900/80 px-8 py-3 backdrop-blur-md">
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
