"use server";

import { enviarCandidatura } from "@/lib/correo";

export type JobsState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<"name" | "email" | "speciality" | "consent", string>>;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Server Action de «trabaja con nosotros».
 *
 * ── QUÉ SE EXIGE Y QUÉ NO ────────────────────────────────────────────────
 * Cuatro cosas: nombre, correo, especialidad y consentimiento. El resto
 * —dónde te mueves, disponibilidad, portfolio, lo que quieras contar— se pide
 * pero no se obliga.
 *
 * El consentimiento SÍ es obligatorio: esto guarda datos de una persona para
 * valorarla más adelante, que es tratamiento con toda la letra.
 *
 * ── A DÓNDE VA ───────────────────────────────────────────────────────────
 * Al mismo buzón que las consultas (`contact@sidebflms.com`), por el SMTP
 * local de la máquina. No hay sistema de recepción de candidaturas ni base de
 * datos: llega un correo y se lee. Si algún día se quiere una bandeja aparte,
 * es `CORREO_DESTINO` en `lib/correo.ts` — pero eso es una decisión de quien
 * gestiona el buzón, no algo que se pueda dar por hecho desde aquí.
 */
export async function submitJobs(
  _prevState: JobsState,
  formData: FormData
): Promise<JobsState> {
  // Mismo honeypot que en contacto.
  if (String(formData.get("company") ?? "").trim() !== "") {
    return { status: "success" };
  }

  const texto = (campo: string) => String(formData.get(campo) ?? "").trim();

  const name = texto("name");
  const email = texto("email");
  const speciality = formData.getAll("speciality").map(String);
  const consent = formData.get("consent") === "on";

  const fieldErrors: JobsState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email || !EMAIL_RE.test(email)) fieldErrors.email = "email";
  if (speciality.length === 0) fieldErrors.speciality = "speciality";
  if (!consent) fieldErrors.consent = "consent";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  const enviado = await enviarCandidatura({
    nombre: name,
    email,
    especialidad: speciality,
    base: texto("base"),
    disponibilidad: texto("availability"),
    portfolio: texto("portfolio"),
    mensaje: texto("message"),
  });

  if (!enviado) return { status: "error" };

  return { status: "success" };
}
