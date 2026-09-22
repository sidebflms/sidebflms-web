/* PRUEBA DE CONCEPTO (Fase 0). Una página de la WEB que lee lo que hay en el
   panel, que es lo que harían de verdad las fichas de proyecto en la Fase 1.
   No usa la API por HTTP: habla con la base de datos desde el propio servidor
   de la web, que es más rápido y no expone nada. */
import { getPayload } from "payload";
import config from "@payload-config";

export const dynamic = "force-dynamic";

export default async function PruebaPanel() {
  const payload = await getPayload({ config });

  const [es, en] = await Promise.all([
    payload.find({ collection: "piezas-de-prueba", locale: "es", limit: 5 }),
    payload.find({ collection: "piezas-de-prueba", locale: "en", limit: 5 }),
  ]);

  return (
    <html lang="es">
      <body style={{ fontFamily: "system-ui", padding: "2rem", background: "#1e1e1e", color: "#f2ece4" }}>
        <h1>Prueba del panel</h1>
        <p>Piezas guardadas: {es.totalDocs}</p>
        {es.docs.map((d, i) => (
          <div key={d.id} style={{ borderTop: "1px solid #333", paddingTop: "1rem", marginTop: "1rem" }}>
            <p><strong>ES:</strong> {d.titulo} — {d.resumen}</p>
            <p><strong>EN:</strong> {en.docs[i]?.titulo} — {en.docs[i]?.resumen}</p>
            <p><strong>Destacado:</strong> {d.destacado ? "sí" : "no"} · <strong>Fecha:</strong> {String(d.fecha).slice(0, 10)}</p>
          </div>
        ))}
      </body>
    </html>
  );
}
