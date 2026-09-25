"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Pagina } from "./seo-datos";

/**
 * BLOQUE 3: LA TABLA POR PÁGINA. Fase 22, 2026-09-25.
 * Botón "Volver a medir esta página", 2026-09-26.
 *
 * Cliente por dos motivos, los dos sobre datos que ya llegaron o vuelven del
 * servidor, nunca una edición de contenido: poder ordenar al clicar una
 * columna, y poder pedir que se vuelva a medir una fila sin recargar toda la
 * vista. `enlaces` trae, por ruta, el enlace de edición cuando existe
 * (fichas de trabajo) o el fichero de origen cuando no (todo lo demás): esa
 * decisión la toma `seo-view.tsx` en el servidor, con acceso a Payload; aquí
 * sólo se pinta.
 */

type Columna = "ruta" | "palabras" | "titulo" | "descripcion" | "h1" | "problemas";

export type Enlace = { tipo: "editar"; href: string } | { tipo: "fichero"; ruta: string };

const hora = (iso: string) => new Date(iso).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

export function SeoTablaPaginas({
  paginas: paginasIniciales,
  enlaces,
  fechaBarrido,
}: {
  paginas: Pagina[];
  enlaces: Record<string, Enlace>;
  /** La fecha del barrido nocturno que trae el resto de las filas, para poder decir «de cuándo» sin `medida` propia. */
  fechaBarrido: string | undefined;
}) {
  const [paginas, setPaginas] = useState(paginasIniciales);
  const [orden, setOrden] = useState<{ col: Columna; asc: boolean }>({ col: "problemas", asc: false });
  const [soloConProblemas, setSoloConProblemas] = useState(true);
  const [midiendo, setMidiendo] = useState<Record<string, boolean>>({});
  const [errorFila, setErrorFila] = useState<Record<string, string>>({});

  const volverAMedir = async (ruta: string) => {
    setMidiendo((m) => ({ ...m, [ruta]: true }));
    setErrorFila((e) => ({ ...e, [ruta]: "" }));
    try {
      const res = await fetch("/admin-seo-medir-pagina", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruta }),
      });
      if (!res.ok) {
        const cuerpo = await res.json().catch(() => null);
        throw new Error(cuerpo?.error ?? `HTTP ${res.status}`);
      }
      const fila = (await res.json()) as Pagina;
      setPaginas((ps) => ps.map((p) => (p.ruta === ruta ? fila : p)));
    } catch (e) {
      setErrorFila((er) => ({ ...er, [ruta]: e instanceof Error ? e.message : "Error al medir" }));
    } finally {
      setMidiendo((m) => ({ ...m, [ruta]: false }));
    }
  };

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
              <th style={{ textAlign: "left", padding: "6px 10px", whiteSpace: "nowrap" }}>Medido</th>
              <th style={{ textAlign: "left", padding: "6px 10px" }}>Arreglar en</th>
              <th style={{ padding: "6px 10px" }} />
            </tr>
          </thead>
          <tbody>
            {filas.map((p) => {
              const enlace = enlaces[p.ruta];
              const fechaFila = p.medida ?? fechaBarrido;
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
                    {/* «medida» propia = se pidió a mano, distinto del resto de la tabla. Sin ella, es la
                        misma fecha del barrido nocturno que ya dice el bloque de arriba. */}
                    {p.medida ? (
                      <span style={{ color: "var(--theme-success-500)" }} title={new Date(p.medida).toLocaleString("es-ES")}>
                        {hora(p.medida)}, a mano
                      </span>
                    ) : fechaFila ? (
                      <span style={{ opacity: 0.6 }} title={new Date(fechaFila).toLocaleString("es-ES")}>
                        {hora(fechaFila)}, del barrido
                      </span>
                    ) : (
                      <span style={{ opacity: 0.5 }}>—</span>
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
                  <td style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>
                    <button
                      type="button"
                      onClick={() => volverAMedir(p.ruta)}
                      disabled={!!midiendo[p.ruta]}
                      style={{
                        fontSize: 12,
                        padding: "4px 10px",
                        borderRadius: 999,
                        border: "1px solid var(--theme-elevation-150)",
                        background: "transparent",
                        color: "inherit",
                        cursor: midiendo[p.ruta] ? "wait" : "pointer",
                        opacity: midiendo[p.ruta] ? 0.6 : 1,
                      }}
                    >
                      {midiendo[p.ruta] ? "Midiendo…" : "Volver a medir esta página"}
                    </button>
                    {errorFila[p.ruta] && (
                      <p style={{ color: "var(--theme-error-500)", fontSize: 11, marginTop: 4 }}>
                        {errorFila[p.ruta]}
                      </p>
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
