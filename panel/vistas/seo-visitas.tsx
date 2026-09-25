/**
 * BLOQUE 1: VISITAS (GoatCounter). Fase 22, 2026-09-25.
 *
 * Server Component. La llamada a GoatCounter vive SÓLO aquí, en el
 * servidor: el token (`GOATCOUNTER_TOKEN`, en el .env del servidor, fuera
 * del repositorio) nunca llega al navegador porque nunca sale de esta
 * función — no hay ninguna ruta pública que lo reenvíe.
 *
 * GoatCounter corre en 127.0.0.1:3400, en el propio servidor (ver
 * despliegue/analitica/README.md); su panel se cerró a internet el
 * 2026-09-22 y desde entonces sólo se mira por un túnel SSH, es decir, en
 * la práctica nunca. Esto le da un sitio donde se ve de verdad.
 */

const GOATCOUNTER = process.env.GOATCOUNTER_URL ?? "http://127.0.0.1:3400";
const DIAS_POR_DEFECTO = 30;

type Total = { count: number };
type Fila = { count: number; path?: string; title?: string; name?: string };

async function pedir<T>(ruta: string, token: string): Promise<T | null> {
  try {
    const desde = new Date(Date.now() - DIAS_POR_DEFECTO * 86_400_000).toISOString();
    const url = `${GOATCOUNTER}/api/v0${ruta}${ruta.includes("?") ? "&" : "?"}start=${desde}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function TablaSimple({ titulo, filas }: { titulo: string; filas: Fila[] }) {
  return (
    <div>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{titulo}</h3>
      {filas.length === 0 ? (
        <p style={{ fontSize: 13, opacity: 0.7 }}>Sin datos en este rango.</p>
      ) : (
        <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
          <tbody>
            {filas.slice(0, 8).map((f, i) => (
              <tr key={i} style={{ borderTop: "1px solid var(--theme-elevation-100)" }}>
                <td style={{ padding: "4px 8px 4px 0" }}>{f.path ?? f.title ?? f.name ?? "—"}</td>
                <td style={{ padding: "4px 0", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                  {f.count.toLocaleString("es-ES")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export async function SeoVisitas() {
  const token = process.env.GOATCOUNTER_TOKEN;

  if (!token) {
    return (
      <div style={{ padding: 16, background: "var(--theme-elevation-50)", borderRadius: 4 }}>
        <p style={{ fontSize: 14 }}>
          Sin <code>GOATCOUNTER_TOKEN</code> en el <code>.env</code> del servidor todavía. En cuanto se genere desde
          el panel de GoatCounter (túnel SSH + Ajustes → API) y se pegue ahí, este bloque se enciende solo — no hace
          falta tocar código.
        </p>
      </div>
    );
  }

  const [total, paginas, referentes, paises, sistemas] = await Promise.all([
    pedir<Total>("/stats/total", token),
    pedir<{ hits: Fila[] }>("/stats/hits", token),
    pedir<{ refs: Fila[] }>("/stats/refs", token),
    pedir<{ locations: Fila[] }>("/stats/locations", token),
    pedir<{ systems: Fila[] }>("/stats/systems", token),
  ]);

  if (total == null) {
    return (
      <div style={{ padding: 16, background: "var(--theme-elevation-50)", borderRadius: 4 }}>
        <p style={{ fontSize: 14 }}>
          No se ha podido hablar con GoatCounter en <code>{GOATCOUNTER}</code>. Comprueba que sigue arrancado (el
          vigilante del cron lo repone cada minuto) y que el token no ha caducado.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{total.count.toLocaleString("es-ES")}</p>
      <p style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>visitas en los últimos {DIAS_POR_DEFECTO} días</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
        <TablaSimple titulo="Páginas más vistas" filas={paginas?.hits ?? []} />
        <TablaSimple titulo="Referentes" filas={referentes?.refs ?? []} />
        <TablaSimple titulo="Países" filas={paises?.locations ?? []} />
        <TablaSimple titulo="Dispositivos (sistema)" filas={sistemas?.systems ?? []} />
      </div>
    </div>
  );
}
