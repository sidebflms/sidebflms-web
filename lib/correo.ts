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
 * A dónde llega la consulta.
 *
 * `contact@sidebflms.com` es también la dirección que la web anuncia en el
 * pie, en la página de contacto y en los textos legales, y existe como buzón
 * en la propia máquina. Hasta el 2026-09-10 la web anunciaba
 * `hola@sidebflms.com`, que NO existía: quien escribía ahí a mano recibía un
 * rebote. Si algún día se cambia la dirección visible, hay que cambiarla en
 * los dos sitios o vuelve a pasar lo mismo.
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
  /** Nombre del proyecto. Puede venir vacío: dejó de ser obligatorio. */
  proyecto: string;
  /** Tipos de proyecto marcados. Antes se llamaba «cobertura». */
  tipos: string[];
  /** Ya resuelta a una frase: el día, el «más o menos» o «sin definir». */
  fecha: string;
  /** `exacta` | `aproximada` | `sin-definir`. Para leer la fecha con criterio. */
  fechaModo: string;
  /** Sólo llegan si lo que se pide es cobertura de un evento. */
  aforo: string;
  escenarios: string;
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
    linea("Proyecto", c.proyecto),
    linea("Tipo", c.tipos.join(", ")),
    linea(`Fecha (${c.fechaModo})`, c.fecha),
    linea("Aforo", c.aforo),
    linea("Escenarios", c.escenarios),
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
      // Algo identificable en el asunto para buscarlo luego en el buzón sin
      // abrir cada mensaje. El nombre del proyecto si lo hay y, si no, el tipo:
      // desde que el nombre es opcional, el asunto no puede depender de él.
      subject: `Consulta web: ${c.proyecto || c.tipos.join(", ") || "sin nombre"}`,
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

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CANDIDATURAS — «trabaja con nosotros»
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Mismo transporte que las consultas, distinto asunto y distinto cuerpo.
 *
 * ── LO QUE SE RECOGE, Y LO QUE SE DEJÓ DE RECOGER ───────────────────────
 * El formulario pedía edad, nacionalidad, teléfono, idiomas y carnet de
 * conducir. Se quitaron el 2026-09-15: no hacen falta para decidir si alguien
 * encaja en un rodaje, y cuanto menos dato personal entra, menos hay que
 * justificar, conservar y borrar. Queda nombre, correo, especialidad, base,
 * disponibilidad, portfolio y mensaje.
 *
 * Dos cosas que siguen en pie:
 *
 *   · El asunto NO lleva el nombre de la persona. Una lista de asuntos en el
 *     buzón con nombres y apellidos de gente que busca trabajo es otra cosa.
 *   · La política de privacidad enumera lo que se recoge. Si se añade o quita
 *     un campo de este formulario, hay que tocarla — y se ha tocado.
 */
export type Candidatura = {
  nombre: string;
  email: string;
  especialidad: string[];
  /** Desde dónde se mueve. Hay trabajos que se resuelven con quien está cerca. */
  base: string;
  disponibilidad: string;
  /** Un enlace. No hay subida de ficheros y es deliberado: ver jobs-form.tsx. */
  portfolio: string;
  mensaje: string;
};

function cuerpoCandidatura(c: Candidatura): string {
  const lista = (v: string[]) => (v.length ? v.join(", ") : "—");
  const o = (v: string) => v || "—";
  return [
    "Nueva candidatura desde sidebflms.com",
    "",
    `Nombre:          ${o(c.nombre)}`,
    `Email:           ${o(c.email)}`,
    `Especialidad:    ${lista(c.especialidad)}`,
    `Base:            ${o(c.base)}`,
    `Disponibilidad:  ${o(c.disponibilidad)}`,
    `Portfolio:       ${o(c.portfolio)}`,
    "",
    "Mensaje:",
    c.mensaje.trim() || "—",
    "",
    "—",
    "Para responder, basta con darle a Responder: el Reply-To apunta a la persona.",
  ].join("\n");
}

/** Igual que `enviarConsulta`: devuelve booleano y NO lanza. */
export async function enviarCandidatura(c: Candidatura): Promise<boolean> {
  try {
    const transporte = nodemailer.createTransport({
      host: HOST,
      port: PUERTO,
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
      // Sin nombre en el asunto, a propósito: ver la nota de arriba.
      subject: `Candidatura: ${c.especialidad[0] ?? "sin especialidad"}`,
      text: cuerpoCandidatura(c),
    });

    return true;
  } catch (error) {
    console.error("[candidatura] no se pudo enviar el correo", {
      host: HOST,
      puerto: PUERTO,
      destino: DESTINO,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
