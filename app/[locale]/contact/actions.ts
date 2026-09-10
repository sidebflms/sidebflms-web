"use server";

import { enviarConsulta } from "@/lib/correo";

export type ContactState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<"name" | "email" | "eventName" | "consent", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server Action del formulario de contacto.
 *
 * El envío va por SMTP contra el Exim de la propia máquina; los detalles y el
 * porqué están en `lib/correo.ts`. Si el correo no sale, esto devuelve
 * `error` y el formulario enseña «no se ha podido enviar» con la dirección
 * para escribir a mano — que es mejor que decir «recibido» y perder la
 * consulta, que es lo que hacía la versión anterior.
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

  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();

  const enviado = await enviarConsulta({
    nombre: name,
    email,
    evento: eventName,
    fecha: texto("eventDate"),
    aforo: texto("capacity"),
    escenarios: texto("stages"),
    // `coverage` son casillas: puede venir ninguna, una o varias.
    cobertura: formData.getAll("coverage").map(String),
    presupuesto: texto("budget"),
    mensaje: texto("message"),
  });

  if (!enviado) {
    // Sin `fieldErrors`: el formulario distingue por eso entre «revisa este
    // campo» y el aviso general de arriba. Ver components/ui/contact-form.tsx.
    return { status: "error" };
  }

  return { status: "success" };
}
