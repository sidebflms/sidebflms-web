/* CAMPOS DE CRISTAL (versión glass, 2026-09-16).
   Eran una línea inferior sobre fondo transparente. Ahora cada campo es una
   pastilla de cristal: relleno blanco al 5 %, filo de 1 px, brillo interior
   arriba y desenfoque de lo que tiene detrás. Al enfocar se aclara y le sale
   un halo naranja (además del anillo de foco del sitio con teclado).

   OJO: dentro de un panel `.glass` el `backdrop-blur` del campo sólo ve el
   interior del panel (ver «la trampa del desenfoque» en globals.css); el
   efecto lo ponen sobre todo el relleno, el filo y el brillo.

   Viven aquí, fuera de contact-form.tsx, porque el formulario de candidaturas
   (jobs-form.tsx) usa los mismos campos: así las dos páginas se leen como una
   sola y ninguno de los dos formularios importa al otro (ni su server action). */
const campoBase =
  "w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 text-base text-bone md:text-[1.0625rem] shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-smoke/70 hover:border-white/20 focus:border-rust-300/70 focus:bg-white/[0.08] focus:shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_0_0_4px_rgb(232_69_29/0.15)] focus:outline-none aria-[invalid=true]:border-rust-300/70";

export const fieldClasses = `${campoBase} py-3.5`;

/* Más bajos, para el formulario de contacto: tiene que verse entero en una
   pantalla de portátil sin hacer scroll (cliente, 2026-09-17). */
export const fieldClassesCompact = `${campoBase} py-2.5`;

/* Casillas como pastillas de cristal: la casilla nativa se mantiene (teclado y
   lectores de pantalla), y la pastilla entera se enciende al marcarla. */
export const chipClasses =
  "flex cursor-pointer items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 text-sm text-bone shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md transition-colors duration-300 hover:border-white/25 has-[:checked]:border-rust-500/70 has-[:checked]:bg-rust-500/20 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-rust-300";
