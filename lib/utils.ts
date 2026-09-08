/**
 * Concatena clases descartando falsy. El proyecto no usa `tailwind-merge`: las
 * clases se componen desde arriba y no hay conflictos que resolver en runtime.
 */
export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/** `01`, `02`… para la numeración en mono de secciones y servicios. */
export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/**
 * Formatea segundos como timecode de montaje `HH:MM:SS:FF` a 25 fps.
 * Se usa en el hero y en la regleta: es la referencia directa a DaVinci.
 */
export function timecode(seconds: number, fps = 25): string {
  const safe = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = Math.floor(safe % 60);
  const f = Math.floor((safe % 1) * fps);
  return [h, m, s, f].map((n) => n.toString().padStart(2, "0")).join(":");
}
