/**
 * Deja INERTE todo lo que hay detrás de un diálogo modal (2026-10-01).
 *
 * `aria-modal="true"` NO bloquea nada por sí solo: con Tab el foco se escapaba
 * a la página de detrás, que ni se ve, y un lector de pantalla seguía leyéndola.
 * `inert` quita a la vez foco, clics y lectura. El navegador solo deja el foco
 * dentro del diálogo (y en su propia barra), que es lo que se quiere.
 *
 * Sube desde `activo` hasta `<body>` marcando como inertes a los hermanos de
 * cada nivel, para que valga igual si el diálogo es hijo directo del `<body>`
 * (el reel, que va en un portal) o va dentro de otro contenedor (el menú).
 *
 * Sólo se deshace lo que se marcó AQUÍ: la barra de arriba ya lleva su propio
 * `inert` cuando está escondida y no hay que quitárselo al cerrar.
 */
export function aislaFondo(activo: HTMLElement): () => void {
  const marcados: HTMLElement[] = [];
  let nodo: HTMLElement | null = activo;

  while (nodo && nodo !== document.body) {
    const padre: HTMLElement | null = nodo.parentElement;
    if (!padre) break;
    for (const hermano of Array.from(padre.children)) {
      if (!(hermano instanceof HTMLElement) || hermano === nodo || hermano.inert) continue;
      if (hermano.tagName === "SCRIPT" || hermano.tagName === "STYLE" || hermano.tagName === "LINK") continue;
      hermano.inert = true;
      marcados.push(hermano);
    }
    nodo = padre;
  }

  return () => {
    for (const el of marcados) el.inert = false;
  };
}
