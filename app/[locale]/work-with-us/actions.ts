"use server";

import { enviarCandidatura } from "@/lib/correo";

export type JobsState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<"name" | "email" | "speciality" | "consent", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server Action del formulario de «trabaja con nosotros».
 *
 * ── QUÉ SE EXIGE Y QUÉ NO ────────────────────────────────────────────────
 * Sólo cuatro cosas: nombre, email, especialidad y consentimiento. El resto
 * —edad, nacionalidad, teléfono, idiomas— se pide pero no se obliga, y es
 * deliberado: son datos personales, y obligar a darlos para poder mandar una
 * candidatura convierte un formulario en un interrogatorio. Quien quiera
 * contar poco, que cuente poco; ya se le preguntará si interesa.
 *
 * El consentimiento SÍ es obligatorio, y aquí más que en el de contacto:
 * esto recoge edad y nacionalidad, que es dato personal de otra categoría.
 */
export async function submitJobs(
  _prevState: JobsState,
  formData: FormData
): Promise<JobsState> {
  // Mismo honeypot que en contacto.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const speciality = formData.getAll("speciality").map(String);
  const consent = formData.get("consent") === "on";

  const fieldErrors: JobsState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email || !EMAIL_RE.test(email)) fieldErrors.email = "email";
  if (speciality.length === 0) fieldErrors.speciality = "required";
  if (!consent) fieldErrors.consent = "consent";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();

  const enviado = await enviarCandidatura({
    nombre: name,
    edad: texto("age"),
    nacionalidad: texto("nationality"),
    localidad: texto("city"),
    email,
    telefono: texto("phone"),
    especialidad: speciality,
    experiencia: texto("experience"),
    eventos: formData.getAll("events").map(String),
    carnet: texto("licence"),
    idiomas: texto("languages"),
    portfolio: texto("portfolio"),
    instagram: texto("instagram"),
  });

  if (!enviado) return { status: "error" };

  return { status: "success" };
}
