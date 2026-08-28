import type { NextConfig } from "next";

/**
 * distDir configurable por variable de entorno.
 *
 * Motivo concreto: `next dev` y `next build` escriben en el MISMO
 * directorio .next por defecto. Correr un build de verificación con el
 * servidor de desarrollo levantado le pisa sus artefactos, le mata el
 * watcher y el navegador se queda sirviendo CSS y JS viejos bajo nombres
 * de archivo que no cambiaron -- se ve como "el cambio no se aplicó"
 * cuando en realidad el código estaba bien. Pasó en este proyecto.
 *
 * Con esto, un build de verificación puede correr aislado:
 *
 *   NEXT_DIST_DIR=.next-build npm run build
 *
 * Sin la variable el comportamiento es exactamente el de siempre
 * (.next), así que ni el deploy ni `npm run dev` cambian.
 */
const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
};

export default nextConfig;
