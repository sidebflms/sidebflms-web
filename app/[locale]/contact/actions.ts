"use server";

import { enviarConsulta } from "@/lib/correo";
import { campo, casillas, emailValido, TOPES } from "@/lib/formularios";
import { ipDelVisitante } from "@/lib/ip-visitante";
import { permiteEnviar } from "@/lib/limite-envios";

export type ContactState = {
  status: "idle" | "success" | "error";
  fieldErrors?: Partial<Record<"name" | "email" | "eventName" | "consent", string>>;
};

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

  const name = campo(formData, "name", TOPES.nombre);
  const email = campo(formData, "email", TOPES.email);
  const eventName = campo(formData, "eventName", TOPES.evento);
  const consent = formData.get("consent") === "on";

  const fieldErrors: ContactState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "required";
  if (!email || !emailValido(email)) fieldErrors.email = "email";
  if (!eventName) fieldErrors.eventName = "required";
  if (!consent) fieldErrors.consent = "consent";

  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", fieldErrors };
  }

  // EL FRENO. Va después de validar —para no gastar cupo con formularios a
  // medias— y antes de mandar nada. Quien se pasa ve el mismo «no se ha podido
  // enviar» que un fallo del correo, con la dirección para escribir a mano: no
  // hace falta explicarle a un robot por qué no ha colado.
  if (!permiteEnviar(await ipDelVisitante()).ok) {
    return { status: "error" };
  }

  const enviado = await enviarConsulta({
    nombre: name,
    email,
    evento: eventName,
    fecha: campo(formData, "eventDate", TOPES.fecha),
    aforo: campo(formData, "capacity", TOPES.aforo),
    escenarios: campo(formData, "stages", TOPES.escenarios),
    // `coverage` son casillas: puede venir ninguna, una o varias.
    cobertura: casillas(formData, "coverage"),
    presupuesto: campo(formData, "budget", TOPES.presupuesto),
    mensaje: campo(formData, "message", TOPES.mensaje),
  });

  if (!enviado) {
    // Sin `fieldErrors`: el formulario distingue por eso entre «revisa este
    // campo» y el aviso general de arriba. Ver components/ui/contact-form.tsx.
    return { status: "error" };
  }

  return { status: "success" };
}
