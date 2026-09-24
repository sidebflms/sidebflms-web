"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * QUE LA «VISTA PREVIA EN VIVO» DEL PANEL SE REFRESQUE SOLA AL GUARDAR.
 *
 * `payload.config.ts` (`admin.livePreview`) enseña la página real dentro de
 * un `<iframe>` en `/admin`. Sin esto, ese iframe se queda con lo que había
 * la primera vez que se abrió.
 *
 * ── EL APRETÓN DE MANOS QUE HIZO FALTA ENCONTRAR ─────────────────────────
 * Payload no manda NADA por `postMessage` hasta que la propia página —esta
 * de aquí— le avisa de que está lista, con
 * `{ type: "payload-live-preview", ready: true }`. Sin ese primer mensaje,
 * `appIsReady` se queda en `false` para siempre y da igual lo que se
 * guarde: cero avisos, sin ningún error que lo delate. No está escrito en
 * ningún sitio a la vista: se encontró leyendo el propio código de
 * `@payloadcms/ui` (`providers/LivePreview/index.js`) tras comprobar con un
 * listener puesto a mano en el iframe que no llegaba nada.
 *
 * ── LA SEÑAL DE «SE HA GUARDADO»: `payload-document-event`, NO `updatedAt` ──
 * El primer intento comparaba el `updatedAt` que trae el mensaje
 * `payload-live-preview` —que Payload manda en cada tecla, con el
 * formulario entero dentro— para saber si de verdad se había guardado algo.
 * No fue fiable: en un Global, `updatedAt` se quedó con el mismo valor en
 * varios guardados seguidos —comprobado con un listener puesto a mano,
 * mensaje a mensaje—. El propio código de Payload manda un mensaje aparte
 * pensado exactamente para esto,`{ type: "payload-document-event" }`, con
 * el comentario «to support SSR… will fire router.refresh()» al lado.
 * Comprobado guardando de verdad, con el listener puesto: llega justo
 * después de cada guardado, en Proyectos y en un Global los dos.
 *
 * ── POR QUÉ ESTO NO ES LA «VISTA PREVIA REACTIVA» ────────────────────────
 * Ver un cambio letra a letra, ANTES de guardar, exigiría que los
 * componentes que pintan cada sección supieran recibir esos datos en vez de
 * los que ya trajo el servidor —convertir buena parte de la web a piezas de
 * cliente—. Eso no se ha hecho a propósito: es un proyecto mucho más
 * grande, y esto ya resuelve lo que pedía Mario el 2026-09-24: ver la
 * página real sin salir del panel, actualizada nada más guardar.
 *
 * ── POR QUÉ NO HACE NADA PARA UN VISITANTE NORMAL ───────────────────────
 * `window.self === window.top` es falso sólo dentro de un iframe. Fuera de
 * uno —cualquier visita real— ni siquiera se manda el saludo ni se registra
 * el listener.
 */
export function VistaPreviaPanel() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || window.self === window.top) return;

    const origenPadre = window.location.origin;

    function alRecibirMensaje(evento: MessageEvent) {
      if (evento.origin !== origenPadre) return;
      if ((evento.data as { type?: string } | null)?.type === "payload-document-event") {
        router.refresh();
      }
    }

    window.addEventListener("message", alRecibirMensaje);
    // El saludo: sin esto, Payload no manda nada (ver la nota de arriba).
    window.parent.postMessage({ type: "payload-live-preview", ready: true }, origenPadre);

    return () => window.removeEventListener("message", alRecibirMensaje);
  }, [router]);

  return null;
}
