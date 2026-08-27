"use client";

/**
 * El recorrido completo del roadmap: UNA sola línea continua del nodo 01
 * al 07, más los siete nodos. Envuelve al <ol> (que le llega como
 * children) y dibuja todo por encima, en una capa decorativa.
 *
 * Por qué un solo SVG y no uno por fila (la versión anterior): con siete
 * SVG independientes, cada tramo tenía su propio `useScroll` y su propio
 * resorte, así que aunque cada uno se dibujara bien, nunca se leían como
 * UNA línea -- cada tramo avanzaba a su ritmo, y en las costuras entre
 * filas se notaba el corte. Acá hay un único `<path>`, un único
 * `useScroll` sobre todo el recorrido y un único `stroke-dashoffset`
 * animándose: la línea se dibuja de corrido del 01 al 07.
 *
 * Cómo se arma la geometría: las filas del roadmap NO miden todas lo
 * mismo (cada tarjeta tiene su alto, y crece más cuando se abre "Ver
 * más"), así que las coordenadas del trazo no se pueden calcular con
 * porcentajes fijos. En vez de eso se MIDEN en píxeles reales: cada
 * <li> deja un ancla invisible en su carril (`[data-roadmap-anchor]`,
 * ver components/roadmap/roadmap-step.tsx), y este componente lee la
 * posición de esas anclas para construir el `d` del path. Un
 * ResizeObserver rehace la medición cuando algo cambia de alto (abrir un
 * disclosure, cambiar el ancho de la ventana), así que la línea sigue
 * siempre a los nodos.
 *
 * Como el viewBox queda 1:1 con los píxeles reales del contenedor (no
 * hay `preserveAspectRatio="none"` estirando nada), el
 * `stroke-dasharray` se comporta de forma predecible y el grosor del
 * trazo no se distorsiona.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * Posición horizontal de cada nodo, en porcentaje del ancho del ancla
 * de su fila (ver components/roadmap/roadmap-step.tsx).
 *
 * En escritorio el ancla mide TODO el ancho de la fila, así que estos
 * valores barren ~28% -> ~74% de la página: el nodo cae siempre en la
 * mitad libre, del lado opuesto a la tarjeta, y la curva se abre de
 * verdad (como en el boceto del cliente). En móvil el ancla es el
 * carril angosto de 30px y todos los nodos van centrados ahí.
 */
const DESKTOP_NODE_POSITIONS = [28, 74, 28, 74, 28, 74, 28];
const MOBILE_NODE_POSITION = 50;

/**
 * Cuánto se alejan los puntos de control de su nodo, como fracción de la
 * distancia vertical entre nodos. Más alto = la curva sale y entra más
 * "vertical" de cada nodo y por lo tanto se abre más al medio (una S más
 * marcada); más bajo = tiende a la diagonal recta.
 */
const BEND_FACTOR = 0.55;

type Point = { x: number; y: number };

/** Curva suave entre puntos, con tangente vertical en cada nodo. */
function buildPath(points: Point[]) {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i];
    const to = points[i + 1];
    const bend = (to.y - from.y) * BEND_FACTOR;
    d += ` C ${from.x} ${from.y + bend}, ${to.x} ${to.y - bend}, ${to.x} ${to.y}`;
  }
  return d;
}

export function RoadmapJourney({ children, total }: { children: ReactNode; total: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [size, setSize] = useState({ width: 0, height: 0 });
  const [points, setPoints] = useState<Point[]>([]);
  /** Fracción del recorrido total en la que cae cada nodo (0 a 1). */
  const [nodeStops, setNodeStops] = useState<number[]>([]);

  // "end 100%" (el progreso llega a 1 cuando el pie del recorrido toca el
  // pie de la ventana), no "end 55%": hoy el roadmap es la última sección
  // de la página, así que el scroll se termina ANTES de que su pie pueda
  // subir hasta la mitad de la ventana. Con el offset anterior el
  // progreso se quedaba en ~0,92 y el nodo 07 nunca se encendía (medido).
  // Si más adelante se agregan secciones debajo, este valor se puede
  // volver a bajar para que el trazo termine un poco antes.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 82%", "end 100%"],
  });

  // Sin `useSpring`: el trazo se ata 1:1 al scroll, a pedido del cliente
  // ("que se mueva según la velocidad del scroll"). Un resorte suaviza
  // pero desacopla -- la línea queda atrás y se acomoda sola, así que su
  // velocidad la marca el resorte y no la mano del usuario. Con el valor
  // crudo, scrolleás rápido y se dibuja rápido; scrolleás lento y se
  // dibuja lento.
  const progress = scrollYProgress;

  const measure = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rows = Array.from(container.querySelectorAll<HTMLElement>("ol > li"));
    if (rows.length === 0) return;

    const containerRect = container.getBoundingClientRect();
    // El ancho del carril distingue escritorio de móvil sin leer
    // window.innerWidth: en móvil el carril mide ~30px. La medición
    // corre en un efecto (solo cliente), así que no hay riesgo de
    // desajuste de hidratación.
    const firstRail = rows[0].querySelector<HTMLElement>("[data-roadmap-anchor]");
    if (!firstRail) return;
    const isNarrowRail = firstRail.getBoundingClientRect().width < 60;

    const nextPoints = rows.map((row, index) => {
      const rowRect = row.getBoundingClientRect();
      const rail = row.querySelector<HTMLElement>("[data-roadmap-anchor]");
      const railRect = (rail ?? row).getBoundingClientRect();
      const percent = isNarrowRail
        ? MOBILE_NODE_POSITION
        : (DESKTOP_NODE_POSITIONS[index] ?? MOBILE_NODE_POSITION);

      // Y = centro vertical de la TARJETA, no el tope de la fila. Como
      // cada nodo es un extremo de la curva (los puntos de control
      // comparten su X, o sea tangente vertical), poner el nodo a media
      // altura de la tarjeta hace que el punto máximo de cada arco caiga
      // justo al costado del centro de su tarjeta -- que es como está en
      // el boceto del cliente.
      //
      // Se calcula con el padding de la fila en vez de medir el
      // <article> directamente: la tarjeta tiene un transform de entrada
      // (Motion, `y: 16`) que getBoundingClientRect() incluiría, y eso
      // correría el nodo unos píxeles según si la tarjeta ya animó o no.
      // El padding es puro layout, así que da el mismo valor siempre.
      const rowStyle = getComputedStyle(row);
      const padTop = parseFloat(rowStyle.paddingTop) || 0;
      const padBottom = parseFloat(rowStyle.paddingBottom) || 0;
      const cardHeight = rowRect.height - padTop - padBottom;

      return {
        x: railRect.left - containerRect.left + (railRect.width * percent) / 100,
        y: rowRect.top + padTop + cardHeight / 2 - containerRect.top,
      };
    });

    setSize({ width: containerRect.width, height: containerRect.height });
    setPoints(nextPoints);
  }, []);

  useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(measure);
    observer.observe(container);
    // También observa cada fila: abrir un "Ver más" cambia el alto de
    // una fila sin cambiar necesariamente el del contenedor en el mismo
    // frame.
    container.querySelectorAll("li").forEach((li) => observer.observe(li));

    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  const d = buildPath(points);

  // En qué fracción del recorrido total cae cada nodo. Se mide con
  // getTotalLength() sobre sub-paths, no a ojo: así el encendido de cada
  // nodo coincide con el momento en que la línea lo alcanza. El atributo
  // `pathLength="1"` del trazo no afecta a getTotalLength(), que sigue
  // devolviendo la longitud geométrica real.
  useEffect(() => {
    const path = pathRef.current;
    if (!path || points.length < 2) return;

    const totalLength = path.getTotalLength();

    const helper = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const stops = points.map((_, index) => {
      if (index === 0) return 0;
      helper.setAttribute("d", buildPath(points.slice(0, index + 1)));
      return totalLength === 0 ? 0 : helper.getTotalLength() / totalLength;
    });
    setNodeStops(stops);
  }, [d, points]);

  // Offset NORMALIZADO (1 = nada dibujado, 0 = todo dibujado), sin
  // ninguna referencia al largo medido.
  //
  // Por qué así: Motion se suscribe al valor derivado UNA sola vez, con
  // el transformador del primer render. Si ese transformador depende de
  // `pathLength` -- que arranca en 0 y recién se mide en el useEffect de
  // arriba -- queda calculando contra 0 para siempre, y la línea aparece
  // dibujada al 100% desde el primer frame. Pasó con las dos variantes:
  // la de closure (`v => pathLength * (1 - v)`) y la de arrays
  // (`[pathLength, 0]`); ambas medidas con dashoffset 0px en todo el
  // recorrido (ver docs/sections/ROADMAP_MOTION_AUDIT.md).
  //
  // Con el atributo SVG `pathLength="1"` el navegador reinterpreta
  // dasharray y dashoffset como fracciones de 1, así que el trazo se
  // controla con constantes y el transformador no necesita conocer la
  // geometría real. `getTotalLength()` no se ve afectado por ese
  // atributo, así que la medición de `nodeStops` sigue siendo válida.
  const dashOffset = useTransform(progress, [0, 1], [1, 0]);

  return (
    <div ref={containerRef} className="relative">
      {size.width > 0 && d && (
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${size.width} ${size.height}`}
          width={size.width}
          height={size.height}
        >
          <defs>
            <linearGradient id="roadmap-progress-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#46b0ba" />
              <stop offset="100%" stopColor="#78cfd3" />
            </linearGradient>
          </defs>

          {/* Camino base punteado: el recorrido completo 01 -> 07,
              visible desde el primer render, en un turquesa tenue. */}
          <path
            d={d}
            stroke="rgba(70, 176, 186, 0.45)"
            strokeWidth="3"
            strokeDasharray="3 14"
            strokeLinecap="round"
            fill="none"
          />

          {/* Línea de progreso: un único trazo sólido que se dibuja de
              corrido del 01 al 07 a medida que se scrollea. */}
          {prefersReducedMotion ? (
            <path
              d={d}
              stroke="url(#roadmap-progress-gradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          ) : (
            <motion.path
              ref={pathRef}
              d={d}
              stroke="url(#roadmap-progress-gradient)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              pathLength={1}
              strokeDasharray={1}
              style={{ strokeDashoffset: dashOffset }}
            />
          )}

          {/* Path auxiliar, invisible: existe solo para poder medir el
              largo del trazo cuando el de arriba no se renderiza (caso
              de movimiento reducido). */}
          {prefersReducedMotion && <path ref={pathRef} d={d} stroke="none" fill="none" />}
        </svg>
      )}

      {/* Nodos: elementos del DOM (no del SVG) para poder usar el mismo
          tipografiado del resto del sitio en el número. */}
      {points.map((point, index) => (
        <RoadmapNode
          key={index}
          number={String(index + 1).padStart(2, "0")}
          x={point.x}
          y={point.y}
          progress={progress}
          stop={nodeStops[index] ?? index / Math.max(1, total - 1)}
          reducedMotion={Boolean(prefersReducedMotion)}
        />
      ))}

      {children}
    </div>
  );
}

/**
 * Un nodo del recorrido: el isotipo de la marca con el número del pilar
 * adentro (a pedido del cliente). El logo es un anillo con el centro
 * hueco, así que el número entra en ese hueco sin taparlo -- pero el
 * hueco no está centrado: la ola del logo ocupa su parte inferior, así
 * que el número se sube un poco (`top-[38%]`) para caer en la zona
 * limpia.
 *
 * El "latido": no es una pulsación infinita (docs/DESIGN_SYSTEM.md la
 * prohíbe expresamente, y consumiría CPU de forma permanente). Es un
 * latido ÚNICO ligado al scroll: la escala pasa por tres puntos
 * (1 → 1.22 → 1.06) a medida que el progreso cruza el umbral del nodo,
 * así que el logo se hincha y se asienta justo cuando la línea lo
 * alcanza. Al no depender de estado de React ni de un bucle, no hay
 * renders extra ni animación corriendo de fondo; y si el usuario sube,
 * el latido se reproduce al revés de forma natural.
 *
 * `stop` es la fracción del largo total del trazo en la que está este
 * nodo, medida en RoadmapJourney -- no una estimación.
 */
function RoadmapNode({
  number,
  x,
  y,
  progress,
  stop,
  reducedMotion,
}: {
  number: string;
  x: number;
  y: number;
  progress: MotionValue<number>;
  stop: number;
  reducedMotion: boolean;
}) {
  const from = Math.max(0, stop - 0.02);
  const to = Math.min(1, stop + 0.02);
  const beatRange = [from, stop, to];
  const range: [number, number] = [from, to];

  const scale = useTransform(progress, beatRange, [1, 1.22, 1.06]);
  const logoOpacity = useTransform(progress, range, [0.32, 1]);
  // Mismo turquesa apagado que el resto del texto del sitio
  // (--text-secondary, #52777a), no un tono casi negro.
  const numberColor = useTransform(progress, range, ["rgba(82, 119, 122, 0.45)", "#52777a"]);

  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute z-10 block h-10 w-10 -translate-x-1/2 -translate-y-1/2 md:h-[52px] md:w-[52px]"
      style={reducedMotion ? { left: x, top: y } : { left: x, top: y, scale }}
    >
      {/* Disco blanco SOLO dentro del hueco del anillo (inset-[24%]), no
          detrás de todo el nodo: tapa la línea punteada para que el
          número se lea, sin generar la aureola blanca que quedaba
          cuando el fondo y el halo desbordaban el logo. */}
      <span className="absolute inset-[24%] rounded-pill bg-white" />

      <motion.span
        className="absolute inset-0 block translate-y-[11%]"
        style={reducedMotion ? { opacity: 1 } : { opacity: logoOpacity }}
      >
        <Image src="/logo.png" alt="" fill sizes="52px" className="object-contain" />
      </motion.span>

      {/* El número va perfectamente centrado y el LOGO se corre un poco
          hacia abajo (arriba, `translate-y`): el hueco del anillo no está
          centrado -- la ola ocupa su mitad inferior -- así que en vez de
          subir el número (que al escalar se despegaría del centro y se
          vería descolocado durante el latido) se baja el logo. Así el
          número queda en el eje del nodo y crece con él sin desviarse. */}
      <motion.span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-bold leading-none md:text-[12px]"
        style={reducedMotion ? { color: "#52777a" } : { color: numberColor }}
      >
        {number}
      </motion.span>
    </motion.span>
  );
}
