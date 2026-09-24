import path from "node:path";
import { withPayload } from "@payloadcms/next/withPayload";
import type { NextConfig } from "next";

/**
 * VERSIÓN DE PRUEBAS BAJO UNA RUTA (2026-09-16). Vacío en local y en la web
 * normal. Lo fija `despliegue/publicar-glass.sh` al compilar la rama `glass`
 * para servirla en `sidebflms.com/prueba-glass-…`. Ver lib/base.ts.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

/**
 * EL ORIGEN DE LA ANALÍTICA, si está encendida (ver components/layout/analitica.tsx).
 * Hace falta aquí para dejarla pasar en la política de contenido.
 */
const ANALITICA = (process.env.NEXT_PUBLIC_ANALITICA || "").replace(/\/$/, "");

/**
 * CABECERAS DE SEGURIDAD. La web no mandaba ninguna (comprobado el 2026-09-22).
 *
 * ── QUÉ HACE LA POLÍTICA DE CONTENIDO Y QUÉ NO ──────────────────────────
 * Lleva `'unsafe-inline'` en los scripts, y eso hay que decirlo claro: NO
 * protege de un script inyectado en línea. Es a propósito. Next reparte el
 * contenido de cada página en `<script>` sueltos dentro del HTML, así que la
 * única manera de prohibir lo de dentro es firmar cada uno con un número de un
 * solo uso; y para generarlo hay que mirar la petición, lo que convierte las
 * 69 páginas estáticas en páginas que se montan una a una en cada visita. En
 * una web que va detrás de un proxy PHP, eso se paga en cada carga.
 *
 * Lo que sí impide, que no es poco: cargar scripts de OTRO sitio, meter la web
 * en un iframe de OTRO dominio, mandar los formularios a otro dominio, cambiar
 * la base de las URL relativas y cargar objetos incrustados.
 *
 * ── `frame-ancestors 'self'` Y NO `'none'` (2026-09-24) ─────────────────
 * Hasta la Fase 3 del panel era `'none'`: nadie podía meter la web en un
 * iframe, ni de fuera ni de dentro. La vista previa en vivo del panel
 * (`payload.config.ts`, `admin.livePreview`) necesita precisamente eso: un
 * `<iframe>` en `/admin` que enseña la página real. `'self'` sigue
 * cerrando la puerta a cualquier sitio AJENO —el riesgo de verdad, el
 * clickjacking— y sólo abre el propio dominio consigo mismo.
 *
 * Si algún día hay cuentas de usuario o algo que perder, toca dar el paso al
 * número de un solo uso y asumir el coste.
 */
function cabecerasDeSeguridad() {
  const deFuera = [ANALITICA].filter(Boolean).join(" ");
  // EN DESARROLLO HACE FALTA `unsafe-eval`. React lo usa en ese modo para
  // reconstruir las pilas de error, y Next para recargar en caliente: sin
  // esto, `next dev` se queda en blanco con un error de consola. En lo que se
  // publica NO se añade: React no usa `eval` en producción.
  const enDesarrollo = process.env.NODE_ENV === "development";
  const politica = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${enDesarrollo ? "'unsafe-eval' " : ""}${deFuera}`.trim(),
    // Los estilos en línea los pone React en los atributos `style`.
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: ${deFuera}`.trim(),
    "media-src 'self'",
    "font-src 'self' data:",
    // `ws:` sólo en desarrollo: es por donde Next recarga en caliente.
    `connect-src 'self' ${enDesarrollo ? "ws: " : ""}${deFuera}`.trim(),
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: politica },
    // Un año. SIN `includeSubDomains` a propósito: hay subdominios de la casa
    // (app, flightops, analitica) que no gestiona este repo, y prometer por
    // ellos es prometer lo que uno no controla.
    { key: "Strict-Transport-Security", value: "max-age=31536000" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // Nada de esto lo usa la web; se apaga para que tampoco lo use nadie más.
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    // Por los navegadores que aún no miran `frame-ancestors`. `SAMEORIGIN`
    // es su equivalente de `'self'`: sólo el propio dominio.
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
  ];
}

const nextConfig: NextConfig = {
  // Dónde deja `next build` el resultado. En el servidor se compila en una
  // carpeta aparte (`.next-nueva`) mientras la web sigue sirviendo desde
  // `.next`, y se intercambian al reiniciar: ver despliegue/publicar.sh.
  // Al ARRANCAR nunca se define, así que `next start` lee `.next` como siempre.
  distDir: process.env.SIDEB_CARPETA_COMPILACION ?? ".next",
  basePath: BASE_PATH,

  /** Ni versión ni nombre del servidor: no se regala inventario. */
  poweredByHeader: false,

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
  // Las direcciones viejas de la página de drone (/es/drone, /en/drone) NO se
  // redirigen aquí: `permanent: true` de Next siempre manda 308, no 301, y
  // aquí hacía falta el 301 de verdad (SEO Fase 2, 2026-09-24). Se hace en
  // `proxy.ts`, que sí deja fijar el código exacto. Ver la nota de `drone`
  // en `lib/routes.ts`.
  async redirects() {
    return BASE_PATH ? [{ source: "/", destination: "/es", permanent: false }] : [];
  },

  /**
   * SEO Fase 2 (2026-09-24): sirve las direcciones nuevas de la página de
   * drone desde la única carpeta que existe (`app/[locale]/drone/`), sin
   * que la URL del navegador cambie — un rewrite, no un redirect—. La
   * decisión completa y por qué no se duplica la carpeta, en la nota de
   * `drone` en `lib/routes.ts`.
   */
  async rewrites() {
    return [
      { source: "/es/grabacion-con-drone", destination: "/es/drone" },
      { source: "/en/drone-filming", destination: "/en/drone" },
    ];
  },

  async headers() {
    return [
      { source: "/:ruta*", headers: cabecerasDeSeguridad() },
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

/* PRUEBA DE CONCEPTO (Fase 0): `withPayload` añade lo que el panel necesita
   del lado del compilador. No cambia nada de la web pública. */
export default withPayload(nextConfig);
