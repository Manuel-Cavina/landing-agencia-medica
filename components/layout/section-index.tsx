"use client";

/**
 * Índice lateral de secciones: una barra vertical fija sobre el margen
 * derecho que marca en qué sección está parado el usuario y permite
 * saltar a cualquier otra.
 *
 * Solo desde xl (1280px): a partir de ahí el <Container> deja margen
 * libre a los costados y la barra cae sobre el vacío, no sobre el
 * contenido. Por debajo se oculta -- no hay lugar, y el navbar ya
 * resuelve la navegación en esos anchos.
 *
 * Detección de la sección activa
 * ------------------------------
 * Un único IntersectionObserver sobre las seis secciones. No hay
 * listener de scroll: el navegador avisa cuando una sección entra o
 * sale, y entre medio no se ejecuta nada. Es el mismo criterio que ya
 * usa components/layout/site-header.tsx para marcar el link activo del
 * navbar, y el motivo es el rendimiento -- docs/SEO_GEO.md sección 13
 * pide explícitamente evitar listeners de scroll costosos.
 *
 * El rootMargin superior negativo descuenta la altura del navbar fijo:
 * una sección recién cuenta como activa cuando ya pasó por debajo de él.
 *
 * Accesibilidad
 * -------------
 * Es un <nav> con nombre propio, hecho de enlaces reales a anclas: sin
 * JavaScript sigue navegando. La sección activa se marca con
 * aria-current="page" y además con color Y tamaño del trazo, nunca solo
 * con color. Las etiquetas están siempre en el DOM (el lector de
 * pantalla las lee siempre); visualmente aparecen al pasar el mouse por
 * la barra o al enfocar con el teclado, para no tapar el contenido.
 */

import { useEffect, useState } from "react";
import { SECTION_INDEX } from "@/config/site";

/**
 * Alto de cada fila del índice, en píxeles (la clase h-8 de Tailwind).
 * El tramo recorrido del riel se calcula con este número, así que si
 * cambia la clase tiene que cambiar acá.
 */
const ROW_HEIGHT_PX = 32;

export function SectionIndex() {
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const activeIndex = SECTION_INDEX.findIndex((item) => item.href === activeHref);

  useEffect(() => {
    const sections = SECTION_INDEX.map((item) => document.querySelector(item.href)).filter(
      (el): el is Element => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        // Con varias secciones a la vista gana la que está más arriba:
        // es la que el usuario está leyendo en ese momento.
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveHref(`#${topMost.target.id}`);
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: 0.05 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Índice de secciones"
      className="group fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="relative flex flex-col items-end">
        {/* Riel continuo que une los seis puntos, igual que la línea del
            roadmap une los siete pilares. No es decoración: convierte
            seis marcas sueltas en UN recorrido, que es lo que la página
            cuenta. Va detrás de los puntos (-z-10). */}
        <span
          aria-hidden="true"
          className="absolute right-[6px] top-4 bottom-4 -z-10 w-px -translate-x-1/2 bg-brand-900/15"
        />

        {/* Tramo recorrido. Su alto se calcula sobre la posición del
            punto activo: cada fila mide 32px (h-8), así que el centro
            del punto N está a 16 + 32N píxeles del tope. */}
        <span
          aria-hidden="true"
          className="absolute right-[6px] top-4 -z-10 w-px -translate-x-1/2 bg-brand-700 transition-[height] duration-slow ease-brand motion-reduce:transition-none"
          style={{ height: activeIndex <= 0 ? 0 : activeIndex * ROW_HEIGHT_PX }}
        />

        {SECTION_INDEX.map((item, index) => {
          const isActive = activeHref === item.href;
          // "Recorrido": ya pasaste por esta sección. Se pinta distinto
          // de las que faltan, así el índice informa progreso y no solo
          // posición.
          const isPassed = activeIndex > index;

          return (
            <a
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              // h-8 = 32px de alto de fila. El área clickeable real se
              // extiende hacia la izquierda con el pl-3, así que el
              // objetivo supera el mínimo AA de 24px con margen.
              className="flex h-8 items-center justify-end gap-3 rounded-pill pl-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              {/* La etiqueta nunca sale del DOM: se atenúa, así el lector
                  de pantalla siempre tiene el nombre del enlace.
                  La de la sección ACTIVA se ve siempre -- ése es el
                  trabajo de un índice: decirte dónde estás sin que
                  tengas que ir a buscarlo con el mouse. Las demás
                  aparecen al pasar por encima o al enfocar. */}
              <span
                className={`whitespace-nowrap rounded-pill bg-white/90 px-2.5 py-1 text-[11px] font-semibold tracking-tight shadow-soft backdrop-blur-sm transition-[opacity,translate] duration-base ease-brand group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:translate-x-0 group-focus-within:opacity-100 motion-reduce:transition-none ${
                  isActive
                    ? "translate-x-0 text-brand-700 opacity-100"
                    : "translate-x-1 text-text-secondary opacity-0"
                }`}
              >
                {item.label}
              </span>

              {/* Punto sobre el riel. El estado NO depende solo del
                  color: el activo además crece y gana un anillo.

                  Los colores son brand-700 y brand-900, nunca
                  brand-500: el índice queda fijo mientras el fondo por
                  detrás cambia de #DFEDEF a blanco y a la franja
                  turquesa de estadísticas. brand-500 sobre #46B0BA da
                  exactamente el color del fondo y desaparece
                  (verificado en captura). Estos dos se distinguen
                  sobre los tres fondos que atraviesa. */}
              <span className="flex w-3 shrink-0 justify-center">
                <span
                  aria-hidden="true"
                  className={`rounded-pill transition-[width,height,background-color,box-shadow] duration-base ease-brand motion-reduce:transition-none ${
                    isActive
                      ? "h-2.5 w-2.5 bg-brand-700 shadow-[0_0_0_4px_var(--brand-20)]"
                      : isPassed
                        ? "h-1.5 w-1.5 bg-brand-700/60"
                        : "h-1.5 w-1.5 bg-brand-900/25 group-hover:bg-brand-900/45"
                  }`}
                />
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
