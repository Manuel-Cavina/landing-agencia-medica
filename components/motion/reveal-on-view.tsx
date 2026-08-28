"use client";

/**
 * Entrada progresiva disparada AL ENTRAR EN VISTA, una sola vez.
 *
 * Por qué no se reutiliza components/motion/reveal.tsx: ese componente
 * anima al MONTAR. Sirve para el hero, que ya está en pantalla cuando la
 * página carga, pero para una sección al final del documento significa
 * que la animación se reproduce mientras nadie la está mirando y el
 * usuario llega cuando ya terminó. Reveal se deja intacto -- lo usan
 * hero, resultados, roadmap y calculadora, y no es esta tarea la que
 * debe cambiarles el comportamiento.
 *
 * Por qué CSS y no Motion: Motion escribe el estado inicial
 * (`opacity: 0`) en el HTML del servidor. Si el JavaScript falla o la
 * hidratación se rompe, el contenido queda invisible para siempre. Acá
 * el primer render es TOTALMENTE VISIBLE y recién al montar en el
 * cliente se pasa al estado oculto para animar. Sin JavaScript, la
 * sección simplemente se ve, que es el comportamiento correcto para
 * contenido -- y más todavía para un CTA.
 *
 * Por qué un atributo del DOM y no useState: el estado de la animación
 * no lo consume React, solo el CSS. Escribir `data-reveal` desde el
 * efecto es sincronizar con un sistema externo (el DOM), que es
 * exactamente el uso previsto de useEffect; hacerlo con setState
 * dispararía renders en cascada y la regla react-hooks/set-state-in-effect
 * de React 19 lo rechaza con razón. Además así la entrada no provoca ni
 * un solo re-render.
 *
 * Movimiento reducido: variantes `motion-reduce:` de Tailwind, sin rama
 * de JavaScript. El bloque aparece directo en su posición final.
 */

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

export function RevealOnView({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  /** Retraso en segundos, para encadenar bloques dentro de una sección. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Recién acá se oculta: el HTML del servidor ya se vio completo.
    node.dataset.reveal = "hidden";

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        node.dataset.reveal = "in";
        // `once`: al volver a subir el contenido no se re-oculta.
        observer.disconnect();
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ "--reveal-delay": `${delay}s` } as CSSProperties}
      // Sin data-reveal (render del servidor) el bloque está visible.
      // El retraso solo se aplica al ENTRAR, nunca al ocultar, para que
      // todos los bloques partan del mismo estado.
      className={`transition-[opacity,translate] duration-slow ease-brand data-[reveal=hidden]:translate-y-5 data-[reveal=hidden]:opacity-0 data-[reveal=in]:[transition-delay:var(--reveal-delay)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
