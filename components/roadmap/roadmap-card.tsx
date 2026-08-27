"use client";

/**
 * Tarjeta de un pilar del roadmap, siguiendo el boceto del cliente:
 * formato horizontal con una franja de imagen vertical a la izquierda
 * (con el número del pilar en un círculo turquesa sobre su esquina
 * inferior) y el contenido a la derecha -- categoría e ícono arriba,
 * título grande, resumen corto, mucho aire, y "Ver más +" abajo.
 *
 * Tipografía: Inter en todo, incluido el título. El boceto usaba una
 * serif para los títulos, pero el cliente decidió expresamente mantener
 * la tipografía actual del sitio (ver docs/DESIGN_SYSTEM.md: el serif
 * solo se contempla como acento puntual, nunca en las siete tarjetas).
 *
 * Dos comportamientos propios:
 *
 * 1. Aparición al entrar en el viewport (whileInView, once: true): cada
 *    tarjeta anima una sola vez y nunca vuelve a ocultarse, aunque el
 *    usuario suba de nuevo -- distinto de la línea del recorrido
 *    (components/roadmap/roadmap-journey.tsx), que sí es bidireccional
 *    porque sigue el scroll en vivo.
 *
 * 2. Disclosure "Ver más": técnica CSS grid-template-rows 0fr -> 1fr.
 *    Anima el alto sin medir píxeles a mano y sin sacar el contenido del
 *    DOM. Cuando la tarjeta crece, el ResizeObserver del journey vuelve
 *    a medir las anclas y la línea se reacomoda sola.
 */

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Pillar } from "@/content/pillars";
import { RoadmapVisual, PillarIcon } from "@/components/roadmap/roadmap-visual";

const CARD_EASE = [0.22, 1, 0.36, 1] as const;
const CARD_DURATION_SECONDS = 0.95;
const X_OFFSET_PX = 18;
const Y_OFFSET_PX = 16;

export function RoadmapCard({ pillar, side }: { pillar: Pillar; side: "left" | "right" }) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  const cardBody = (
    // Mismo vidrio que el botón "Ver video" del hero -- pero en su tono
    // de HOVER (bg-brand-20, no bg-brand-12), a pedido del cliente: "que
    // sea un poco más oscuro". Reemplaza al blanco de .glass-surface.
    // Efecto lateral bienvenido: .glass-surface se define
    // FUERA de las capas de Tailwind, así que su box-shadow le ganaba a
    // `hover:shadow-float` y el hover no cambiaba la sombra (era un bug
    // registrado en docs/sections/ROADMAP_MOTION_AUDIT.md). Al sacarla,
    // la sombra del hover pasa a funcionar. `translate` se suma a la
    // lista de transición porque Tailwind v4 escribe `-translate-y-[3px]`
    // en esa propiedad, no en `transform`: sin esto el desplazamiento
    // ocurría de golpe.
    <article className="flex flex-col gap-5 rounded-lg border border-border-soft bg-brand-20 p-3 shadow-soft backdrop-blur-sm transition-[box-shadow,border-color,transform,translate] duration-slow ease-brand hover:border-brand-500/40 hover:shadow-float hover:-translate-y-[3px] sm:flex-row sm:gap-7 sm:p-3.5">
      {/* Franja de imagen vertical, con el número sobre su esquina. */}
      <div className="relative w-full shrink-0 self-stretch sm:w-[38%] sm:max-w-[260px]">
        <RoadmapVisual pillar={pillar} />
        <span
          aria-hidden="true"
          className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-pill bg-brand-500 text-xs font-bold text-text-on-brand shadow-[0_8px_20px_rgba(70,176,186,0.35)]"
        >
          {pillar.number}
        </span>
      </div>

      {/* Contenido. */}
      <div className="flex min-w-0 flex-1 flex-col py-3 pr-2 sm:py-6 sm:pr-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-500">
            {pillar.category}
          </p>
          <PillarIcon name={pillar.iconName} className="shrink-0 text-brand-500" />
        </div>

        <h3 className="mt-6 flex items-baseline gap-2 text-[30px] font-black leading-[1.05] tracking-tight text-brand-700 sm:text-[40px]">
          <span className="text-base font-bold text-brand-500 sm:text-lg">{pillar.number}.</span>
          {pillar.title}
        </h3>

        <p className="mt-3 max-w-[44ch] text-base text-text-secondary sm:text-lg">
          {pillar.summary}
        </p>

        {/* Empuja el control hacia abajo: es el aire del boceto. */}
        <div className="min-h-[24px] flex-1 sm:min-h-[56px]" />

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((open) => !open)}
          className="group inline-flex h-11 w-fit items-center gap-6 border-b border-border-soft text-sm font-semibold text-brand-700 transition-colors duration-fast ease-brand hover:border-brand-500 hover:text-brand-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          {isOpen ? "Ver menos" : "Ver más"}
          <Plus
            aria-hidden="true"
            size={16}
            className={`transition-transform duration-base ease-brand ${isOpen ? "rotate-45" : ""}`}
          />
        </button>

        <div
          id={contentId}
          style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
          className="grid transition-[grid-template-rows] duration-500 ease-brand motion-reduce:transition-none"
        >
          <div className="overflow-hidden">
            <div className="mt-6 border-t border-border-soft pt-6">
              <p className="text-base text-text-secondary">{pillar.description}</p>

              <div className="mt-4 rounded-md border border-border-soft bg-brand-12/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Qué resuelve
                </p>
                <p className="mt-1 text-sm text-text-secondary">{pillar.solves}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Qué construimos
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {pillar.deliverables.map((item) => (
                    <li
                      key={item}
                      className="rounded-pill border border-border-soft bg-white/60 px-3 py-1 text-xs font-medium text-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-md border border-border-soft bg-surface-soft px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                  Qué habilita
                </p>
                <p className="mt-1 text-sm text-text-secondary">{pillar.enables}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  if (prefersReducedMotion) {
    return cardBody;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -X_OFFSET_PX : X_OFFSET_PX, y: Y_OFFSET_PX }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: CARD_DURATION_SECONDS, ease: CARD_EASE }}
    >
      {cardBody}
    </motion.div>
  );
}
