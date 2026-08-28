"use client";

/**
 * Acordeón de preguntas frecuentes.
 *
 * Es el ÚNICO Client Component de la sección: el encabezado, la columna
 * izquierda y el JSON-LD viven en components/sections/faq-section.tsx,
 * que sigue siendo Server Component.
 *
 * Accesibilidad
 * -------------
 * Cada pregunta es un <button> real dentro de un <h3>, con aria-expanded
 * y aria-controls apuntando a su respuesta. La respuesta es un
 * role="region" con aria-labelledby hacia el botón que la abre, así el
 * lector de pantalla anuncia a qué pregunta pertenece. Mientras está
 * cerrada lleva `inert`: no aparece en el orden de tabulación ni se
 * expone a tecnologías asistivas, pero sigue en el DOM (necesario para
 * animar la altura y para que el contenido exista como texto HTML, que
 * es lo que pide docs/SEO_GEO.md sección 4).
 *
 * Varias respuestas pueden estar abiertas a la vez: abrir una nunca
 * cierra otra. Por eso el estado es un Set de ids y no un índice único.
 *
 * Animación de apertura sin medir alturas
 * ---------------------------------------
 * grid-template-rows: 0fr -> 1fr sobre un contenedor grid con un hijo
 * `overflow-hidden`. El navegador interpola entre la altura cero y la
 * altura NATURAL del contenido, así que no hace falta leer scrollHeight
 * ni escribir un style de altura en píxeles desde JavaScript -- que es
 * justamente lo que produce saltos cuando el texto se reajusta. Es el
 * mismo recurso que usa el "Ver más" de las tarjetas del roadmap.
 *
 * Entrada al viewport sin dejar texto invisible
 * ---------------------------------------------
 * El estado inicial del render (fase "static") es TOTALMENTE VISIBLE, y
 * recién al montar en el cliente se pasa a "hidden" para animar la
 * entrada. Consecuencia buscada: si el JavaScript nunca llega, falla o
 * la hidratación se rompe, el HTML del servidor ya trae las preguntas
 * legibles en vez de quedar clavadas en opacity:0. Un `initial` de
 * Motion haría exactamente lo contrario, y por eso acá no se usa Motion
 * sino transiciones CSS: además son más baratas (compositor puro) para
 * ocho elementos.
 *
 * El movimiento reducido se resuelve con las variantes `motion-reduce:`
 * de Tailwind -- CSS puro, sin rama de JavaScript: el contenido aparece
 * directo en su posición final y la altura cambia sin transición.
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Plus } from "lucide-react";
import { FAQ_ITEMS } from "@/content/faq";

/** Retraso incremental entre preguntas al entrar en vista. */
const STAGGER_MS = 70;

export function FaqAccordion() {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(new Set());
  const listRef = useRef<HTMLUListElement>(null);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      // Alternar sin tocar el resto: abrir una no cierra las demás.
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // La fase de entrada se escribe como atributo del DOM y no como
  // estado de React: solo la consume el CSS. Ver el comentario largo en
  // components/motion/reveal-on-view.tsx -- mismo criterio, y así abrir
  // una pregunta no re-dispara nada relacionado con la entrada.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    list.dataset.reveal = "hidden";

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        list.dataset.reveal = "in";
        // Una sola vez: al volver a subir las preguntas no se re-ocultan.
        observer.disconnect();
      },
      { threshold: 0.12 },
    );

    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  return (
    <ul ref={listRef} className="group/list flex list-none flex-col gap-3">
      {FAQ_ITEMS.map((item, index) => {
        const isOpen = openIds.has(item.id);
        const buttonId = `faq-question-${item.id}`;
        const panelId = `faq-answer-${item.id}`;

        return (
          <li
            key={item.id}
            style={{ "--reveal-delay": `${index * STAGGER_MS}ms` } as CSSProperties}
            // Sin data-reveal en el <ul> (render del servidor) la
            // pregunta está visible. El retraso escalonado solo se
            // aplica al ENTRAR; al ocultar es 0 para que las ocho partan
            // del mismo estado.
            className="transition-[opacity,translate] duration-slow ease-brand group-data-[reveal=hidden]/list:translate-y-4 group-data-[reveal=hidden]/list:opacity-0 group-data-[reveal=in]/list:[transition-delay:var(--reveal-delay)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none"
          >
            {/* Tarjeta liviana e independiente por pregunta: el FAQ no es
                un único bloque pesado.

                Mismo tratamiento que el botón "Ver video" del hero, a
                pedido del cliente: vidrio translúcido brand-12 con borde
                suave, sin sombra, y brand-20 al pasar el mouse. Radio
                20px (--radius-md) en vez de píldora porque acá es una
                tarjeta con contenido, no un botón. */}
            <div
              className={`rounded-md border backdrop-blur-sm transition-[background-color,border-color] duration-base ease-brand motion-reduce:transition-none ${
                isOpen
                  ? "border-brand-500/40 bg-brand-20"
                  : "border-border-soft bg-brand-12 hover:bg-brand-20"
              }`}
            >
              {/* h3: la sección aporta el h2, así no se salta ningún
                  nivel de encabezado (docs/SEO_GEO.md sección 4). El
                  botón va DENTRO del h3 para que siga siendo un
                  encabezado navegable por lectores de pantalla. */}
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(item.id)}
                  // min-h-14 = 56px: por encima del mínimo táctil de 44px
                  // incluso cuando la pregunta entra en una sola línea.
                  className="flex min-h-14 w-full items-center justify-between gap-4 rounded-md px-5 py-4 text-left text-[15px] font-semibold text-brand-900 transition-colors duration-fast ease-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 motion-reduce:transition-none"
                >
                  {item.question}

                  {/* El ícono es decorativo: el estado real lo comunica
                      aria-expanded, no la rotación. Un Plus girado 45°
                      se lee como cruz al abrir. */}
                  <span
                    aria-hidden="true"
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-pill text-brand-900 transition-[rotate,background-color] duration-base ease-brand motion-reduce:transition-none ${
                      isOpen ? "rotate-45 bg-brand-20" : "rotate-0 bg-brand-12"
                    }`}
                  >
                    <Plus size={16} strokeWidth={2.5} />
                  </span>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows,opacity] duration-slow ease-brand motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  {/* El desplazamiento de 6px es el máximo que admite el
                      brief; se aplica al párrafo y no a la tarjeta, así
                      la tarjeta nunca escala ni se mueve. */}
                  <p
                    className={`px-5 pb-5 text-sm leading-relaxed text-text-primary transition-[translate] duration-slow ease-brand motion-reduce:translate-y-0 motion-reduce:transition-none ${
                      isOpen ? "translate-y-0" : "-translate-y-1.5"
                    }`}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
