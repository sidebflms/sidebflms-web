"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Pagina } from "./seo-datos";

/**
 * BLOQUE 3: LA TABLA POR PÁGINA. Fase 22, 2026-09-25.
 *
 * Cliente sólo para poder ordenar al clicar una columna — es una
 * interacción sobre datos que ya llegaron del servidor, no una edición.
 * `enlaces` trae, por ruta, el enlace de edición cuando existe (fichas de
 * trabajo) o el fichero de origen cuando no (todo lo demás): esa decisión
 * la toma `seo-view.tsx` en el servidor, con acceso a Payload; aquí sólo se
 * pinta.
 */

type Columna = "ruta" | "palabras" | "titulo" | "descripcion" | "h1" | "problemas";

export type Enlace = { tipo: "editar"; href: string } | { tipo: "fichero"; ruta: string };

export function SeoTablaPaginas({ paginas, enlaces }: { paginas: Pagina[]; enlaces: Record<string, Enlace> }) {
  const [orden, setOrden] = useState<{ col: Columna; asc: boolean }>({ col: "problemas", asc: false });
  const [soloConProblemas, setSoloConProblemas] = useState(true);

  const filas = useMemo(() => {
    const base = soloConProblemas ? paginas.filter((p) => p.problemas.length > 0) : paginas;
    const valor = (p: Pagina): string | number => {
      switch (orden.col) {
        case "ruta":
          return p.ruta;
        case "palabras":
          return p.palabras;
        case "titulo":
          return p.titulo.longitud;
        case "descripcion":
          return p.descripcion.longitud;
        case "h1":
          return p.h1.cantidad;
        case "problemas":
          return p.problemas.length;
      }
    };
    return [...base].sort((a, b) => {
      const va = valor(a);
      const vb = valor(b);
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return orden.asc ? cmp : -cmp;
    });
  }, [paginas, orden, soloConProblemas]);

  const cambiarOrden = (col: Columna) =>
    setOrden((o) => (o.col === col ? { col, asc: !o.asc } : { col, asc: true }));

  const cabecera = (col: Columna, etiqueta: string) => (
    <th
      onClick={() => cambiarOrden(col)}
      style={{ cursor: "pointer", textAlign: "left", padding: "6px 10px", whiteSpace: "nowrap", userSelect: "none" }}
    >
      {etiqueta}
      {orden.col === col ? (orden.asc ? " ▲" : " ▼") : ""}
    </th>
  );

  return (
    <div>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, marginBottom: 10 }}>
        <input type="checkbox" checked={soloConProblemas} onChange={(e) => setSoloConProblemas(e.target.checked)} />
        Enseñar sólo páginas con algún problema ({paginas.filter((p) => p.problemas.length > 0).length} de{" "}
        {paginas.length})
      </label>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid var(--theme-elevation-150)" }}>
              {cabecera("ruta", "Página")}
              {cabecera("palabras", "Palabras")}
              {cabecera("titulo", "Título")}
              {cabecera("descripcion", "Meta desc.")}
              {cabecera("h1", "H1")}
              {cabecera("problemas", "Problemas")}
              <th style={{ textAlign: "left", padding: "6px 10px" }}>Arreglar en</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((p) => {
              const enlace = enlaces[p.ruta];
              return (
                <tr key={p.ruta} style={{ borderTop: "1px solid var(--theme-elevation-100)" }}>
                  <td style={{ padding: "6px 10px", fontFamily: "monospace", fontSize: 12 }}>{p.ruta}</td>
                  <td style={{ padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {p.status === 200 ? p.palabras : "—"}
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {p.status === 200 ? p.titulo.longitud : "—"}
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                    {p.status === 200 ? p.descripcion.longitud : "—"}
                  </td>
                  <td style={{ padding: "6px 10px", textAlign: "center" }}>
                    {p.status === 200 ? p.h1.cantidad : "—"}
                  </td>
                  <td style={{ padding: "6px 10px" }}>
                    {p.problemas.length === 0 ? (
                      <span style={{ opacity: 0.5 }}>—</span>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {p.problemas.map((prob) => (
                          <li key={prob}>{prob}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>
                    {!enlace ? (
                      <span style={{ opacity: 0.5 }}>—</span>
                    ) : enlace.tipo === "editar" ? (
                      <Link href={enlace.href}>Editar ficha</Link>
                    ) : (
                      <code style={{ fontSize: 11 }}>{enlace.ruta}</code>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
