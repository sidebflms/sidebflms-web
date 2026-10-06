/**
 * EL VALIDADOR DE CORREO, EN UN ARCHIVO QUE VALE PARA SERVIDOR Y NAVEGADOR.
 *
 * Vivía en `lib/formularios.ts`, que lleva `import "server-only"` y por eso no
 * se podía usar en los formularios (componentes de cliente). El navegador
 * avisa al salir del campo con LA MISMA regla que luego aplica el servidor
 * (2026-10-04): si fueran dos reglas distintas, el aviso diría «bien» a algo
 * que el servidor rechaza, o al revés. Una sola, aquí.
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
