"use client";

/**
 * Carrusel continuo de casos (Embla Carousel + el plugin oficial
 * embla-carousel-auto-scroll). Se usa el plugin de auto-scroll en vez de
 * armar el desplazamiento continuo a mano con requestAnimationFrame:
 * está hecho exactamente para este patrón (velocidad constante, loop sin
 * saltos, pausa al hover/foco), así que reimplementarlo hubiera sido
 * reinventar algo que la librería ya declarada en AGENTS.md resuelve
 * bien.
 *
 * Es "use client" porque Embla necesita manipular el DOM directamente y
 * escuchar eventos del navegador. El resto de la sección (eyebrow,
 * título, descripción) sigue siendo Server Component -- solo esto y el
 * número de cada tarjeta (components/ui/animated-counter.tsx) requieren
 * JavaScript.
 */

import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { ProfessionalCard } from "@/components/results/professional-card";
import type { ProfessionalCase } from "@/content/results";

export function ResultsCarousel({ cases }: { cases: ProfessionalCase[] }) {
  // Con movimiento reducido, ni siquiera se inicializa el plugin de
  // auto-scroll: el carrusel queda quieto y se navega solo con swipe o
  // teclado (docs del cliente: "detener el movimiento con
  // prefers-reduced-motion").
  const [prefersReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  // useState con inicializador perezoso (no useRef): crea el plugin una
  // sola vez sin leer un .current durante el render, que React 19
  // marca como error.
  const [autoScrollPlugin] = useState(() =>
    AutoScroll({
      speed: 0.7,
      direction: "forward",
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      stopOnFocusIn: true,
      // Cuánto espera antes de retomar el movimiento después de que el
      // mouse sale de la zona (pausa por stopOnMouseEnter). El default
      // del plugin se sentía lento para "reanudar" -- a pedido del
      // cliente, baja para que el carrusel vuelva a moverse enseguida.
      startDelay: 150,
    }),
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, skipSnaps: true },
    prefersReducedMotion ? [] : [autoScrollPlugin],
  );

  // Navegación por teclado: Embla no la da de fábrica para un carrusel a
  // scroll libre (dragFree), así que se agrega acá. El contenedor es
  // focuseable (tabIndex=0) para que las flechas funcionen sin depender
  // de un botón visible que compita con las tarjetas.
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!emblaApi) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        emblaApi.scrollNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        emblaApi.scrollPrev();
      }
    },
    [emblaApi],
  );

  return (
    <div
      ref={emblaRef}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Casos y resultados"
      className="overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
    >
      {/* El espacio entre tarjetas va como padding de CADA tarjeta, no
          como gap del contenedor: con loop:true, Embla reposiciona los
          slides para armar la vuelta infinita, y un gap del contenedor
          no se aplica de forma confiable justo en esa costura (se ve una
          tarjeta pegada contra el borde, como reportó el cliente). El
          padding viaja siempre con cada tarjeta, así que el espacio
          queda igual en cualquier punto del loop, costura incluida. */}
      <div className="flex items-stretch">
        {cases.map((item) => (
          <div
            key={item.id}
            className="min-w-0 shrink-0 basis-[66%] px-3 sm:basis-[38%] sm:px-4 lg:basis-[25%] lg:px-6"
          >
            {/* El agrandado al hover va en este div interno, no en el de
                arriba: así el tamaño que Embla mide para el slide (con su
                padding) nunca cambia, y el scale es puramente visual. */}
            <div className="relative h-full transition-transform duration-slow ease-brand hover:z-10 hover:scale-105">
              <ProfessionalCard case={item} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
