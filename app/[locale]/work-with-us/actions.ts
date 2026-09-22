"use server";

import { enviarCandidatura } from "@/lib/correo";
import { campo, casillas, emailValido, TOPES } from "@/lib/formularios";
import { ipDelVisitante } from "@/lib/ip-visitante";
import { permiteEnviar } from "@/lib/limite-envios";

export type JobsState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<"name" | "email" | "speciality" | "consent", string>>;
};

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

  const name = campo(formData, "name", TOPES.nombre);
  const email = campo(formData, "email", TOPES.email);
  const speciality = casillas(formData, "speciality");
  const consent = formData.get("consent") === "on";

  const fieldErrors: JobsState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email || !emailValido(email)) fieldErrors.email = "email";
  if (speciality.length === 0) fieldErrors.speciality = "required";
  if (!consent) fieldErrors.consent = "consent";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  // El mismo freno que en contacto, y por lo mismo: esto también manda un
  // acuse a la dirección que teclea quien rellena. Ver lib/limite-envios.ts.
  if (!permiteEnviar(await ipDelVisitante()).ok) {
    return { status: "error" };
  }

  const enviado = await enviarCandidatura({
    nombre: name,
    edad: campo(formData, "age", TOPES.edad),
    nacionalidad: campo(formData, "nationality", TOPES.nacionalidad),
    localidad: campo(formData, "city", TOPES.localidad),
    email,
    telefono: campo(formData, "phone", TOPES.telefono),
    especialidad: speciality,
    experiencia: campo(formData, "experience", TOPES.experiencia),
    eventos: casillas(formData, "events"),
    carnet: campo(formData, "licence", 40),
    idiomas: campo(formData, "languages", TOPES.idiomas),
    portfolio: campo(formData, "portfolio", TOPES.portfolio),
    instagram: campo(formData, "instagram", TOPES.instagram),
  });

  if (!enviado) return { status: "error" };

  return { status: "success" };
}
