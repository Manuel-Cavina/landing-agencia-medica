"use client";

/**
 * Número monetario que cuenta desde 0 hasta su valor real CADA VEZ que la
 * tarjeta que lo contiene entra en el viewport (a pedido explícito del
 * cliente: "tiene que hacerse ese efecto cada vez que aparece el card
 * por pantalla"). Esto reemplaza a propósito la regla original de
 * docs/AGENTS.md para esta sección ("los contadores... una sola vez...
 * no reiniciar cada vez que el usuario vuelve"): tiene sentido acá
 * porque el carrusel es un loop continuo, no una sección estática que
 * se visita una vez.
 *
 * Formato de moneda real vía Intl.NumberFormat y un easing desacelerado
 * (no lineal).
 */

import { useEffect, useRef, useState } from "react";

// Rango pedido: 2000-2800ms.
const DURATION_MS = 2400;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function AnimatedCounter({
  value,
  currency,
  suffix = "",
}: {
  value: number;
  currency: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Con movimiento reducido: mostrar siempre el valor final, sin animar
  // (se decide una sola vez en el inicializador de useState).
  const [prefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    let rafId: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          function tick(now: number) {
            const progress = Math.min((now - start) / DURATION_MS, 1);
            setDisplay(Math.round(easeOutCubic(progress) * value));
            if (progress < 1) rafId = requestAnimationFrame(tick);
          }
          rafId = requestAnimationFrame(tick);
        } else {
          // Vuelve a 0 al salir de vista, para que la próxima vez que
          // entre (el carrusel es un loop continuo) el efecto se repita
          // desde el principio en vez de aparecer ya "lleno".
          cancelAnimationFrame(rafId);
          setDisplay(0);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [value, prefersReducedMotion]);

  const formatted = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(display);

  return (
    <span ref={ref}>
      {formatted}
      {suffix}
    </span>
  );
}
