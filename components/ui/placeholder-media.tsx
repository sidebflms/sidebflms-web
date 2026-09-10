import Image from "next/image";

import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";

/**
 * El medio de una ficha de portfolio: el material real si lo hay, y si no, un
 * bloque oscuro monocromo con la marca de «material pendiente».
 *
 * ── POR QUÉ LAS DOS COSAS VIVEN EN EL MISMO COMPONENTE ───────────────────
 * La versión original SÓLO pintaba el bloque de pendiente, y la marca estaba
 * dentro del componente a propósito, con este razonamiento escrito: el
 * portfolio es el argumento de venta ante un promotor, y una pieza que parezca
 * trabajo entregado sin serlo es el único error de este sitio que no tiene
 * arreglo después. Por eso la marca no podía ser un adorno quitable.
 *
 * Ese razonamiento sigue en pie y por eso el componente no se ha partido en
 * dos. Lo que decide qué se pinta NO es una prop que pueda poner cualquiera:
 * es `project.media.poster`. Si hay fichero, se enseña el trabajo; si no lo
 * hay, se enseña el bloque CON su marca. No hay forma de pedir «lo real» para
 * una pieza que no tiene material, ni de quitar la marca a una que sí lo
 * necesita, porque no existe el interruptor.
 *
 * (`project.placeholder` sigue existiendo en el tipo y NO se usa aquí a
 * propósito: sería justo ese interruptor.)
 */

const TONES = [
  "from-ink-700 to-ink-900",
  "from-ink-900 to-ink-700",
  "from-ink-800 via-ink-700 to-ink-900",
  "from-ink-900 via-rust-900/25 to-ink-800",
] as const;

export function PlaceholderMedia({
  project,
  label,
  badge,
  className,
}: {
  project: Project;
  /** Título superpuesto, en el idioma en curso. */
  label: string;
  badge: string;
  className?: string;
}) {
  // El material real manda. Se comprueba el fichero, no una bandera.
  if (project.media.poster) {
    return (
      <div className={cn("relative isolate h-full w-full overflow-hidden bg-ink-900", className)}>
        <Image
          src={project.media.poster}
          alt={label}
          fill
          // Las fichas ocupan una columna de tres en escritorio y el ancho
          // entero en móvil. Sin esto Next serviría la imagen a tamaño de
          // pantalla completa siempre, que en un grid de nueve es mucho.
          sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative isolate flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br",
        TONES[project.tone],
        className
      )}
    >
      {/* Rejilla de encuadre: lee como monitor de referencia, no como textura
          decorativa. Muy tenue a propósito. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-bone) 1px, transparent 1px), linear-gradient(90deg, var(--color-bone) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <p className="font-display text-display-m relative px-8 text-center text-ink-600">
        {label}
      </p>

      <span className="absolute top-4 left-4 border border-rust-500 px-2 py-1 font-mono text-[10px] font-medium tracking-[0.08em] text-rust-300 uppercase">
        {badge}
      </span>
    </div>
  );
}
