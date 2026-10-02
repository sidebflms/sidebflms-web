import Image from "next/image";

import type { Miembro } from "@/content/team";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/routes";
import { cn } from "@/lib/utils";

/**
 * PIEZAS DE «NOSOTROS» QUE LLEVAN REGLAS: cómo se pinta una foto de relleno,
 * y un cargo sin confirmar. Viven aparte para
 * que nadie las rehaga a mano y se olvide, por ejemplo, de la marca «Ejemplo»
 * (una cara saldría bajo un nombre que no es el suyo).
 */

/** Titular partido a mano en líneas, como en el resto del sitio. */
export function LineasTitular({ lineas, lineaClassName }: { lineas: readonly string[]; lineaClassName?: string }) {
  return (
    <>
      {lineas.map((linea) => (
        <span key={linea} className={cn("block", lineaClassName)}>
          {linea}{" "}
        </span>
      ))}
    </>
  );
}

/**
 * La foto de un miembro, `fill` dentro del contenedor que ponga cada versión.
 * Con `fotoEsEjemplo` el alt NO lleva el nombre (un lector de pantalla estaría
 * afirmando que esa cara es esa persona), la foto se queda gris y apagada y
 * lleva la marca en la esquina.
 */
export function FotoMiembro({
  miembro,
  dict,
  sizes,
  className,
}: {
  miembro: Miembro;
  dict: Dictionary;
  sizes: string;
  className?: string;
}) {
  if (!miembro.foto) return null;
  return (
    <>
      <Image
        src={miembro.foto}
        alt={miembro.fotoEsEjemplo ? dict.about.photoExample : miembro.nombre}
        fill
        sizes={sizes}
        className={cn(
          miembro.fotoEsEjemplo
            ? "object-cover grayscale brightness-75"
            : "object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0 hover:grayscale-0",
          className
        )}
      />
      {miembro.fotoEsEjemplo && (
        <span className="label absolute top-2 left-2 z-10 bg-ink-900/80 px-1.5 py-0.5 text-[0.5rem] text-rust-300">
          {dict.about.photoExample}
        </span>
      )}
    </>
  );
}

/**
 * El cargo, EN NARANJA (`rust-300`, 5,9:1 sobre el fondo): en gris no se leía
 * (cliente, 2026-09-16). Si es provisional lleva un asterisco claro detrás y
 * el aviso completo en `title` (el aviso largo ya está arriba de la sección).
 * Sin cargo no se pinta nada: uno inventado se detecta en la primera llamada.
 */
export function CargoMiembro({
  miembro,
  dict,
  locale,
  className,
}: {
  miembro: Miembro;
  dict: Dictionary;
  locale: Locale;
  className?: string;
}) {
  if (!miembro.role) return null;
  return (
    <p
      // DOS LÍNEAS RESERVADAS SIEMPRE. En móvil la rejilla va a dos columnas y
      // el cargo cabe justo: «Fotografía» ocupa una línea y «Drone /
      // Realización» dos, así que unas fichas quedaban más altas que otras y
      // la rejilla se veía desigual (Mario, 2026-09-22, en el móvil). Con el
      // hueco reservado, todas miden lo mismo se llame como se llame el cargo.
      className={cn("label min-h-[2.6em] text-rust-300", className)}
      title={miembro.roleEsEjemplo ? dict.about.roleExample : undefined}
    >
      {miembro.role[locale]}
      {miembro.roleEsEjemplo && <span className="text-bone">&nbsp;*</span>}
    </p>
  );
}
