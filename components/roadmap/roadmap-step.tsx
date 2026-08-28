/**
 * Una fila del roadmap (un <li>). Server Component: solo decide layout
 * (paridad izquierda/derecha) y ubica la tarjeta. No dibuja nada del
 * recorrido.
 *
 * La línea y los nodos NO viven acá: son un único trazo continuo del 01
 * al 07 que dibuja components/roadmap/roadmap-journey.tsx por encima de
 * toda la lista. Lo único que aporta cada fila es un ancla invisible
 * (`data-roadmap-anchor`): el journey mide la posición real de esas
 * siete anclas para armar el path y colocar los nodos, así la línea
 * sigue a las filas aunque cada una tenga un alto distinto (o crezca al
 * abrir "Ver más").
 *
 * El ancla es ABSOLUTA y no participa de la grilla, para poder medir dos
 * cosas distintas según el ancho sin duplicar marcado:
 * - Móvil: mide TODO el ancho de la fila -> el nodo alterna entre ambos
 *   lados y la línea conserva el recorrido curvo de escritorio.
 * - Escritorio/tablet (md:): mide el ancho COMPLETO de la fila -> el
 *   nodo se ubica por porcentaje de todo ese ancho (ver
 *   DESKTOP_NODE_POSITIONS en roadmap-journey.tsx), no dentro de un
 *   carril angosto. Eso es lo que permite que la curva barra de ~28% a
 *   ~74% de la página, como en el boceto del cliente, en vez de
 *   moverse apenas unos píxeles dentro de una columna central.
 *
 * Grilla:
 * - Móvil (base, <768px): una tarjeta amplia, alineada a izquierda o
 *   derecha y con espacio para que la curva pase por el lado opuesto.
 * - Escritorio/tablet (md:): dos columnas iguales; la tarjeta ocupa la
 *   1 o la 2 según la paridad, y la mitad opuesta queda libre para que
 *   pase la curva.
 */

import type { Pillar } from "@/content/pillars";
import { RoadmapCard } from "@/components/roadmap/roadmap-card";

export function RoadmapStep({
  pillar,
  index,
}: {
  pillar: Pillar;
  index: number;
}) {
  // Los pilares impares (01, 03, 05, 07) van a la DERECHA y los pares
  // (02, 04, 06) a la izquierda, como en el boceto del cliente. El nodo
  // de cada fila cae siempre en la mitad opuesta (ver
  // DESKTOP_NODE_POSITIONS en roadmap-journey.tsx), así nunca se
  // superpone con su tarjeta. Efecto lateral bienvenido: con esta
  // paridad el pilar 07 queda a la derecha, que es justo lo que pide
  // DEC-012 en docs/DECISIONS.md.
  const isLeft = index % 2 === 1;

  return (
    <li className="relative flex pb-12 sm:pb-16 md:grid md:grid-cols-2 md:gap-x-10 md:pb-20 lg:gap-x-16 lg:pb-24">
      {/* Ancla del recorrido: invisible, sin alto, fuera de la grilla.
          Marca dónde empieza esta fila y cuál es el ancho de referencia
          para ubicar su nodo. */}
      <div
        data-roadmap-anchor
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-0 w-full"
      />
      <div
        className={`min-w-0 w-[calc(100%-3.5rem)] ${isLeft ? "mr-auto" : "ml-auto"} md:col-span-1 md:w-auto ${isLeft ? "md:col-start-1" : "md:col-start-2"}`}
      >
        <RoadmapCard pillar={pillar} side={isLeft ? "left" : "right"} />
      </div>
    </li>
  );
}
