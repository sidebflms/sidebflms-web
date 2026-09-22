import type { Metadata } from "next";
import Link from "next/link";

import { getDictionary } from "@/lib/dictionaries";
import { DEFAULT_LOCALE, path } from "@/lib/routes";

/**
 * EL 404 DE LAS DIRECCIONES QUE NO CUADRAN CON NINGUNA RUTA.
 *
 * `app/[locale]/not-found.tsx` sólo entra cuando una página que SÍ existe pide
 * un 404 —una ficha de proyecto que no está, por ejemplo—. Una dirección
 * inventada como `/es/cualquier-cosa` no llega a casar con ninguna ruta, así
 * que caía en el 404 de fábrica de Next: fondo blanco, «This page could not be
 * found» en inglés y un `<html>` sin idioma. (2026-09-22)
 *
 * ── POR QUÉ LLEVA `<html>` Y `<body>` PROPIOS ───────────────────────────
 * Porque en este proyecto el layout raíz es `app/[locale]/layout.tsx`, y a esta
 * página no le corresponde ninguno: si no los pone ella, no los pone nadie.
 * Por lo mismo va sin cabecera, sin pie y sin los efectos de la web: no hay
 * idioma que elegir ni menú que enseñar cuando la dirección no existe.
 */
export const metadata: Metadata = {
  title: "404 — SIDEBFLMS",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const dict = await getDictionary(DEFAULT_LOCALE);

  return (
    <html lang={DEFAULT_LOCALE}>
      <body
        style={{
          minHeight: "100dvh",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "0 1.5rem",
          textAlign: "center",
          background: "#1e1e1e",
          color: "#f2ece4",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p style={{ letterSpacing: "0.14em", fontSize: "0.75rem", color: "#ff6a3d" }}>404</p>
        <h1 style={{ margin: 0, fontSize: "clamp(1.75rem, 6vw, 3rem)", lineHeight: 1.05 }}>
          {dict.common.notFoundTitle.join(" ")}
        </h1>
        <p style={{ margin: 0, color: "#8f8a85" }}>{dict.common.notFoundBody}</p>
        <Link
          href={path(DEFAULT_LOCALE, "home")}
          style={{
            marginTop: "1.5rem",
            border: "1px solid #333130",
            borderRadius: "999px",
            padding: "0.75rem 1.5rem",
            color: "#f2ece4",
            textDecoration: "none",
            fontSize: "0.8rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {dict.common.backHome}
        </Link>
      </body>
    </html>
  );
}
