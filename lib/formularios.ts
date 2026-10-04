import "server-only";

/**
 * LO COMÚN A LOS DOS FORMULARIOS: validar, recortar y saber de quién viene.
 *
 * Las dos Server Actions —contacto y «trabaja con nosotros»— hacían lo mismo
 * copiado, y las dos acaban mandando correo, así que el descuido en una vale
 * para las dos.
 */

import { EMAIL_RE, emailValido } from "@/lib/email-valido";

export { EMAIL_RE, emailValido };

/**
 * Un campo del formulario, sin espacios sobrantes y RECORTADO.
 *
 * El recorte es contra el abuso, no contra las personas: los campos del
 * formulario llevan el mismo tope en el HTML, así que nadie que escriba a mano
 * lo alcanza. Quien lo alcanza es un robot mandando un megabyte de texto para
 * que lo reenviemos por correo.
 */
export function campo(datos: FormData, nombre: string, tope: number): string {
  return String(datos.get(nombre) ?? "").trim().slice(0, tope);
}

/** Varias casillas: recortadas una a una y con tope de cuántas. */
export function casillas(datos: FormData, nombre: string, tope = 40, cuantas = 12): string[] {
  return datos
    .getAll(nombre)
    .map((v) => String(v).trim().slice(0, tope))
    .filter(Boolean)
    .slice(0, cuantas);
}

/** Topes de cada campo. En un sitio, para que el HTML y el servidor coincidan. */
export const TOPES = {
  nombre: 120,
  email: 254,
  evento: 140,
  fecha: 40,
  aforo: 40,
  escenarios: 40,
  presupuesto: 60,
  mensaje: 4000,
  edad: 10,
  nacionalidad: 60,
  localidad: 80,
  telefono: 40,
  experiencia: 2000,
  idiomas: 120,
  portfolio: 300,
  instagram: 120,
} as const;

/**
 * Lo que la persona escribió, para devolvérselo si el servidor rechaza el
 * envío (ver `lib/use-formulario.ts`). Sin el honeypot, sin los campos internos
 * de React y sin nada que no sea texto; las casillas con el mismo nombre
 * salen como lista. Con un tope por valor por si alguien manda basura.
 */
export function valoresDe(datos: FormData): Record<string, string | string[]> {
  const salida: Record<string, string | string[]> = {};
  for (const [nombre, valor] of datos.entries()) {
    if (typeof valor !== "string" || nombre === "company" || nombre.startsWith("$ACTION")) continue;
    const v = valor.slice(0, 4000);
    const previo = salida[nombre];
    salida[nombre] = previo === undefined ? v : Array.isArray(previo) ? [...previo, v] : [previo, v];
  }
  return salida;
}
