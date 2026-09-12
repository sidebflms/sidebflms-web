import Script from "next/script";

/**
 * LA ANALÍTICA — GoatCounter, alojado en el propio servidor.
 *
 * ── POR QUÉ ESTA Y NO GOOGLE ANALYTICS ───────────────────────────────────
 * Porque **no pone cookies**. Y sin cookies no hace falta el cartel de
 * consentimiento, que es lo que de verdad estropea la medición: con Google no
 * se cuenta a nadie hasta que acepta, y la mayoría no acepta. Aquí se cuenta a
 * todo el mundo y no se guarda ningún dato personal: ni cookies, ni
 * identificadores por visitante, ni la IP.
 *
 * Y va en nuestro servidor, así que los datos no se van a un tercero.
 *
 * ── POR QUÉ NO ESTÁ SIEMPRE PUESTO ───────────────────────────────────────
 * Se activa sólo si existe `NEXT_PUBLIC_ANALITICA`. Sin esa variable no se
 * pinta nada, y es a propósito:
 *   · En local, medir el desarrollo ensucia las cifras de verdad.
 *   · Y mientras el subdominio no exista, el script daría un fallo de red en
 *     la consola de cada visita.
 *
 * Para encenderla, en `.env.production` del servidor:
 *   NEXT_PUBLIC_ANALITICA=https://analitica.sidebflms.com
 *
 * ── LO QUE HAY QUE SABER PARA TOCARLO ────────────────────────────────────
 * `data-goatcounter` apunta a `/count` (el sitio donde se apunta la visita) y
 * el `src` a `/count.js` (el script). Son dos rutas distintas del mismo
 * servicio: confundirlas es el error típico, y se manifiesta como una web que
 * no da error pero tampoco cuenta nada.
 *
 * `afterInteractive` y no `beforeInteractive`: la analítica jamás debe retrasar
 * la pintura de la página.
 */
export function Analitica() {
  const base = process.env.NEXT_PUBLIC_ANALITICA;
  if (!base) return null;

  const raiz = base.replace(/\/$/, "");

  return (
    <Script
      id="analitica"
      strategy="afterInteractive"
      data-goatcounter={`${raiz}/count`}
      src={`${raiz}/count.js`}
    />
  );
}
