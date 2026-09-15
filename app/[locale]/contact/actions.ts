"use server";

import { enviarConsulta } from "@/lib/correo";

export type ContactState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<"name" | "email" | "projectType" | "message" | "consent", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server Action del formulario de contacto.
 *
 * ── QUÉ SE EXIGE, Y POR QUÉ ESTOS CUATRO ─────────────────────────────────
 * Nombre, email, tipo de proyecto y una descripción breve. Con eso se puede
 * responder algo útil; sin cualquiera de los cuatro, no.
 *
 * Lo que ha dejado de ser obligatorio es el NOMBRE DEL PROYECTO. Mucha gente
 * escribe antes de tener nombre —o sin querer darlo todavía— y era un muro en
 * el tercer campo. A cambio, ahora sí se exige el mensaje: un formulario sin
 * una línea de contexto obliga a contestar preguntando.
 *
 * El envío va por SMTP contra el Exim de la propia máquina; los detalles están
 * en `lib/correo.ts`. Si el correo no sale, esto devuelve `error` y el
 * formulario enseña «no se ha podido enviar» con la dirección para escribir a
 * mano — mejor que decir «recibido» y perder la consulta.
 */
export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: campo invisible para humanos. Un bot que rellena todos los
  // campos cae aquí. Si tiene contenido se responde éxito —no delatar al
  // bot— pero no se procesa nada.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();

  const name = texto("name");
  const email = texto("email");
  const projectType = formData.getAll("projectType").map(String);
  const message = texto("message");
  const consent = formData.get("consent") === "on";

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email || !EMAIL_RE.test(email)) fieldErrors.email = "email";
  if (projectType.length === 0) fieldErrors.projectType = "projectType";
  if (!message) fieldErrors.message = "required";
  if (!consent) fieldErrors.consent = "consent";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  /**
   * LA FECHA, EN UNA SOLA LÍNEA PARA EL CORREO.
   *
   * En el formulario son tres estados y dos campos posibles; en el buzón
   * interesa una frase. «Sin definir» se escribe tal cual: en el correo, un
   * hueco vacío no distingue entre «no lo sabe» y «no lo rellenó».
   */
  const modo = texto("dateMode") || "exacta";
  const fecha =
    modo === "exacta"
      ? texto("dateExact")
      : modo === "aproximada"
        ? texto("dateApprox")
        : "Sin definir todavía";

  const enviado = await enviarConsulta({
    nombre: name,
    email,
    proyecto: texto("projectName"),
    tipos: projectType,
    fecha,
    fechaModo: modo,
    aforo: texto("capacity"),
    escenarios: texto("stages"),
    presupuesto: texto("budget"),
    mensaje: message,
  });

  if (!enviado) {
    // Sin `fieldErrors`: el formulario distingue por eso entre «revisa este
    // campo» y el aviso general. Ver components/ui/contact-form.tsx.
    return { status: "error" };
  }

  return { status: "success" };
}
