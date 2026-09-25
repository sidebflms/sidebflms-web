import { SITE_URL } from "@/lib/routes";

/**
 * RFC 9116. No hay una dirección de seguridad dedicada —somos once
 * personas, no un equipo de seguridad—, así que usa el único contacto real
 * de la empresa (`lib/correo.ts`). `Expires` a un año: RFC 9116 lo pide
 * para forzar una revisión, no porque el contenido vaya a cambiar antes.
 */
export function GET() {
  const cuerpo = `Contact: mailto:contact@sidebflms.com
Expires: 2027-09-25T00:00:00.000Z
Preferred-Languages: es, en
Canonical: ${SITE_URL}/.well-known/security.txt
`;

  return new Response(cuerpo, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
