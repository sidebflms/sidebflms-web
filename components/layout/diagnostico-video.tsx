"use client";

import { useEffect, useState } from "react";

/**
 * DIAGNÓSTICO DE VÍDEO — TEMPORAL (2026-09-17).
 *
 * El autoplay fallaba en teléfonos reales y no en el emulador. Con
 * `?diagvideo` en la dirección, un panel fijo enseña el estado de cada vídeo
 * visible (en marcha o parado, datos cargados, error) y el motivo con el que
 * el navegador rechazó cada `play()`. Sin el parámetro no hace nada.
 *
 * Borrar este fichero y su línea en app/[locale]/layout.tsx cuando el
 * autoplay esté confirmado en iPhone y Android.
 */

type Rechazo = { cuando: string; video: string; motivo: string };

const ACTIVO = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("diagvideo");
const rechazos: Rechazo[] = [];

const nombre = (v: HTMLVideoElement) => (v.currentSrc || v.querySelector("source")?.src || v.src || "—").split("/").pop() ?? "—";
const hora = () => new Date().toISOString().slice(17, 23);

// A nivel de módulo, y no en un efecto: los `play()` del hero y de las cintas
// salen de efectos que corren ANTES que los de este componente.
if (ACTIVO) {
  const original = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
    const promesa = original.call(this);
    promesa?.catch((e: unknown) => {
      const motivo = e instanceof DOMException ? `${e.name}: ${e.message}` : String(e);
      if (this instanceof HTMLVideoElement) rechazos.unshift({ cuando: hora(), video: nombre(this), motivo });
      rechazos.length = Math.min(rechazos.length, 12);
    });
    return promesa;
  };
}

const ESTADO = ["NADA", "METADATOS", "FRAME", "FUTURO", "SUFICIENTE"];
const RED = ["VACÍO", "QUIETO", "CARGANDO", "SIN FUENTE"];

export function DiagnosticoVideo() {
  const [filas, setFilas] = useState<string[]>([]);

  useEffect(() => {
    if (!ACTIVO) return;
    const id = window.setInterval(() => {
      const visibles = [...document.querySelectorAll("video")].filter((v) => {
        const r = v.getBoundingClientRect();
        return r.width > 0 && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
      });
      setFilas([
        `${navigator.userAgent.replace(/^Mozilla\/5\.0 /, "").slice(0, 90)}`,
        `pestaña ${document.hidden ? "OCULTA" : "visible"} · ${visibles.length} vídeos a la vista`,
        ...visibles.map(
          (v) =>
            `${v.paused ? "⏸" : "▶"} ${nombre(v)} · t=${v.currentTime.toFixed(1)} · ${ESTADO[v.readyState]} · ${RED[v.networkState]}` +
            ` · mudo=${v.muted ? "sí" : "NO"} · autoplay=${v.autoplay ? "sí" : "no"}${v.error ? ` · ERROR ${v.error.code}` : ""}`
        ),
        "— play() rechazados —",
        ...(rechazos.length ? rechazos.map((r) => `${r.cuando} ${r.video}: ${r.motivo}`) : ["ninguno"]),
      ]);
    }, 500);
    return () => window.clearInterval(id);
  }, []);

  if (!ACTIVO || filas.length === 0) return null;

  return (
    <pre className="fixed inset-x-2 bottom-2 z-[200] max-h-[45vh] overflow-auto rounded-xl bg-black/85 p-3 text-[10px] leading-snug whitespace-pre-wrap text-lime-300">
      {filas.join("\n")}
    </pre>
  );
}
