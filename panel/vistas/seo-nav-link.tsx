import Link from "next/link";

/**
 * EL ENLACE DEL MENÚ LATERAL A "SEO y estadísticas" (Fase 22, 2026-09-25).
 * Registrado en `payload.config.ts` bajo `admin.components.afterNavLinks`,
 * junto a las colecciones, no dentro de ninguna de ellas.
 */
export function SeoNavLink() {
  return (
    <Link href="/admin/seo" className="nav__link" style={{ display: "flex", alignItems: "center", gap: 8 }}>
      SEO y estadísticas
    </Link>
  );
}
