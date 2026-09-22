import "server-only";

/**
 * LO COMÚN A LOS DOS FORMULARIOS: validar, recortar y saber de quién viene.
 *
 * Las dos Server Actions —contacto y «trabaja con nosotros»— hacían lo mismo
 * copiado, y las dos acaban mandando correo, así que el descuido en una vale
 * para las dos.
 */

/**
 * LA DIRECCIÓN DE CORREO.
 *
 * Más estricta que la de antes (`[^\s@]+@[^\s@]+\.[^\s@]+`), que dejaba pasar
 * cosas como `root,otro@sitio.test`: nodemailer entiende la coma como
 * separador de direcciones, así que el acuse acababa yendo a una dirección
 * distinta de la que se validó. Comprobado el 2026-09-22.
 *
 * Aquí no se admiten comas, punto y coma, comillas ni ángulos —lo que sirve
 * para meter una segunda dirección— y el dominio tiene que parecer un dominio.
 * No pretende cumplir el RFC entero: pretende que lo que pase sea una sola
 * dirección y no una lista.
 */
export const EMAIL_RE = /^[^\s@,;:<>"'()[\]\\]{1,64}@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,63}$/;

/** Una dirección válida y de largo razonable (el RFC topa en 254). */
export function emailValido(valor: string): boolean {
  return valor.length <= 254 && EMAIL_RE.test(valor);
}

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
