import path from "node:path";
import type { NextConfig } from "next";

/**
 * VERSIÓN DE PRUEBAS BAJO UNA RUTA (2026-09-16). Vacío en local y en la web
 * normal. Lo fija `despliegue/publicar-glass.sh` al compilar la rama `glass`
 * para servirla en `sidebflms.com/prueba-glass-…`. Ver lib/base.ts.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  basePath: BASE_PATH,

  /**
   * Este proyecto vive dentro de la carpeta de `jota-hq`, que tiene su propio
   * `package-lock.json`. Sin fijar la raíz, Turbopack infiere la del padre.
   * `WEB SIDEB` es un repo aparte: su git, su lockfile y su toolchain son
   * independientes.
   */
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },

  /**
   * AVIF antes que WebP en las imágenes que pasan por `next/image`.
   *
   * Pesa alrededor de un 20 % menos que WebP a igual calidad. Next negocia
   * con el navegador: quien no entienda AVIF recibe WebP, y quien no entienda
   * ninguno de los dos recibe el original. No hay nada que mantener.
   *
   * Ojo: esto NO afecta a los pósters de los vídeos. El atributo `poster` de
   * `<video>` es una URL a pelo y no pasa por el optimizador, por eso esos se
   * generan a mano en WebP con `scripts/cinta-web.sh`.
   */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /**
   * CACHÉ DEL MATERIAL.
   *
   * `public/` se sirve por defecto con `max-age=0`: cada visita vuelve a
   * preguntar por cada fichero. Con veintiún vídeos y sus pósters en la
   * portada, eso son cuarenta y pico viajes de ida y vuelta que además hoy
   * pasan por PHP (ver la nota de abajo).
   *
   * Treinta días, y NO `immutable` a propósito: estos ficheros se
   * reemplazan de vez en cuando —el 2026-09-15 se les añadió el audio a seis
   * piezas— y con `immutable` un navegador que ya los tuviera seguiría
   * sirviendo el viejo durante un año sin manera de avisarle. Con esto, una
   * recarga forzada basta.
   *
   * ── ESTO ES UN PARCHE MIENTRAS LA WEB TENGA CONTRASEÑA ──────────────────
   * Cuando se quite el `.htpasswd`, `despliegue/publicar.sh` deja `public/` y
   * `.next/static` en disco y los sirve nginx directamente, con `expires max`
   * y sin despertar ni a PHP ni a Node. Eso es MUCHO más rápido que esto, y
   * es lo que de verdad arregla la lentitud de la primera carga.
   */
  /**
   * La raíz de la ruta de pruebas (`/prueba-glass-…` a secas) no la recoge el
   * proxy de idioma, que sólo ve rutas con algo detrás: se manda a mano.
   */
  async redirects() {
    return BASE_PATH ? [{ source: "/", destination: "/es", permanent: false }] : [];
  },

  async headers() {
    return [
      // La versión de pruebas no debe acabar en Google: no está enlazada desde
      // ningún sitio, pero un enlace compartido basta para que la rastreen.
      ...(BASE_PATH
        ? [{ source: "/:ruta*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }]
        : []),
      {
        source: "/media/:ruta*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
      },
      {
        source: "/fonts/:ruta*",
        headers: [
          // La tipografía sí es inmutable: si cambia, cambia el nombre.
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
