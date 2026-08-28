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

import { useId, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import type { Pillar } from "@/content/pillars";
import { RoadmapVisual, PillarIcon } from "@/components/roadmap/roadmap-visual";

const CARD_EASE = [0.22, 1, 0.36, 1] as const;
const CARD_DURATION_SECONDS = 0.9;
const X_OFFSET_PX = 18;
const Y_OFFSET_PX = 16;

/**
 * Foco por cercanía al centro del viewport: la tarjeta centrada se ve
 * nítida y al 100%, las demás se atenúan y desenfocan (DEC-015 y el
 * boceto del cliente).
 *
 * El progreso de cada tarjeta va de 0 (su borde superior toca el pie de
 * la ventana) a 1 (su borde inferior sale por arriba); 0,5 es el momento
 * en que está centrada. Ese recorrido mide `alto de la ventana + alto de
 * la tarjeta` en píxeles de scroll -- con 900 + 410 son ~1310px.
 *
 * Por qué la MESETA es ancha (0,25 a 0,75): un primer intento la dejó en
 * 0,32-0,68, o sea ±0,18 · 1310 ≈ ±236px alrededor del centro. Pero las
 * tarjetas están cada ~506px, así que la más cercana al centro puede
 * estar hasta a 253px -- fuera de esa meseta. Resultado: había posiciones
 * de scroll en las que NINGUNA tarjeta estaba nítida y la sección entera
 * se veía borrosa. Con ±0,25 la ventana pasa a ±327px, que cubre de
 * sobra esos 253px: siempre hay una tarjeta enfocada.
 *
 * Por qué la CAÍDA es corta (llega al máximo en 0,10 / 0,90): así la
 * vecina, que cae en un progreso de ~0,11, ya está con el efecto
 * completo. Con una rampa larga quedaba a medio camino y no se leía la
 * jerarquía del boceto.
 *
 * Por qué el efecto es SOLO opacidad, sin `filter: blur()`:
 *
 * 1. Se ve mejor. En el boceto del cliente las tarjetas de los costados
 *    están pálidas pero NÍTIDAS -- su texto se sigue leyendo. Con blur
 *    quedaban chorreadas, y el cliente lo rechazó dos veces.
 * 2. Rinde mejor. `filter: blur()` sobre siete superficies grandes que
 *    además tienen `backdrop-blur`, recalculado en cada frame de scroll,
 *    es lo más caro de toda la sección -- el sospechoso principal de que
 *    el recorrido se sintiera menos fluido al volver hacia arriba.
 *
 * La opacidad, en cambio, la resuelve el compositor sin repintar.
 */
const FOCUS_STOPS = [0, 0.1, 0.25, 0.75, 0.9, 1];
const FOCUS_OPACITY = [0.38, 0.38, 1, 1, 0.38, 0.38];
const FOCUS_SPRING = { stiffness: 110, damping: 30, mass: 0.4 };

/**
 * La tarjeta enfocada además se "activa" sola: toma el mismo aspecto que
 * tenía al pasarle el mouse -- se eleva 3px, la sombra se abre y el
 * borde se marca -- a pedido del cliente ("que la función de cuando paso
 * el mouse sea automática mientras scrolleo").
 *
 * Valores tomados de los tokens de app/globals.css: --shadow-soft y
 * --shadow-float para la sombra, --border-soft para el borde en reposo.
 * Se escriben literales porque Motion interpola números, no `var()`.
 */
const FOCUS_LIFT = [0, 0, -3, -3, 0, 0];
const SHADOW_REST = "0 16px 45px rgba(18, 63, 68, 0.08)";
const SHADOW_ACTIVE = "0 24px 70px rgba(18, 63, 68, 0.14)";
const FOCUS_SHADOW = [SHADOW_REST, SHADOW_REST, SHADOW_ACTIVE, SHADOW_ACTIVE, SHADOW_REST, SHADOW_REST];
const BORDER_REST = "rgba(70, 176, 186, 0.18)";
const BORDER_ACTIVE = "rgba(70, 176, 186, 0.45)";
const FOCUS_BORDER = [BORDER_REST, BORDER_REST, BORDER_ACTIVE, BORDER_ACTIVE, BORDER_REST, BORDER_REST];

/**
 * Variantes de entrada. La dirección sigue al lado REAL de la tarjeta en
 * la grilla: la que está a la izquierda entra desde la izquierda y la de
 * la derecha desde la derecha, así el movimiento acompaña a la curva en
 * vez de cruzarla.
 */
const getCardVariants = (side: "left" | "right") => ({
  hidden: { opacity: 0, x: side === "left" ? -X_OFFSET_PX : X_OFFSET_PX, y: Y_OFFSET_PX },
  visible: { opacity: 1, x: 0, y: 0 },
});

export function RoadmapCard({ pillar, side }: { pillar: Pillar; side: "left" | "right" }) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  const focusRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: focusRef,
    offset: ["start end", "end start"],
  });
  const focus = useSpring(scrollYProgress, FOCUS_SPRING);
  const focusOpacity = useTransform(focus, FOCUS_STOPS, FOCUS_OPACITY);
  const focusLift = useTransform(focus, FOCUS_STOPS, FOCUS_LIFT);
  const focusShadow = useTransform(focus, FOCUS_STOPS, FOCUS_SHADOW);
  const focusBorder = useTransform(focus, FOCUS_STOPS, FOCUS_BORDER);

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
    // La sombra y el borde los escribe Motion en línea (siguen al foco
    // por scroll), así que ya no pueden ir como clases `hover:`: un
    // estilo en línea le gana a cualquier clase. El hover manual
    // conserva solo la elevación, que Tailwind v4 aplica sobre la
    // propiedad `translate` -- distinta del `transform` que usa Motion en
    // el envoltorio, así que ambas se suman sin pisarse.
    <motion.article
      style={
        prefersReducedMotion
          ? { boxShadow: SHADOW_REST, borderColor: BORDER_REST }
          : { boxShadow: focusShadow, borderColor: focusBorder }
      }
      className="flex flex-col gap-5 rounded-lg border bg-brand-20 p-3 backdrop-blur-sm transition-[translate] duration-slow ease-brand hover:-translate-y-[3px] sm:flex-row sm:gap-7 sm:p-3.5"
    >
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
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-900">
            {pillar.category}
          </p>
          <PillarIcon name={pillar.iconName} className="shrink-0 text-brand-500" />
        </div>

        <h3 className="mt-6 flex items-baseline gap-2 text-[30px] font-black leading-[1.05] tracking-tight text-brand-700 sm:text-[40px]">
          <span className="text-base font-bold text-brand-900 sm:text-lg">{pillar.number}.</span>
          {pillar.title}
        </h3>

        <p className="mt-3 max-w-[44ch] text-base text-text-primary sm:text-lg">
          {pillar.summary}
        </p>

        {/* Empuja el control hacia abajo: es el aire del boceto. */}
        <div className="min-h-[24px] flex-1 sm:min-h-[56px]" />

        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => setIsOpen((open) => !open)}
          className="group inline-flex h-11 w-fit items-center gap-6 border-b border-border-soft text-sm font-semibold text-brand-900 transition-colors duration-fast ease-brand hover:border-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
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
              <p className="text-base text-text-primary">{pillar.description}</p>

              <div className="mt-4 rounded-md border border-border-soft bg-brand-12/40 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-900">
                  Qué resuelve
                </p>
                <p className="mt-1 text-sm text-text-primary">{pillar.solves}</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-900">
                  Qué construimos
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {pillar.deliverables.map((item) => (
                    <li
                      key={item}
                      className="rounded-pill border border-border-soft bg-white/60 px-3 py-1 text-xs font-medium text-text-primary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-md border border-border-soft bg-surface-soft px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-900">
                  Qué habilita
                </p>
                <p className="mt-1 text-sm text-text-primary">{pillar.enables}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );

  if (prefersReducedMotion) {
    // Visible de entrada, nítida y al 100%: sin desplazamiento, sin
    // fundido y sin desenfoque. El contenido y el disclosure siguen
    // funcionando igual. El ref queda igual para que `useScroll` tenga
    // un objetivo válido (los hooks se llaman siempre, nunca de forma
    // condicional), pero su valor no se usa.
    return <div ref={focusRef}>{cardBody}</div>;
  }

  return (
    // Aparición ÚNICA, no un efecto continuo: `once: true` hace que la
    // tarjeta anime la primera vez que entra en pantalla y después quede
    // estable para siempre -- no se atenúa ni se desenfoca al salir del
    // centro, y al volver hacia arriba sigue visible. Eso la diferencia
    // a propósito de la línea del recorrido
    // (components/roadmap/roadmap-journey.tsx), que sí sigue al scroll de
    // forma continua y reversible.
    //
    // `amount: 0.25` dispara cuando un cuarto de la tarjeta entró en
    // pantalla, así el contenido ya está disponible poco antes de que la
    // línea alcance su nodo.
    //
    // Dos capas, cada una dueña de propiedades distintas para que no se
    // pisen: la EXTERNA hace la entrada direccional una sola vez, la
    // INTERNA aplica el foco por scroll (continuo y reversible). Las
    // opacidades se multiplican solas al anidarse, así que no hay salto
    // entre una animación y la otra.
    <motion.div
      ref={focusRef}
      variants={getCardVariants(side)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: CARD_DURATION_SECONDS, ease: CARD_EASE }}
    >
      {/* La elevación va acá (transform del envoltorio) y no en la
          tarjeta, para no chocar con el `translate` del hover manual. */}
      <motion.div style={{ opacity: focusOpacity, y: focusLift }}>{cardBody}</motion.div>
    </motion.div>
  );
}
