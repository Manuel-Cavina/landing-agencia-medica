import type { ReactNode } from "react";

/**
 * Botón primario reutilizable (docs/DESIGN_SYSTEM.md sección 7, "Botones").
 * Reproduce a propósito el mismo lenguaje visual que el CTA del navbar
 * (components/layout/site-header.tsx) para que ambos se sientan como el
 * mismo control en distintos lugares de la página. No se tocó el navbar
 * para que use este componente: esa es una refactorización aparte, fuera
 * del alcance de "implementar el hero".
 */
export function Button({
  href,
  children,
  icon,
  className = "",
}: {
  href: string;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={`inline-flex h-12 items-center gap-2 rounded-pill bg-brand-500 px-5 text-sm font-semibold text-text-on-brand transition-colors duration-fast ease-brand hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:bg-brand-900 ${className}`}
    >
      {children}
      {icon}
    </a>
  );
}
