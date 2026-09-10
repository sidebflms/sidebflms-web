import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * `rust-500` queda en 3.1:1 sobre el fondo: por debajo de AA para texto. Aquí
 * se usa como FONDO de botón, que es uno de los tres usos permitidos (el texto
 * encima es `bone`, y ahí el contraste sí cumple). Nunca uses `rust-500` para
 * el texto de un botón fantasma.
 */
const base =
  "group relative inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-200 px-6 py-4";

const variants = {
  primary: "bg-rust-500 text-bone hover:bg-rust-300 hover:text-ink-900",
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
