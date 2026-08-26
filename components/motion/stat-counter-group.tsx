"use client";

/**
 * Los 4 números de la franja de estadísticas cuentan desde 0 hasta su
 * valor real, TODOS sincronizados: arrancan y terminan al mismo tiempo,
 * cada uno a su propia velocidad según su magnitud (uno que llega a 30
 * avanza en saltos más grandes por frame que uno que llega a 5, pero
 * ambos toman los mismos 3200ms). Por eso es un solo componente con un
 * único IntersectionObserver y un único loop de animación -- si cada
 * número tuviera su propio observer, podrían arrancar en instantes
 * ligeramente distintos y desincronizarse.
 *
 * docs/AGENTS.md, sección "Resultados": "los contadores pueden animarse
 * desde cero una sola vez al entrar en vista" y "no reiniciar contadores
 * cada vez que el usuario vuelve a la sección".
 */

import { useEffect, useRef, useState } from "react";

// 2800-3600ms es el rango que pide docs/AGENTS.md para contadores.
const DURATION_MS = 3200;

export function StatCounterGroup({
  stats,
}: {
  stats: { value: number; suffix: string; label: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  // progress va de 0 a 1; cada número se calcula como progress * su
  // propio value, así que todos comparten el mismo reloj pero cada uno
  // llega a un lugar distinto. Con movimiento reducido arranca en 1
  // directamente (valores finales, sin animar).
  const [progress, setProgress] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 1
      : 0,
  );
  const hasStarted = useRef(progress === 1);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasStarted.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        hasStarted.current = true;
        observer.disconnect();

        const start = performance.now();
        function tick(now: number) {
          const p = Math.min((now - start) / DURATION_MS, 1);
          setProgress(p);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 gap-x-6 gap-y-6 text-center sm:grid-cols-4"
    >
      {stats.map((stat) => (
        <div key={stat.label}>
          <p className="text-2xl font-black text-text-on-brand sm:text-3xl">
            {Math.round(progress * stat.value)}
            {stat.suffix}
          </p>
          <p className="mt-1 text-xs text-text-on-brand/80 sm:text-sm">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
