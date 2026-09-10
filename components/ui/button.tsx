import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * POR QUÉ EL PRIMARIO ES `brand-600` Y NO `rust-500`, con el número delante.
 *
 * El texto de estos botones es `bone` (#f2ece4), no blanco puro. Medido:
 *
 *   bone sobre #bb4223 (brand-600)  4.57:1  ✅ cumple AA
 *   bone sobre #e8451d (rust-500)   3.38:1  ❌ NO cumple
 *
 * Así que el naranja de marca a pleno **no vale como fondo de botón**: sólo
 * vale su versión oscurecida. Al pasar el ratón sí sube a `rust-500`, y ahí
 * bajar de contraste es aceptable porque el foco ya está en el elemento.
 *
 * `rust-500` sobre el fondo de página queda en 4.2:1, por debajo de AA para
 * texto normal: nunca lo uses para el texto de un botón fantasma.
 */
const base =
  "group relative inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200 px-6 py-4";

const variants = {
  primary: "bg-brand-600 text-bone hover:bg-rust-500 hover:text-bone",
  outline: "border border-ink-600 text-bone hover:border-rust-300 hover:text-rust-300",
  bare: "px-0 py-0 text-smoke hover:text-rust-300",
} as const;

type Variant = keyof typeof variants;

export function ButtonLink({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; children: ReactNode }) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; children: ReactNode }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

/** Flecha de los CTA. Se desplaza al hover del botón, sin animación propia. */
export function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
    >
      →
    </span>
  );
}
