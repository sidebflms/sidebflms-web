/* PRUEBA DE CONCEPTO (Fase 0). El armazón del panel de Payload.
   Va en su propio grupo de rutas `(payload)` para no heredar nada de
   `app/[locale]/layout.tsx`: el panel no lleva ni cabecera, ni regleta, ni
   cursor, ni los efectos de la web. */
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import config from "@payload-config";

import { importMap } from "./admin/importMap.js";

import "@payloadcms/next/css";

type Args = { children: React.ReactNode };

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function PanelLayout({ children }: Args) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
