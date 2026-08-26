"use client";

/**
 * Envoltorio chico para la entrada progresiva del hero (opacidad + un
 * desplazamiento vertical corto). Es el único punto del hero que necesita
 * "use client": el resto de components/sections/hero.tsx sigue siendo
 * Server Component, y le pasa su contenido ya renderizado como children.
 *
 * Los tiempos y el easing replican --duration-slow / --ease-brand de
 * app/globals.css (docs/DESIGN_SYSTEM.md sección 9, "Motion").
 */

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

const DURATION_SECONDS = 0.8; // 800ms, dentro del rango 650-1000ms pedido
const Y_OFFSET_PX = 16; // dentro del rango 12-24px pedido
const EASE_BRAND = [0.22, 0.76, 0.24, 1] as const;

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  /**
   * Clases para el propio wrapper (ej: "w-full self-stretch" cuando el
   * contenido necesita ocupar todo el ancho disponible). El contenedor
   * flex del hero usa items-center, así que sin esto un hijo con w-full
   * termina midiendo su propio contenido en lugar del ancho real
   * disponible: el wrapper que lo envuelve nunca se estira solo.
   */
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  // Con movimiento reducido: todo visible de inmediato, sin desplazarse.
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: Y_OFFSET_PX }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION_SECONDS, delay, ease: EASE_BRAND }}
    >
      {children}
    </motion.div>
  );
}
