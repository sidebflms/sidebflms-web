import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";

/**
 * Bloque oscuro monocromo que ocupa el lugar de una pieza real.
 *
 * NO se sustituye por una imagen de stock de festival, ni real ni generada: el
 * portfolio es el argumento de venta ante un promotor y una pieza que parezca
 * trabajo entregado sin serlo es el único error de este sitio que no tiene
 * arreglo después. Por eso la marca de "material pendiente" es parte del
 * componente y no un adorno que se pueda quitar por accidente.
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
