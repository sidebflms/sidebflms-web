import { REDES, type RedKey } from "@/components/layout/social-icons";
import type { Dictionary } from "@/lib/dictionaries";
import { SITE_URL, type Locale } from "@/lib/routes";

/**
 * PIEZAS DE APOYO DE «CONTACTO» (y de «Trabaja con nosotros», que copia su
 * estructura): los datos directos, el JSON-LD de las preguntas, la tarjeta de
 * la mesa y el salto a un ancla con Lenis. Todo sale del diccionario y de
 * `REDES`; aquí no se escribe ningún texto.
 */

/**
 * Las redes con el nombre que da el DICCIONARIO (`dict.contact.instagram`…),
 * no el de `REDES`: la página actual pinta el del diccionario y así se queda.
 * Las URLs sí vienen de `REDES`, que es la única lista de URLs del sitio.
 */
export function redesContacto(dict: Dictionary): { key: RedKey; nombre: string; href: string }[] {
  return REDES.map((red) => ({ key: red.key, nombre: dict.contact[red.key], href: red.href }));
}

/**
 * El mismo JSON-LD que genera `components/sections/faq.tsx`. Las versiones que
 * pintan las preguntas con otra maqueta no usan ese componente, y sin esto
 * perderían el marcado `FAQPage` respecto a la página actual.
 */
export function FaqJsonLd({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/${locale}/contact`,
    mainEntity: dict.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Generado a partir del diccionario del propio sitio: no hay entrada de
      // usuario por medio.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

/**
 * La tarjeta clicable de la mesa (email, redes, puertas a otra sección).
 * Compartida por «Contacto» y «Trabaja con nosotros» para que las dos mesas
 * respondan igual al pasar: suben 4 px con la curva del sitio.
 */
export const TARJETA_MESA =
  "glass group relative flex flex-col justify-between overflow-hidden rounded-[var(--radius-frame)] p-6 transition-[translate] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust-300 lg:p-7";

/**
 * Lleva a un ancla con Lenis si está montado (si no, el salto nativo se
 * quedaría a medias: Lenis corrige la posición en el siguiente frame y el
 * scroll «rebota»). Con movimiento reducido Lenis no existe y se usa el nativo.
 */
export function irAAncla(id: string) {
  const destino = document.getElementById(id);
  if (!destino) return;
  if (window.__lenis) window.__lenis.scrollTo(destino, { offset: -96, duration: 1.1 });
  else destino.scrollIntoView({ block: "start" });
}
