import type { MetadataRoute } from "next";

import { traeProyectos } from "@/lib/contenido";
import { LOCALES, ROUTES, SITE_URL, type RouteKey } from "@/lib/routes";

// `jobs` es «trabaja con nosotros»: faltaba, y el pie enlaza a ella en los dos
// idiomas, así que estaba publicada pero no listada. (2026-09-22)
const STATIC_KEYS: RouteKey[] = [
  "home", "portfolio", "services", "about", "drone", "droneMadrid", "droneBarcelona",
  "faq", "jobs", "contact", "legal", "privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const key of STATIC_KEYS) {
    for (const locale of LOCALES) {
      const segment = ROUTES[key][locale];
      const url = `${SITE_URL}/${locale}${segment ? `/${segment}` : ""}`;
      entries.push({
        url,
        changeFrequency: key === "home" ? "weekly" : "monthly",
        priority: key === "home" ? 1 : 0.7,
      });
    }
  }

  for (const project of await traeProyectos()) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/${ROUTES.portfolio[locale]}/${project.slug}`,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  }

  return entries;
}
