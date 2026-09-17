"use client";

import { JobsForm } from "@/components/ui/jobs-form";
import { CabeceraFormulario } from "@/components/sections/contacto/comun";
import { FormularioPorPasos, type PasoFormulario } from "@/components/sections/contacto/formulario-por-pasos";
import type { Dictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/routes";

/**
 * «TRABAJA CON NOSOTROS». El mismo diseño y la misma estructura que
 * «Contacto» (components/sections/contacto/contacto-tarjetas.tsx), a petición
 * del cliente el 2026-09-17: antes era una mesa de tarjetas, que en contacto
 * ya se había sustituido.
 *
 *   1. LA CABECERA (`CabeceraFormulario`, compartida): rótulo, titular y
 *      entradilla, y debajo el botón al formulario, el correo y las redes.
 *      Aquí sólo hay un botón: el segundo de contacto lleva a las preguntas
 *      frecuentes, y no hay preguntas de candidatos escritas (inventarlas
 *      sería poner en boca de la empresa cosas que no ha dicho).
 *
 *   2. EL FORMULARIO POR PASOS. El mismo panel con carril que en contacto,
 *      con `JobsForm` dentro. Aquí los pasos no son rótulos de campos sino
 *      tres tramos (quién eres, qué haces, dónde verte): son trece preguntas y
 *      un paso por campo haría un carril de trece líneas.
 */

const ID_FORM = "trabaja-formulario";

/** Los pasos del carril: cada tramo con los `name` de los campos que agrupa, en orden. */
function pasosFormulario(dict: Dictionary): PasoFormulario[] {
  const j = dict.jobs;
  return [
    { nombre: j.steps.who, campos: ["name", "email", "age", "nationality", "city", "phone", "languages"] },
    { nombre: j.steps.what, campos: ["speciality", "experience", "events", "licence"] },
    { nombre: j.steps.where, campos: ["portfolio", "instagram"] },
    { nombre: j.form.submit, campos: ["consent"] },
  ];
}

export function TrabajaTarjetas({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <main id="main" className="pagina">
      {/* ── 1. LA CABECERA ───────────────────────────────────────────────── */}
      <section data-reglet={dict.jobs.label} className="shell">
        <CabeceraFormulario
          dict={dict}
          rotulo={dict.jobs.label}
          titular={dict.jobs.headline}
          entradilla={dict.jobs.intro}
          principal={{ texto: dict.jobs.formLabel, id: ID_FORM }}
        />
      </section>

      {/* ── 2. EL FORMULARIO POR PASOS ───────────────────────────────────── */}
      <FormularioPorPasos
        id={ID_FORM}
        reglet={dict.jobs.formLabel}
        titulo={dict.jobs.formLabel}
        pasos={pasosFormulario(dict)}
        dict={dict}
        separado
      >
        <JobsForm locale={locale} dict={dict} />
      </FormularioPorPasos>
    </main>
  );
}
