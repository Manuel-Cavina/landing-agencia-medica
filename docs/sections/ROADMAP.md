ROADMAP.md — Roadmap vertical de los siete pilares

Estado

EN ITERACIÓN. No aprobada — pendiente de revisión visual del cliente.

Propósito

Este documento describe con precisión técnica la sección "El sistema" (roadmap vertical y curvo de los siete pilares), para que cualquier persona o IA pueda modificarla sin tener que reinterpretar el código desde cero.

## Objetivo visual

Qué comunica: que el sistema de la agencia se construye a través de siete pilares que no son servicios aislados — cada uno resuelve una parte del proceso y prepara el siguiente. El recorrido vertical, curvo y progresivo (dibujado a medida que el usuario scrollea) refuerza esa idea de secuencia y conexión, no de catálogo de servicios.

Por qué alterna izquierda y derecha: para que el ojo recorra la página en un patrón de "S" en vez de una columna vertical monótona, y para que la curva tenga una razón visual de existir (conecta nodos que no están alineados). Cumple DEC-011/DEC-012 de `docs/DECISIONS.md`: curvas amplias, alternancia, y el pilar 7 a la derecha.

Relación con el resto de la landing: reemplaza en el mismo lugar (`id="sistema"`, después de "Resultados") a la sección interactiva "El ecosistema" construida en la tarea anterior. Reutiliza sus tokens visuales (`.glass-surface`, `--brand-*`, `--radius-lg`, `--shadow-soft`), su patrón de encabezado (igual al de "Resultados": eyebrow + h2 + descripción apilados) y su lenguaje de composición visual abstracta (círculo de vidrio con ícono + líneas conectadas + chip de categoría).

Elementos aprobados o pendientes: nada de esta sección está aprobado todavía (docs/AGENTS.md exige confirmación explícita del cliente). El contenido de los 7 pilares es PROVISIONAL (`docs/DECISIONS.md`, DEC-P01 y DEC-P04). No hay imágenes reales — todas las composiciones son abstractas (CSS + SVG).

## Mapa de componentes

### `content/pillars.ts`
- Responsabilidad: única fuente de verdad del contenido de los 7 pilares y de los tipos `Pillar` y `RoadmapIconName`.
- No es un componente: es un módulo de datos, importado tanto por `roadmap-section.tsx` (Server) como, indirectamente a través de props, por los componentes cliente.
- Datos que expone: `PILLARS: Pillar[]`, tipos `Pillar` y `RoadmapIconName`.

### `components/sections/roadmap-section.tsx`
- Server Component (sin `"use client"`).
- Responsabilidad: encabezado de la sección (eyebrow, `h2#roadmap-title`, descripción) + el `<ol>` semántico que mapea `PILLARS` a `<RoadmapStep>`.
- Recibe: nada (importa `PILLARS` directo).
- Devuelve: el `<section id="sistema" aria-labelledby="roadmap-title">` completo.
- Relación: renderiza `RoadmapStep` una vez por pilar, pasándole `pillar`, `index` y `total`.

### `components/roadmap/roadmap-step.tsx`
- Server Component (sin `"use client"`): no tiene hooks propios, solo decide layout.
- Responsabilidad: renderizar un `<li>` con la grilla CSS de la fila (2 columnas en móvil, 3 en tablet/escritorio), decidir si el pilar va a la izquierda o la derecha (`index % 2 === 0` → izquierda) y dejar el ancla invisible del carril (`data-roadmap-anchor`) que `RoadmapJourney` mide. No dibuja nada del recorrido.
- Recibe: `pillar: Pillar`, `index: number`, `total: number`.
- Devuelve: un `<li>` con dos hijos: el contenedor del segmento (`RoadmapSegment`) y el contenedor de la tarjeta (`RoadmapCard`), cada uno en la columna que le corresponde según el breakpoint.
- Relación: renderiza `RoadmapSegment` y `RoadmapCard` como hijos directos.

### `components/roadmap/roadmap-journey.tsx`
- Client Component (`"use client"`): usa `useRef`, `useLayoutEffect`, `useEffect`, `useState`, `useScroll`, `useSpring`, `useTransform`, `useReducedMotion`.
- Responsabilidad: dibujar **UNA sola línea continua** del nodo 01 al 07 y los siete nodos, por encima de toda la lista.
- Recibe: `children` (el `<ol>` completo) y `total: number`.
- Devuelve: un `<div className="relative">` con un `<svg>` decorativo superpuesto, los siete nodos absolutos, y los children.
- Relación: envuelve al `<ol>` que arma `roadmap-section.tsx`; mide las anclas que deja cada `RoadmapStep`.

**Por qué un solo SVG y no uno por fila**: la versión anterior tenía un `roadmap-segment.tsx` por fila, cada uno con su propio `useScroll` y su propio resorte. Aunque cada tramo se dibujara bien por separado, nunca se leían como UNA línea: cada uno avanzaba a su ritmo y en las costuras entre filas se notaba el corte. Ahora hay un único `<path>`, un único `useScroll` sobre todo el recorrido y un único `stroke-dashoffset` animándose.

**Cómo se arma la geometría**: las filas NO miden todas lo mismo (cada tarjeta tiene su alto, y crece al abrir "Ver más"), así que las coordenadas no pueden ser porcentajes fijos — se MIDEN en píxeles reales. Cada `<li>` deja un ancla invisible en su carril (`[data-roadmap-anchor]`, un `div` de alto 0), y `RoadmapJourney` lee su posición para construir el `d`. Un `ResizeObserver` sobre el contenedor y sobre cada `<li>` rehace la medición cuando algo cambia de alto, así que la línea sigue siempre a los nodos. Como el `viewBox` queda 1:1 con los píxeles reales (sin `preserveAspectRatio="none"` estirando nada), el `stroke-dasharray` se comporta de forma predecible y el grosor no se distorsiona.

### `components/roadmap/roadmap-card.tsx`
- Client Component (`"use client"`): usa `useState`, `useId`, `useReducedMotion` y el componente `motion.div`.
- Responsabilidad: la tarjeta completa de un pilar — metadatos siempre visibles, composición visual, disclosure "Ver más"/"Ver menos", y la animación de entrada (una sola vez, al entrar en el viewport).
- Recibe: `pillar: Pillar`, `side: "left" | "right"` (controla la dirección del desplazamiento de entrada).
- Devuelve: un `<article class="glass-surface ...">` (envuelto en `motion.div` si no hay `prefers-reduced-motion`).
- Relación: renderiza `RoadmapVisual`.

### `components/roadmap/roadmap-visual.tsx`
- Sin `"use client"` propio (no usa hooks); al ser importado desde `roadmap-card.tsx` ("use client"), de todas formas viaja en el bundle de cliente — la ausencia de la directiva no es un error, solo dice que el archivo en sí no *necesita* ser cliente.
- Responsabilidad: la composición visual abstracta de cada pilar (o la imagen real, si `pillar.image` existe).
- Recibe: `pillar: Pillar`.
- Devuelve: un `<div aria-hidden="true">` con el círculo de ícono, las líneas decorativas y el chip de categoría.

## Sistema de datos

### Estructura de `Pillar` (`content/pillars.ts`)

```ts
export type RoadmapIconName =
  | "sparkles" | "users" | "network" | "bot"
  | "clipboard" | "calendar" | "chart";

export type Pillar = {
  id: string;
  slug: string;
  number: string;        // "01".."07"
  title: string;
  category: string;
  summary: string;       // descripción breve, siempre visible en la tarjeta
  description: string;   // descripción completa, dentro del disclosure
  solves: string;        // "Qué resuelve"
  deliverables: string[]; // "Qué construimos"
  enables: string;        // "Qué habilita"
  iconName: RoadmapIconName;
  image?: string;
};
```

`iconName` es una clave serializable, no el componente de Lucide. Motivo: `roadmap-section.tsx` (Server) le pasa cada `pillar` como prop a `roadmap-step.tsx` y de ahí a componentes cliente — React no puede serializar funciones/componentes al cruzar esa frontera. El ícono real se resuelve recién dentro de `roadmap-visual.tsx`, vía el mapa `ICONS: Record<RoadmapIconName, LucideIcon>`.

Cómo editar textos: modificar directamente el objeto correspondiente en `PILLARS` (array en `content/pillars.ts`). No hay que tocar ningún componente.

Cómo agregar o quitar un pilar: agregar/quitar un objeto del array `PILLARS`. `DESKTOP_NODE_POSITIONS` en `roadmap-journey.tsx` tiene 7 valores fijos — si el número de pilares cambia, hay que ajustar ese array a la nueva cantidad de posiciones (ver "Parámetros editables").

Cómo cambiar un ícono: cambiar el valor de `iconName` a otra de las 7 claves de `RoadmapIconName`, o agregar una nueva clave + su entrada en el mapa `ICONS` de `roadmap-visual.tsx`.

Cómo incorporar una imagen real: agregar `image: "/ruta-en-public.jpg"` al pilar correspondiente. `RoadmapVisual` ya tiene la rama `if (pillar.image)` que renderiza `next/image` con `fill` + `object-cover` dentro de un contenedor de alto fijo (`h-36 sm:h-44`) en vez de la composición abstracta — no hace falta tocar nada más.

## Construcción de la curva

Un solo `<svg>` para todo el recorrido, en `roadmap-journey.tsx`. Su `viewBox` es `0 0 <ancho real> <alto real>` del contenedor — es decir, **1:1 con los píxeles de pantalla**, sin `preserveAspectRatio="none"` estirando nada. Eso es lo que hace que el `stroke-dasharray` se comporte de forma predecible y que el grosor del trazo no se distorsione.

Posiciones de los nodos: `DESKTOP_NODE_POSITIONS = [28, 74, 28, 74, 28, 74, 28]` (en `roadmap-journey.tsx`), un valor por pilar, como porcentaje del ancho del ANCLA de su fila. En escritorio y móvil el ancla mide todo el ancho de la fila, así que la curva barre ~28% → ~74% de la página y el nodo cae en la mitad libre, del lado opuesto a la tarjeta.

Paridad de las tarjetas: `isLeft = index % 2 === 1` en `roadmap-step.tsx`, o sea que los pilares impares (01, 03, 05, 07) van a la DERECHA y los pares (02, 04, 06) a la izquierda, siguiendo el boceto del cliente. Esto también satisface DEC-012 de `docs/DECISIONS.md` ("el pilar 7 se posiciona a la derecha"), que la versión anterior contradecía. Los nodos van siempre en la mitad opuesta a la tarjeta, así que nunca se superponen.

Medición en píxeles reales, no porcentajes: las filas NO miden todas lo mismo, así que las coordenadas se miden. Cada `<li>` deja un `<div data-roadmap-anchor>` de alto 0 en su carril; `RoadmapJourney` lee `getBoundingClientRect()` de las siete anclas y calcula, para cada nodo `i`:

```ts
x = anchorRect.left - containerRect.left + anchorRect.width * (POSITIONS[i] / 100)
y = anchorRect.top - containerRect.top
```

Escritorio vs. móvil se distingue por el ancho del ancla (`< 60px` = carril angosto = móvil), no por `window.innerWidth`. La medición corre en un efecto (solo cliente), así que no hay riesgo de desajuste de hidratación: el primer render del servidor simplemente no dibuja ningún path (`size.width === 0`), y el SVG aparece tras la primera medición.

Función que arma el path (`buildPath`, en `roadmap-journey.tsx`) — genera **un solo `d`** encadenando curvas de Bézier a través de los siete puntos:

```ts
let d = `M ${points[0].x} ${points[0].y}`;
for (let i = 0; i < points.length - 1; i++) {
  const from = points[i], to = points[i + 1];
  const bend = (to.y - from.y) * BEND_FACTOR;   // BEND_FACTOR = 0.55
  d += ` C ${from.x} ${from.y + bend}, ${to.x} ${to.y - bend}, ${to.x} ${to.y}`;
}
```

Los puntos de control comparten la X de su nodo, así que la curva sale y entra en vertical de cada nodo: los tramos se encadenan sin quiebres visibles. `BEND_FACTOR` controla cuán marcada es la S (más alto = más curva; más bajo = tiende a la diagonal recta). El path empieza exactamente en el nodo 01 y termina exactamente en el 07, sin ningún tramo colgando.

Reactividad al cambio de alto: un `ResizeObserver` observa el contenedor **y cada `<li>`** (abrir un "Ver más" cambia el alto de una fila), más un listener de `resize` de ventana. Cualquiera de esos eventos vuelve a medir y regenera el `d`, así que la línea sigue siempre a los nodos.

Línea base: el mismo `d`, con `stroke="rgba(70, 176, 186, 0.45)"`, `strokeWidth="2"` y `strokeDasharray="2 10"` — **punteada**, estilo roadmap, visible por completo desde el primer render (no depende del scroll ni de Motion).

Línea de progreso: el mismo `d` otra vez, sólida, con un degradé (`<linearGradient>` de `#46b0ba` a `#78cfd3`), `strokeWidth="3.5"`, `strokeLinecap="round"` y `strokeLinejoin="round"`.

**Por qué NO usa el prop `pathLength` de Motion** (bug real, encontrado inspeccionando el DOM): `style={{ pathLength: progress }}` es la forma "oficial" de Motion de animar el dibujado de un trazo, pero internamente escribe `stroke-dasharray`/`stroke-dashoffset` como CSS con unidad `px` (ej. `"0.995px, 1px"`), lo que se interpreta en píxeles reales de pantalla. En la arquitectura anterior (un SVG por fila, con `viewBox` cuadrado estirado no uniformemente) eso no correspondía al largo real del trazo y el patrón de guiones se repetía decenas de veces: se veía como una línea de puntos. Se reemplaza por la técnica clásica de "dibujado de línea":

```tsx
const totalLength = pathRef.current.getTotalLength();   // medido una vez
const dashOffset = useTransform(progress, (v) => pathLength * (1 - v));

<motion.path
  ref={pathRef}
  d={d}
  strokeDasharray={pathLength}
  style={{ strokeDashoffset: dashOffset }}
/>
```

Un solo guion del largo total del trazo, y el offset animándose de `totalLength` a `0`: la línea se dibuja de corrido, del 01 al 07.

Umbrales de los nodos: para que cada nodo se encienda exactamente cuando la línea lo alcanza, `RoadmapJourney` mide también la fracción del largo total en la que cae cada uno. Lo hace creando un `<path>` desprendido del DOM, asignándole el sub-path hasta el nodo `i`, y midiendo su `getTotalLength()`. Eso da un array `nodeStops` de 0 a 1 que cada `RoadmapNode` usa como rango de activación — no es una estimación.

## Sistema de Motion

Paquete usado: `motion/react` (el mismo que ya usa el resto del sitio en `components/motion/reveal.tsx`) — no se instaló nada nuevo. `package.json` ya tenía `"motion": "^13.1.1"`.

Qué elemento observa `useScroll`: **uno solo**, el `<div ref={containerRef}>` de `RoadmapJourney`, que envuelve todo el recorrido. Un único progreso alimenta la línea entera y los siete nodos — por eso la línea se lee como una sola pieza y no como siete tramos avanzando cada uno por su cuenta.

Offsets usados: `["start 82%", "end 55%"]` — el progreso arranca en 0 cuando el borde superior del recorrido llega al 82% de la altura del viewport y llega a 1 cuando su borde inferior pasa el 55%.

Qué produce `useTransform`: dos usos distintos.
1. El offset del trazo: `dashOffset = useTransform(progress, (v) => pathLength * (1 - v))`.
2. Los cuatro valores de cada nodo, en `RoadmapNode`, sobre el rango `[stop - 0.015, stop + 0.015]` (donde `stop` es la fracción del trazo en la que cae ese nodo):
   - `scale`: `1 → 1.06`.
   - `borderColor`: `"rgba(70, 176, 186, 0.4)" → "#46b0ba"`.
   - `numberColor`: `"rgba(47, 127, 135, 0.5)" → "#2f7f87"`.
   - `halo`: `"0 0 0 0 rgba(70, 176, 186, 0)" → "0 0 0 7px rgba(70, 176, 186, 0.18)"` (como `box-shadow` interpolado).

Todos se aplican directo como `style` de un `motion.span` / `motion.path`, nunca como estado de React — por eso todo se "activa" de forma continua y suave sin un re-render de React en cada frame de scroll.

Dónde se usa `useSpring`: `progress = useSpring(scrollYProgress, { stiffness: 90, damping: 30, mass: 0.4 })`, en `roadmap-journey.tsx`. Suaviza el valor crudo de `scrollYProgress` para que la línea y los nodos se muevan con una inercia leve en vez de saltar.

Cómo se anima el dibujado de la línea: NO con el prop `pathLength` de Motion (ver "Construcción de la curva"). En su lugar se mide `getTotalLength()` del path completo y se anima `strokeDashoffset` como `MotionValue`.

Cómo aparecen las tarjetas: `RoadmapCard` envuelve el contenido en `motion.div` con `initial={{ opacity: 0, x: ±18, y: 16 }}`, `whileInView={{ opacity: 1, x: 0, y: 0 }}`, `viewport={{ once: true, margin: "-80px" }}`, `transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}`. El signo de `x` depende de `side`.

Cómo se activan los nodos: cada `RoadmapNode` recibe su `stop` (la fracción exacta del trazo donde está, medida con sub-paths) y se enciende en una ventana estrecha alrededor de ese valor — así el encendido coincide con el momento en que la línea llega al nodo. No hay estado booleano "activo/inactivo": es un continuo.

Qué ocurre al volver hacia arriba: `scrollYProgress` (y por lo tanto `progress`, el `dashOffset` y los valores de los nodos) es bidireccional por naturaleza — al scrollear hacia arriba, la línea se "des-dibuja" y los nodos se apagan. Es intencional y no requiere código extra. Las TARJETAS, en cambio, no retroceden: `viewport={{ once: true }}` en `roadmap-card.tsx` las deja en `opacity: 1` para siempre una vez que aparecieron.

Qué sucede con movimiento reducido: `useReducedMotion()` se chequea en `roadmap-journey.tsx` y en `roadmap-card.tsx`.
- En `roadmap-journey.tsx`: si es `true`, la línea sólida se renderiza como un `<path>` plano (sin `strokeDasharray` ni `strokeDashoffset`), así que el recorrido completo queda visible de entrada; los nodos usan `style` fijos en vez de los `useTransform`.
- En `roadmap-card.tsx`: si es `true`, se devuelve `cardBody` directo, sin el `motion.div` envolvente — la tarjeta aparece de entrada, sin ningún desplazamiento ni fade.
- Los hooks de Motion (`useScroll`, `useSpring`, `useTransform`) se siguen llamando siempre (nunca condicionalmente, para no violar las reglas de hooks de React) — lo que cambia es si su resultado se usa o no en el `style` final.

## Responsive

Grilla de escritorio (`lg:`, ≥1024px): `grid-template-columns: minmax(0,1fr) clamp(180px,15vw,250px) minmax(0,1fr)`. El ancla del carril va siempre en la columna 2. La tarjeta va en la columna 1 si `isLeft` (`md:col-start-1`) o en la columna 3 si no (`md:col-start-3`).

Comportamiento en tablet (`md:`, 768-1023px): misma alternancia que escritorio, con un carril algo más angosto: `clamp(110px, 11vw, 170px)`. Como los nodos se ubican por porcentaje del ancho del carril, la curva se comprime horizontalmente sola — no hay una variante de código aparte.

Móvil (base, <768px): la fila usa una tarjeta de ancho `calc(100% - 3.5rem)`, alternada a izquierda o derecha para dejar espacio visual del lado opuesto al nodo. El ancla ocupa toda la fila y se mantienen las posiciones de `DESKTOP_NODE_POSITIONS`, por lo que la línea conserva la curva completa también en pantallas angostas; la geometría se mide en píxeles reales dentro de un efecto de cliente.

Clases/breakpoints usados: los de Tailwind por defecto (`md:` = 768px, `lg:` = 1024px), sin breakpoints custom.

Cómo se evita el overflow: `components/sections/roadmap-section.tsx` tiene `overflow-x-clip` en el `<section>`. Antes de que una tarjeta del lado derecho entre en el viewport, su `motion.div` está en su estado `initial` (`x: +18px` sin animar), y en móvil eso empujaba el ancho de la página unos px más allá del viewport (confirmado con Playwright, comparando `document.documentElement.scrollWidth` contra `window.innerWidth`). Se contiene ahí, solo en el eje horizontal. `clip` en vez de `hidden`: recorta igual pero no convierte la sección en un contenedor con semántica de scroll.

Cómo se evita la hidratación incorrecta: toda la geometría se calcula en un efecto (solo cliente), nunca durante el render. El primer render del servidor no dibuja ningún path (`size.width === 0`), así que el HTML del servidor y el del cliente coinciden; el SVG aparece tras la primera medición.

## Disclosure

Estado abierto/cerrado: `const [isOpen, setIsOpen] = useState(false)` en `roadmap-card.tsx`, independiente por tarjeta (no hay estado compartido/exclusivo entre tarjetas — pueden estar varias abiertas a la vez).

Atributos ARIA: el botón real (`<button type="button">`) lleva `aria-expanded={isOpen}` y `aria-controls={contentId}`, donde `contentId = useId()` genera un id único y estable por instancia de componente, sin colisiones entre las 7 tarjetas.

Animación: técnica CSS `grid-template-rows: 0fr → 1fr` (se anima con `transition-[grid-template-rows] duration-500`). El contenido interno vive en un `<div className="overflow-hidden">` dentro del `<div style={{ gridTemplateRows }}>`. Con `0fr`, la fila de grid mide 0px y el contenido (que sigue en el DOM) queda visualmente colapsado; con `1fr`, la fila crece hasta el alto natural del contenido. Esta técnica evita tener que medir `scrollHeight` en JavaScript (no hay `ResizeObserver` ni lectura de layout) y mantiene el contenido en el DOM incluso "cerrado" (legible para buscadores y lectores de pantalla que naveguen por encabezados, aunque visualmente esté colapsado).

Adaptación de la línea cuando cambia la altura: al abrir un disclosure, la fila crece; el `ResizeObserver` de `RoadmapJourney` (que observa el contenedor **y cada `<li>`**) dispara una nueva medición de las siete anclas, se regenera el `d` del path y se vuelve a medir su largo. La línea y los nodos siguen a las filas sin quedar desalineados.

## Accesibilidad

Estructura semántica: `<section id="sistema" aria-labelledby="roadmap-title">` → `<h2 id="roadmap-title">` → `<ol className="list-none">` → 7 `<li>` → cada uno con un `<h3>` (el título del pilar) dentro de su `<article>`.

Navegación por teclado: los 7 botones "Ver más"/"Ver menos" son `<button type="button">` reales, alcanzables con Tab en el orden natural del DOM (01 a 07), y activables con Enter/Espacio (comportamiento nativo del elemento, sin `onKeyDown` custom).

Orden de lectura: coincide siempre con `01 → 02 → 03 → 04 → 05 → 06 → 07`, sin importar el layout visual (izquierda/derecha) — la alternancia es puramente de posición en la grilla (`col-start-1` / `col-start-3`), no de orden en el DOM.

Tratamiento de SVG: el `<svg>` del recorrido y los siete `<span>` de nodo llevan `aria-hidden="true"` — son decorativos; toda la información (número, categoría, título, textos) existe como texto HTML real dentro de cada tarjeta.

Movimiento reducido: ver "Sistema de Motion", última sección. Nada de la información o la funcionalidad depende de que la animación se ejecute.

## Rendimiento

Qué se anima: `opacity`, `transform` (incluye `x`, `y`, `scale`) y `stroke-dashoffset` en los elementos de Motion; `grid-template-rows` (con transición CSS, no Motion) en el disclosure.

Costo de la medición: `getBoundingClientRect()` y `getTotalLength()` corren solo al montar y cuando algo cambia de tamaño (`ResizeObserver` / `resize`), nunca en cada frame de scroll. El scroll en sí solo mueve `MotionValue`s.

Qué NO se anima: no hay animación de `width`/`height` de layout salvo la del disclosure (deliberada, con la técnica `0fr`/`1fr` que evita relayout costoso de medir a mano), no hay `filter: blur()` animado, no hay parallax.

Cómo se evitan renders por scroll: los valores derivados de `useTransform` se escriben directo en el DOM por Motion (vía su sistema de `MotionValue`), sin pasar por el ciclo de render de React. No se usa `useMotionValueEvent` para sincronizar nada con `setState` — eso sí generaría un render de React en cada frame de scroll.

Cómo se limita el glassmorphism: cada tarjeta usa `.glass-surface` (definida una sola vez en `app/globals.css`) — 7 instancias en total, cada una con su propio `backdrop-filter: blur(20px)`, igual que ya hacían las tarjetas de "Resultados". No hay `backdrop-filter` sobre superficies grandes (el fondo de la sección es blanco liso, sin vidrio).

Por qué no se usó canvas ni una librería adicional: el trayecto es un puñado de curvas Bézier simples, algo para lo que SVG + CSS ya alcanza y es más liviano que levantar un contexto de canvas (que además exigiría redibujar manualmente en cada resize/scroll). No se instaló ninguna dependencia nueva — se usó `motion/react`, ya presente en `package.json` (`"motion": "^13.1.1"`) y ya usado en `components/motion/reveal.tsx`.

## Parámetros editables

| Qué cambiar | Dónde |
|---|---|
| Amplitud de la curva (escritorio/tablet) | `DESKTOP_NODE_POSITIONS` en `components/roadmap/roadmap-journey.tsx` — pero el efecto real depende también del ancho del carril (fila de abajo) |
| Cuán marcada es la S de la curva | `BEND_FACTOR` en `components/roadmap/roadmap-journey.tsx` |
| Velocidad/inercia de la línea al scrollear | `SPRING_CONFIG` en `components/roadmap/roadmap-journey.tsx` |
| Cuándo empieza/termina de dibujarse la línea | El array `offset` del `useScroll` en `components/roadmap/roadmap-journey.tsx` |
| Ventana de encendido de cada nodo | El `range` dentro de `RoadmapNode` (`roadmap-journey.tsx`), actualmente `stop ± 0.015` |
| Punteado de la línea base | El `strokeDasharray="2 10"` del primer `<path>` en `roadmap-journey.tsx` |
| Color/grosor de la línea base y de progreso | Los `stroke`/`strokeWidth` de los `<path>` en `components/roadmap/roadmap-journey.tsx`, y los `<stop>` del `<linearGradient>` |
| Tamaño de los nodos | Las clases `h-8 w-8 md:h-10 md:w-10` en `RoadmapNode` (`roadmap-journey.tsx`) |
| Ancho del carril central | Los `clamp(...)` dentro de `grid-template-columns` en `components/roadmap/roadmap-step.tsx` (uno para `md:`, otro para `lg:`) — **este es el parámetro que más cambia cuánto serpentea la línea** |
| Altura mínima de cada fila | Las clases `min-h-[280px] sm:min-h-[300px] lg:min-h-[340px]` en `components/roadmap/roadmap-step.tsx` |
| Ancho de las tarjetas | Determinado por `minmax(0,1fr)` en `grid-template-columns` (`roadmap-step.tsx`) — no hay un ancho fijo propio de la tarjeta |
| Duración/easing de la aparición de tarjetas | `CARD_EASE` y `CARD_DURATION_SECONDS` en `components/roadmap/roadmap-card.tsx` |
| Duración del disclosure | La clase `duration-500` en el `<div>` de `grid-template-rows` (`roadmap-card.tsx`) |
| Textos, categorías, íconos, "qué construimos"/"qué habilita" | `content/pillars.ts` |
| Ícono de un pilar | Cambiar `iconName` en `content/pillars.ts` a otra clave de `RoadmapIconName`, o agregar una nueva clave + entrada en `ICONS` (`components/roadmap/roadmap-visual.tsx`) |
| Composición visual abstracta | `components/roadmap/roadmap-visual.tsx` (rama `else`, cuando no hay `pillar.image`) |

## Diferencias respecto del boceto del cliente

- **Tipografía**: el boceto usa una serif elegante para los títulos de los pilares. Se mantiene Inter por decisión explícita del cliente (consultado antes de implementar) y por coherencia con `docs/DESIGN_SYSTEM.md`, que reserva el serif como acento puntual y nunca en las siete tarjetas.
- **Ilustraciones**: el boceto tiene renders 3D por pilar (un cristal, una copa con esferas, una red molecular, cubos de vidrio, un río). Esos archivos no existen en el proyecto. Por decisión del cliente se armó el layout con un placeholder explícito (`components/roadmap/roadmap-visual.tsx`): misma proporción y posición, con el ícono del pilar y la etiqueta visible "Imagen pendiente". Cuando lleguen las ilustraciones reales, alcanza con completar el campo `image` de cada pilar en `content/pillars.ts`.
- **Marcador "INICIO"**: el boceto lo muestra arriba del nodo 01. No se implementó — el cliente no lo pidió al consultarlo.
- El halo "suave" del nodo activo se implementó como un `box-shadow` interpolado (`0 0 0 0` → `0 0 0 8px`), no como una capa extra con blur — cumple el mismo propósito con menos elementos en el DOM.
