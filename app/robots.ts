import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/routes";

/**
 * LO QUE NO SE RASTREA: el panel y sus rutas de servicio.
 *
 * Hoy da igual —la web entera está detrás de la contraseña de Apache, así
 * que ningún rastreador llega ni a esto—, pero el día que se quite el
 * `.htpasswd` (ver `despliegue/README.md`), `/admin` y compañía quedarían
 * indexables si no estuvieran aquí. No tienen valor de búsqueda —nadie
 * busca el panel de contenido de una productora— y son superficie que no
 * hace falta anunciar.
 *
 *   /admin      el panel (`app/(payload)/admin`)
 *   /api        la API de Payload, REST y GraphQL (`app/(payload)/api`),
 *               EXCEPTO `/api/media/`, que sirve las fotos y vídeos públicos
 *   /admin-*    las rutas de servicio de un solo uso: admin-carga,
 *               admin-volcado, admin-migra-material — y cualquier otra que
 *               se añada con ese mismo prefijo, sin tener que acordarse de
 *               volver aquí cada vez.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // `/api/media/` SÍ se rastrea (2026-10-01): de ahí cuelgan TODAS las fotos y
      // los vídeos de la web (`/api/media/file/...`). Con `/api` bloqueado entero,
      // Google no podía pedir ninguna imagen ni póster: ni Google Imágenes, ni
      // miniaturas de vídeo, ni pintar bien las páginas. Gana la regla más
      // específica (la más larga), así que el resto de `/api` sigue cerrado.
      allow: ["/", "/api/media/"],
      disallow: ["/admin", "/api", "/admin-*"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
