import type { MetadataRoute } from "next";

import { PROJECTS } from "@/content/projects";
import { LOCALES, ROUTES, SITE_URL, type RouteKey } from "@/lib/routes";

const STATIC_KEYS: RouteKey[] = ["home", "portfolio", "services", "about", "faq", "drone", "contact", "legal", "privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
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

  for (const project of PROJECTS) {
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
