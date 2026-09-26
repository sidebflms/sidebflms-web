import { Logout } from "@payloadcms/ui";
import { DefaultNavClient, NavHamburger, NavWrapper } from "@payloadcms/next/client";
import { EntityType, groupNavItems } from "@payloadcms/ui/shared";
import type { ServerProps } from "payload";

import { SeoNavLink } from "./seo-nav-link";

/**
 * MENÚ LATERAL PROPIO (2026-09-26). Payload coloca los grupos por orden de
 * aparición —colecciones primero, globals después—, sin opción para
 * cambiarlo; con eso «Portada» (sólo globals) salía la última. Esto es
 * `DefaultNav` de `@payloadcms/next` con una única diferencia: los grupos se
 * ordenan según `ORDEN_GRUPOS` antes de pintarlos. Se pinta con el mismo
 * `DefaultNavClient` y las mismas clases, así que se ve igual que el de
 * Payload. Lo que NO replica, porque aquí no se usa: `beforeNav`/`afterNav`,
 * el menú de ajustes y guardar qué grupos se han plegado.
 *
 * Un grupo que no esté en la lista (uno nuevo en `panel/colecciones.ts`) sale
 * al final, no desaparece.
 */
const ORDEN_GRUPOS = ["Portada", "Trabajo", "Drone", "Nosotros y servicios", "Panel"];

export function NavPropio(props: ServerProps) {
  const { i18n, payload, permissions, visibleEntities } = props;
  if (!payload?.config || !visibleEntities || !permissions) return null;
  const { collections, globals } = payload.config;

  const grupos = groupNavItems(
    [
      ...collections
        .filter(({ slug }) => visibleEntities.collections.includes(slug))
        .map((entity) => ({ type: EntityType.collection as const, entity })),
      ...globals
        .filter(({ slug }) => visibleEntities.globals.includes(slug))
        .map((entity) => ({ type: EntityType.global as const, entity })),
    ],
    permissions,
    i18n
  );

  const puesto = (g: { label: unknown }) => {
    const i = ORDEN_GRUPOS.indexOf(String(g.label));
    return i === -1 ? ORDEN_GRUPOS.length : i;
  };
  const ordenados = [...grupos].sort((a, b) => puesto(a) - puesto(b));

  return (
    <NavWrapper baseClass="nav">
      <nav className="nav__wrap">
        <DefaultNavClient groups={ordenados} navPreferences={{ groups: {}, open: true }} />
        <SeoNavLink />
        <div className="nav__controls">
          <Logout />
        </div>
      </nav>
      <div className="nav__header">
        <div className="nav__header-content">
          <NavHamburger baseClass="nav" />
        </div>
      </div>
    </NavWrapper>
  );
}
