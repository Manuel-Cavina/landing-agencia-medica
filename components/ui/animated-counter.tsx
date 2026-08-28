"use client";

/**
 * Número monetario que cuenta desde 0 hasta su valor real una sola vez,
 * cuando entra en el viewport.
 *
 * El servidor y la primera hidratación muestran el mismo cero inicial.
 * Así la cifra nunca aparece completa para después retroceder antes de
 * animarse. Al terminar queda fija en su valor real y no vuelve a empezar.
 *
 * Con movimiento reducido, el primer ingreso al viewport muestra el valor
 * final sin animación. El formato monetario se resuelve con Intl.NumberFormat.
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
  /** Conservado para no romper consumidores existentes; no reinicia la cuenta. */
  trigger?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const hasAnimatedRef = useRef(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimatedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimatedRef.current) return;

        hasAnimatedRef.current = true;
        observer.disconnect();

        const prefersReducedMotion =
          typeof window.matchMedia === "function" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
          setProgress(1);
          return;
        }

        const start = performance.now();

        function tick(now: number) {
          const elapsed = Math.min((now - start) / DURATION_MS, 1);
          setProgress(easeOutCubic(elapsed));

          if (elapsed < 1) {
            rafRef.current = requestAnimationFrame(tick);
          } else {
            rafRef.current = undefined;
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = undefined;
      }
    };
  }, []);

  const display = Math.round(progress * value);
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
