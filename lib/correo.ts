import "server-only";

import nodemailer from "nodemailer";

/**
 * Envío del correo del formulario de contacto.
 *
 * ── Por qué SMTP en localhost y no un proveedor ──────────────────────────
 * La web corre en el mismo VPS que el servidor de correo del dominio (Exim,
 * puesto por Hestia). Entregar ahí es entrega LOCAL: `contact@sidebflms.com`
 * es un buzón de esa misma máquina, así que el mensaje no sale a internet, no
 * hay que atravesar filtros de spam ajenos y no hace falta ninguna clave de
 * API ni una cuenta en un tercero.
 *
 * A cambio, si algún día el destinatario pasa a ser una dirección de fuera
 * (una de Gmail, por ejemplo), esto sí sale a internet y entonces la
 * entregabilidad depende del SPF y el DKIM del dominio. Están puestos, pero
 * conviene comprobarlo antes de cambiar el destino.
 *
 * ── Sin autenticación, y no es un descuido ───────────────────────────────
 * Exim acepta sin credenciales lo que le llega desde 127.0.0.1, porque quien
 * ya está dentro de la máquina no gana nada autenticándose. No es un relay
 * abierto: desde fuera sí las pide.
 */

const HOST = process.env.SMTP_HOST ?? "127.0.0.1";
const PUERTO = Number(process.env.SMTP_PORT ?? 25);

/**
 * A dónde llega la consulta. `contact@sidebflms.com` existe como buzón.
 *
 * OJO: la web anuncia `hola@sidebflms.com` en el pie y en los textos legales,
 * y ESE BUZÓN NO EXISTE — quien escriba ahí a mano recibe un rebote. Hay que
 * crearlo en Hestia o cambiar los textos; hasta entonces, el formulario
 * entrega en `contact@` a propósito, que sí lo lee alguien.
 */
const DESTINO = process.env.CORREO_DESTINO ?? "contact@sidebflms.com";

/**
 * El remitente es una dirección NUESTRA, no la del visitante.
 *
 * Poner al visitante en el `From` es la tentación evidente —así se puede
 * responder directamente— pero es justo lo que el SPF del dominio del
 * visitante prohíbe: nuestro servidor no está autorizado a mandar correo en
 * nombre de gmail.com. El mensaje acabaría en spam o rechazado.
 *
 * La forma correcta es ésta: `From` nuestro, y el visitante en `Reply-To`.
 * Al responder desde el buzón, la respuesta va a él igualmente.
 */
const REMITENTE = process.env.CORREO_REMITENTE ?? "contact@sidebflms.com";

export type Consulta = {
  nombre: string;
  email: string;
  evento: string;
  fecha: string;
  aforo: string;
  escenarios: string;
  cobertura: string[];
  presupuesto: string;
  mensaje: string;
};

function cuerpo(c: Consulta): string {
  const linea = (etiqueta: string, valor: string) =>
    valor.trim() ? `${etiqueta}: ${valor.trim()}` : `${etiqueta}: —`;

  return [
    "Nueva consulta desde el formulario de sidebflms.com",
    "",
    linea("Nombre", c.nombre),
    linea("Email", c.email),
    "",
    linea("Evento", c.evento),
    linea("Fecha", c.fecha),
    linea("Aforo", c.aforo),
    linea("Escenarios", c.escenarios),
    linea("Cobertura", c.cobertura.join(", ")),
    linea("Presupuesto", c.presupuesto),
    "",
    "Mensaje:",
    c.mensaje.trim() || "—",
    "",
    "—",
    "Para responder, basta con darle a Responder: el Reply-To apunta al visitante.",
  ].join("\n");
}

/**
 * Devuelve `true` si el correo salió. NO lanza: quien llama es una Server
 * Action, y una excepción ahí se le enseña al visitante como un error de la
 * página entera. Lo que corresponde es que el formulario diga «no se ha
 * podido enviar» y el motivo quede en el registro del servidor.
 */
export async function enviarConsulta(c: Consulta): Promise<boolean> {
  try {
    const transporte = nodemailer.createTransport({
      host: HOST,
      port: PUERTO,
      // El 25 en local va en claro y no hace falta más: el mensaje no sale de
      // la máquina. `ignoreTLS` evita que nodemailer intente STARTTLS contra
      // el certificado del propio servidor y falle por el nombre.
      secure: false,
      ignoreTLS: true,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    await transporte.sendMail({
      from: `"Web SIDEBFLMS" <${REMITENTE}>`,
      to: DESTINO,
      replyTo: `"${c.nombre}" <${c.email}>`,
      // El nombre del evento en el asunto para poder buscarlo luego en el
      // buzón sin abrir cada mensaje.
      subject: `Consulta web: ${c.evento || "sin nombre de evento"}`,
      text: cuerpo(c),
    });

    return true;
  } catch (error) {
    // El registro es lo único que queda si esto falla, así que va completo.
    console.error("[contacto] no se pudo enviar el correo", {
      host: HOST,
      puerto: PUERTO,
      destino: DESTINO,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
