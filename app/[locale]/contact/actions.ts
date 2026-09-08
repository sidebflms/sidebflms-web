"use server";

export type ContactState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<"name" | "email" | "eventName" | "consent", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server Action del formulario de contacto.
 *
 * TODO (cliente) — BLOQUEANTE ANTES DE PUBLICAR: esto valida y confirma, pero
 * NO envía ningún email todavía. No hay proveedor de correo transaccional
 * configurado (Resend, Postmark, SES…). Antes de producción hay que:
 *   1. Elegir proveedor y añadir su API key como variable de entorno.
 *   2. Sustituir el bloque marcado `// TODO: enviar email` por la llamada real.
 *   3. Decidir si además se guarda el lead en algún sitio (hoja de cálculo,
 *      CRM, base de datos) — de momento no se persiste en ningún lado.
 * Hasta entonces, el formulario valida correctamente pero el envío es un
 * placeholder que solo confirma en pantalla.
 */
export async function submitContact(
  _prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: campo invisible para humanos. Un bot que rellena todos los
  // campos de un formulario cae aquí. Si tiene contenido, se responde éxito
  // (no delatar al bot) pero no se procesa nada.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const eventName = String(formData.get("eventName") ?? "").trim();
  const consent = formData.get("consent") === "on";

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email || !EMAIL_RE.test(email)) fieldErrors.email = "email";
  if (!eventName) fieldErrors.eventName = "required";
  if (!consent) fieldErrors.consent = "consent";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  // TODO: enviar email (ver nota de arriba). De momento solo se registra en
  // el log del servidor para poder verificar manualmente durante el desarrollo.
  console.info("[contacto] nueva consulta", {
    name,
    email,
    eventName,
    eventDate: formData.get("eventDate"),
    capacity: formData.get("capacity"),
    stages: formData.get("stages"),
    coverage: formData.getAll("coverage"),
    budget: formData.get("budget"),
    message: formData.get("message"),
  });

  return { status: "success" };
}
