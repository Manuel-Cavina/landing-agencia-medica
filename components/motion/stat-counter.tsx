"use client";

/**
 * Número que cuenta desde 0 hasta su valor real la primera vez que entra
 * en el viewport (docs/AGENTS.md, sección "Resultados": "los contadores
 * pueden animarse desde cero una sola vez al entrar en vista" y "no
 * reiniciar contadores cada vez que el usuario vuelve a la sección").
 *
 * Client Component chico y aislado a propósito: components/sections/
 * stats-strip.tsx sigue siendo Server Component, solo este número
 * necesita JavaScript.
 */

import { useEffect, useRef, useState } from "react";

// 2800-3600ms es el rango que pide docs/AGENTS.md para contadores.
const DURATION_MS = 3200;

export function StatCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Se decide una sola vez, en el inicializador de useState (no con un
  // setState síncrono dentro del efecto de abajo): con movimiento
  // reducido arranca directamente en el valor final, sin animar el
  // conteo (docs/AGENTS.md "Motion").
  const [prefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [display, setDisplay] = useState(() => (prefersReducedMotion ? value : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Se desconecta apenas dispara una vez: nunca se reinicia al
        // volver a scrollear sobre el mismo número.
        observer.disconnect();

        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min((now - start) / DURATION_MS, 1);
          setDisplay(Math.round(progress * value));
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, prefersReducedMotion]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}
