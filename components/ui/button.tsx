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

/* ============================================================================
   BOTONES DE LA VERSIÓN GLASS
   ========================================================================== */

/** Flecha diagonal ↗ que gira a → al pasar el ratón (`.flecha-giro`). */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("flecha-giro h-4 w-4", className)}
    >
      <path d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6" />
    </svg>
  );
}

const pillBase =
  "group relative inline-flex items-center gap-3 rounded-full text-xs font-medium uppercase tracking-[0.08em] transition-colors duration-300";

const pillVariants = {
  /* Cristal con texto claro y círculo naranja a la derecha: el CTA principal. */
  glass: "glass py-1.5 pr-1.5 pl-6 text-bone",
  /* Pastilla clara, como «Start» en las referencias. Texto oscuro sobre bone:
     contraste de sobra. */
  light: "bg-bone py-1.5 pr-1.5 pl-5 text-ink-900 hover:bg-white",
  /* Sólo el texto con el círculo, sin caja. */
  bare: "py-1 pr-1 pl-0 text-bone hover:text-rust-300",
} as const;

const circleVariants = {
  glass: "bg-brand-600 text-bone group-hover:bg-rust-500",
  light: "bg-ink-900 text-bone",
  bare: "border border-bone/30 text-bone group-hover:border-rust-300",
} as const;

type PillVariant = keyof typeof pillVariants;

/**
 * Pastilla con un círculo al final que lleva la flecha. El círculo es el
 * `brand-600` del botón primario (4.57:1 con bone) y sube a `rust-500` al
 * pasar el ratón, igual que el primario de siempre.
 */
export function PillLink({
  variant = "glass",
  className,
  children,
  icon,
  ...props
}: ComponentProps<typeof Link> & { variant?: PillVariant; children: ReactNode; icon?: ReactNode }) {
  return (
    <Link className={cn(pillBase, pillVariants[variant], className)} {...props}>
      <span>{children}</span>
      <span
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
          circleVariants[variant]
        )}
      >
        {icon ?? <ArrowUpRight />}
      </span>
    </Link>
  );
}

/** Botón redondo de cristal para iconos: redes, menú, anterior/siguiente. */
export const circleButton =
  "glass inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-bone transition-colors duration-300 hover:text-rust-300";
