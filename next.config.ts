import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Este proyecto vive dentro de la carpeta de `jota-hq`, que tiene su propio
   * `package-lock.json`. Sin fijar la raíz, Turbopack infiere la del padre.
   * `WEB SIDEB` es un repo aparte: su git, su lockfile y su toolchain son
   * independientes.
   */
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
