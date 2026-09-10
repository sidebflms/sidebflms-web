/**
 * EL EQUIPO.
 *
 * ── DE DÓNDE SALEN ESTOS NOMBRES ─────────────────────────────────────────
 * De la lista de buzones de la empresa, que Mario pasó el 2026-09-10. Se
 * quitaron Fran y Joker, que ya no están.
 *
 * **Los correos NO se publican.** Están en la lista de origen, pero un correo
 * personal en una web comercial es una dirección más para el spam y no aporta
 * nada: el contacto del sitio es uno solo, `contact@sidebflms.com`.
 *
 * ── LO QUE FALTA, Y HAY QUE PEDIR ────────────────────────────────────────
 * `role` está en `null` en casi todos. Un equipo sin cargos se lee como una
 * lista de nombres; con cargos se lee como una productora que sabe quién hace
 * qué. Es lo que separa esta página de un directorio.
 *
 * NO SE INVENTAN. Poner «cámara» a alguien que es productor es de las cosas
 * que un cliente detecta en la primera llamada. La ficha se pinta sin cargo
 * mientras esté en `null`, que es feo pero no es mentira.
 *
 * Faltan también las fotos. La cuadrícula funciona sin ellas.
 *
 * ── ANTES DE ABRIR LA WEB AL PÚBLICO ─────────────────────────────────────
 * Publicar el nombre de una persona en una web comercial es publicar un dato
 * suyo. Conviene que cada uno sepa que aparece y cómo — sobre todo quien sale
 * con apodo (Galoguin, Jota, Kenny) y no con su nombre.
 */

export type Miembro = {
  /** Como quiere aparecer en la web. Apodo si es como se le conoce. */
  nombre: string;
  /** `null` mientras no esté confirmado. NO se rellena a ojo. */
  role: { es: string; en: string } | null;
  /** Ruta en `public/media/equipo/`. `null` mientras no haya foto. */
  foto: string | null;
};

export const EQUIPO: Miembro[] = [
  { nombre: "Mario Bote", role: null, foto: null },
  { nombre: "Fernando", role: null, foto: null },
  { nombre: "Galoguin", role: null, foto: null },
  { nombre: "Iván", role: null, foto: null },
  { nombre: "Jota", role: null, foto: null },
  { nombre: "Kenny", role: null, foto: null },
  { nombre: "María", role: null, foto: null },
  { nombre: "Nacho López", role: null, foto: null },
  { nombre: "Natalia", role: null, foto: null },
  { nombre: "Rubén", role: null, foto: null },
  { nombre: "Sergio", role: null, foto: null },
];
