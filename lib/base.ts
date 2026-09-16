/**
 * LA WEB BAJO UNA RUTA (versión de pruebas, 2026-09-16).
 *
 * La versión glass se publica dentro del dominio de la web original, en una
 * ruta secreta (`sidebflms.com/prueba-glass-…`), con `basePath` de Next
 * (next.config.ts). Next antepone esa ruta a los enlaces, a `_next/` y al
 * optimizador de imágenes, pero NO a las rutas escritas a mano hacia `public/`
 * («/media/…», «/logo/…») que usan `<video>`, `<img>` y el `src` de
 * `next/image`. Sin prefijo, esas peticiones irían a la web original.
 *
 * `NEXT_PUBLIC_BASE_PATH` se fija al compilar (despliegue/publicar-glass.sh);
 * en local y en la web normal está vacío y todo esto no hace nada.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const PREFIJOS_PUBLICOS = ["/media/", "/logo/"];

/**
 * Antepone la ruta base a cualquier cadena que apunte a `public/`, recorriendo
 * objetos y listas. Se aplica una vez a los datos (proyectos, equipo, fotos de
 * etapa) en vez de en cada componente que los pinta.
 */
export function conBase<T>(valor: T): T {
  if (!BASE_PATH) return valor;
  if (typeof valor === "string") {
    return (PREFIJOS_PUBLICOS.some((p) => valor.startsWith(p)) ? BASE_PATH + valor : valor) as T;
  }
  if (Array.isArray(valor)) return valor.map((v) => conBase(v)) as T;
  if (valor && typeof valor === "object") {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, conBase(v)])) as T;
  }
  return valor;
}
