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
 * Delante de cada asunto. Vacío en la web normal; la versión de pruebas
 * (despliegue/publicar-glass.sh) pone «[PRUEBA GLASS] » para que lo que manden
 * quienes la prueban se distinga en el buzón de una consulta de verdad.
 */
const PREFIJO_ASUNTO = process.env.CORREO_PREFIJO_ASUNTO ?? "";

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

/**
 * El transporte, en un solo sitio.
 *
 * Los dos envíos lo construían igual, copiado. Con los acuses de recibo serían
 * cuatro copias de la misma configuración, y el día que cambie el puerto habría
 * que acordarse de las cuatro.
 */
function transporte() {
  return nodemailer.createTransport({
    host: HOST,
    port: PUERTO,
    // El 25 en local va en claro y no hace falta más: el mensaje no sale de la
    // máquina. `ignoreTLS` evita que nodemailer intente STARTTLS contra el
    // certificado del propio servidor y falle por el nombre.
    secure: false,
    ignoreTLS: true,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  ACUSES DE RECIBO — la copia que se le manda a quien rellena el formulario
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Mario, 2026-09-16: que quien escribe reciba «un correo de resumen o
 * confirmación de lo que ha rellenado», y que la candidatura confirme que se
 * ha completado.
 *
 * ── TRES COSAS QUE HAY QUE SABER ────────────────────────────────────────
 *
 * 1. **Estos correos SÍ salen a internet.** Los avisos internos van a un buzón
 *    de esta misma máquina y no atraviesan nada; un acuse va al Gmail de quien
 *    escribió. Ahí la entrega depende del SPF y el DKIM del dominio. Están
 *    puestos, pero conviene mirar el primero que salga y comprobar que no cae
 *    en spam.
 *
 * 2. **Si el acuse falla, la consulta NO falla.** Lo que importa es que el
 *    aviso interno llegue: ahí está el encargo. El acuse es cortesía, así que
 *    se manda después, aparte, y un fallo suyo sólo queda en el registro. Al
 *    revés sería absurdo: perder una consulta porque el cliente tiene el buzón
 *    lleno.
 *
 * 3. **No lleva nada que no haya escrito esa persona.** Es su propia copia.
 */
function acuse(asunto: string, destino: string, texto: string): void {
  // Sin `await` a propósito, y con el fallo tragado: ver el punto 2.
  transporte()
    .sendMail({
      from: `"SIDEBFLMS" <${REMITENTE}>`,
      to: destino,
      replyTo: DESTINO,
      subject: PREFIJO_ASUNTO + asunto,
      text: texto,
    })
    .catch((error) => {
      console.error("[acuse] no se pudo enviar la confirmación", {
        destino,
        error: error instanceof Error ? error.message : String(error),
      });
    });
}

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
    await transporte().sendMail({
      from: `"Web SIDEBFLMS" <${REMITENTE}>`,
      to: DESTINO,
      replyTo: `"${c.nombre}" <${c.email}>`,
      // El nombre del evento en el asunto para poder buscarlo luego en el
      // buzón sin abrir cada mensaje.
      subject: `${PREFIJO_ASUNTO}Consulta web: ${c.evento || "sin nombre de evento"}`,
      text: cuerpo(c),
    });

    // El acuse va DESPUÉS y sólo si el aviso interno salió: si no hemos
    // recibido la consulta, decirle a alguien «la hemos recibido» es mentira.
    acuseConsulta(c);

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

/** El resumen que recibe quien escribe: lo suyo, tal como lo mandó. */
function acuseConsulta(c: Consulta): void {
  const linea = (etiqueta: string, valor: string) =>
    valor.trim() ? `${etiqueta}: ${valor.trim()}` : null;

  const resumen = [
    linea("Evento", c.evento),
    linea("Fecha", c.fecha),
    linea("Aforo", c.aforo),
    linea("Escenarios", c.escenarios),
    linea("Cobertura", c.cobertura.join(", ")),
    linea("Presupuesto", c.presupuesto),
  ].filter((l): l is string => l !== null);

  acuse(
    `Hemos recibido tu consulta${c.evento ? `: ${c.evento}` : ""}`,
    c.email,
    [
      `Hola${c.nombre ? " " + c.nombre.split(" ")[0] : ""},`,
      "",
      "Hemos recibido tu consulta y te respondemos en 24 horas laborables.",
      "",
      "Esto es lo que nos has contado:",
      "",
      // Sólo lo que rellenó. Una lista con seis «—» no informa de nada y hace
      // pensar que se ha perdido algo.
      ...(resumen.length ? resumen : ["(sin datos adicionales)"]),
      "",
      "Tu mensaje:",
      c.mensaje.trim() || "(sin mensaje)",
      "",
      "Si algo no cuadra o quieres añadir cualquier cosa, responde a este",
      "correo directamente.",
      "",
      "SIDEBFLMS",
      DESTINO,
    ].join("\n")
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  CANDIDATURAS — «trabaja con nosotros»
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Mismo transporte que las consultas, distinto asunto y distinto cuerpo.
 *
 * ── OJO: AQUÍ HAY MÁS DATO PERSONAL QUE EN UNA CONSULTA ─────────────────
 * Una consulta trae nombre, email y de qué va el evento. Una candidatura trae
 * además edad, nacionalidad, dónde vive y el teléfono. Eso es otra categoría
 * de dato y por eso:
 *
 *   · El asunto NO lleva el nombre de la persona. El de las consultas sí lleva
 *     el del evento, porque un evento no es nadie; una lista de asuntos en el
 *     buzón con nombres y apellidos de gente que busca trabajo es otra cosa.
 *   · La política de privacidad tuvo que decir que esto se recoge y para qué.
 *     Si se añade o quita un campo de este formulario, hay que tocarla.
 */
export type Candidatura = {
  nombre: string;
  edad: string;
  nacionalidad: string;
  localidad: string;
  email: string;
  telefono: string;
  especialidad: string[];
  experiencia: string;
  eventos: string[];
  carnet: string;
  idiomas: string;
  portfolio: string;
  instagram: string;
};

function cuerpoCandidatura(c: Candidatura): string {
  const lista = (v: string[]) => (v.length ? v.join(", ") : "—");
  const o = (v: string) => v || "—";
  return [
    `Nombre:        ${o(c.nombre)}`,
    `Edad:          ${o(c.edad)}`,
    `Nacionalidad:  ${o(c.nacionalidad)}`,
    `Localidad:     ${o(c.localidad)}`,
    `Email:         ${o(c.email)}`,
    `Teléfono:      ${o(c.telefono)}`,
    "",
    `Especialidad:  ${lista(c.especialidad)}`,
    `Experiencia:   ${o(c.experiencia)}`,
    `Eventos:       ${lista(c.eventos)}`,
    `Carnet:        ${o(c.carnet)}`,
    `Idiomas:       ${o(c.idiomas)}`,
    "",
    `Portfolio:     ${o(c.portfolio)}`,
    `Instagram:     ${o(c.instagram)}`,
  ].join("\n");
}

/** Igual que `enviarConsulta`: devuelve booleano y NO lanza. */
export async function enviarCandidatura(c: Candidatura): Promise<boolean> {
  try {
    await transporte().sendMail({
      from: `"Web SIDEBFLMS" <${REMITENTE}>`,
      to: DESTINO,
      replyTo: `"${c.nombre}" <${c.email}>`,
      // Sin nombre en el asunto, a propósito: ver la nota de arriba.
      subject: `${PREFIJO_ASUNTO}Candidatura: ${c.especialidad[0] ?? "sin especialidad"}`,
      text: cuerpoCandidatura(c),
    });

    acuseCandidatura(c);

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

/**
 * El «completado» de la candidatura.
 *
 * Más corto que el de contacto y a propósito: aquí lo que hace falta es saber
 * que se ha enviado y que no hay que esperar respuesta por sistema. Repetirle
 * a alguien sus propios datos personales por correo —edad, nacionalidad,
 * teléfono— no le sirve de nada y multiplica dónde vive ese dato.
 *
 * Y NO promete plazo ni respuesta: no hay ninguno acordado. Dice exactamente
 * lo mismo que la pantalla que ve al enviar.
 */
function acuseCandidatura(c: Candidatura): void {
  acuse("Candidatura recibida — SIDEBFLMS", c.email, [
    `Hola${c.nombre ? " " + c.nombre.split(" ")[0] : ""},`,
    "",
    "Tu candidatura se ha enviado correctamente y queda guardada.",
    "",
    c.especialidad.length ? `Especialidad: ${c.especialidad.join(", ")}` : null,
    c.portfolio ? `Portfolio: ${c.portfolio}` : null,
    "",
    "No respondemos a todas, pero se leen: si entra un trabajo que encaja con",
    "lo que haces, te escribimos.",
    "",
    "SIDEBFLMS",
    DESTINO,
  ]
    .filter((l): l is string => l !== null)
    .join("\n"));
}
