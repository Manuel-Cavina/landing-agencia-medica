import type { ReactNode } from "react";

/**
 * Envoltorio de ancho máximo centrado, reutilizable por cualquier sección
 * de la landing (no solo el navbar). Existe para no repetir en cada
 * sección la misma combinación de max-width + padding lateral responsive
 * que define docs/DESIGN_SYSTEM.md (ancho máx. 1280px, padding lateral
 * clamp(32px, 5vw, 80px) en desktop, 16-20px en móvil).
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
