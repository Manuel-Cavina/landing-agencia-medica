# ROADMAP_MOTION_AUDIT.md — Auditoría de Motion y animaciones

Estado: **AUDITORÍA DE INSPECCIÓN**, con una ronda de correcciones posterior. La sección **no** está aprobada.

Fecha de la auditoría: 2026-08-27.

> ## ⚠️ Addendum del 2026-08-27 (posterior a la auditoría)
>
> El cuerpo de este documento describe el estado **en el momento de auditar**. Después, a pedido del cliente, se corrigieron tres puntos. El resto del documento **no** se reescribió: sirve como registro de lo que se encontró y de cómo se lo verificó.
>
> | Hallazgo | Estado ahora | Corrección aplicada |
> |---|---|---|
> | **P0** — la línea nunca se dibuja | ✅ **CORREGIDO** | Ver abajo |
> | **P3** — nodos anclados al tope de la fila | ✅ **CORREGIDO** | Ver abajo |
> | Progreso que no llegaba a 1 | ✅ **CORREGIDO** (hallazgo nuevo, surgido al arreglar el P0) | Ver abajo |
>
> ### 1. P0 — dibujado progresivo
>
> El diagnóstico de §7 era correcto en el síntoma pero incompleto en la causa. Se probaron dos variantes y **ninguna** funcionó:
>
> 1. `useTransform(progress, v => pathLength * (1 - v))` — closure (la original).
> 2. `useTransform(progress, [0, 1], [pathLength, 0])` — forma de arrays. Medido: `dashoffset 0px` en las 5 posiciones, igual que antes.
>
> La causa real es más general: **Motion se suscribe al valor derivado una sola vez, con el transformador del primer render**. Cualquier transformador que dependa de `pathLength` —que arranca en `0` y recién se mide en un `useEffect`— queda calculando contra `0` para siempre, sea closure o arrays.
>
> Esto también explica por qué los nodos *parecían* funcionar: su `stop` tiene un **fallback razonable** (`index / (total - 1)`, o sea posiciones equiespaciadas), no `0`. Animaban con el fallback, no con la medición real.
>
> Corrección: eliminar por completo la dependencia de la geometría en el transformador, usando el atributo SVG `pathLength="1"` para normalizar el trazo:
>
> ```tsx
> const dashOffset = useTransform(progress, [0, 1], [1, 0]);   // constantes
>
> <motion.path pathLength={1} strokeDasharray={1} style={{ strokeDashoffset: dashOffset }} />
> ```
>
> `getTotalLength()` no se ve afectado por ese atributo, así que la medición de `nodeStops` sigue siendo válida. El estado `pathLength` quedó sin uso y se eliminó.
>
> ### 2. Progreso que no llegaba a 1 (hallazgo nuevo)
>
> Con el P0 ya corregido apareció un segundo defecto que antes quedaba tapado: el trazo se detenía en **92%** y el nodo 07 nunca se encendía, incluso tras 4 s de asentamiento al final de la página.
>
> Causa: el offset era `["start 82%", "end 55%"]`, o sea que el progreso llega a 1 cuando el pie del recorrido sube hasta la mitad de la ventana. Pero **el roadmap es hoy la última sección de la página**, así que el scroll se termina antes de que eso pueda ocurrir. Corregido a `["start 82%", "end 100%"]`.
>
> ### 3. P3 — nodos al centro vertical de la tarjeta
>
> Los nodos estaban anclados al tope de la fila; en el boceto están a media altura de su tarjeta, que es donde cae el punto máximo de cada arco. `measure()` ahora itera sobre `ol > li` y calcula la Y con el padding de la fila:
>
> ```js
> const cardHeight = rowRect.height - padTop - padBottom;
> y = rowRect.top + padTop + cardHeight / 2 - containerRect.top;
> ```
>
> Se usa el padding en vez de medir el `<article>` porque `getBoundingClientRect()` incluiría el transform de entrada de Motion (`y: 16`), y el nodo se correría según si la tarjeta ya animó o no.
>
> ### Verificación posterior a las correcciones
>
> Dibujado progresivo a 1440 px:
>
> | scroll | dashoffset | dibujado | nodos encendidos |
> |---|---|---|---|
> | 0% | `1.000` | 0% | 0 |
> | 25% | `0.722` | 28% | 2 |
> | 50% | `0.443` | 56% | 4 |
> | 75% | `0.162` | 84% | 5 |
> | 100% | `0.001` | 100% | 6 |
>
> Al final del recorrido, tras asentarse: **100% dibujado, 7 de 7 nodos encendidos**.
>
> Centrado de nodos a 1440 px (desfase contra el centro de la tarjeta): `0, 0, 0, 0, 0, 0, 0`.
>
> Otros anchos (1280 / 1024 / 768 / 390), al 40% del recorrido: 40% dibujado, 3 nodos encendidos y sin overflow en los cuatro.
>
> `npm run lint` y `npm run build` pasan limpios. Captura: `audit/final-curva.png`.
>
> **Sigue pendiente** (no se tocó): el encabezado que anima fuera de pantalla (P1), los conectores nodo-tarjeta inexistentes (P1), `hover:shadow-float` sin efecto (P2), la transición ausente en el desplazamiento del hover (P2) y las tarjetas omitidas por scroll de salto (P2).

Leyenda usada en todo el documento:

- ✅ `IMPLEMENTADO Y VERIFICADO`
- 🟡 `IMPLEMENTADO PARCIALMENTE`
- ❌ `NO IMPLEMENTADO`
- 🐛 `IMPLEMENTADO CON ERROR`
- ⚪ `INTENCIONALMENTE ESTÁTICO`
- ❓ `NO SE PUDO VERIFICAR`

---

## 0. Resumen ejecutivo

**El hallazgo más importante: la línea de progreso vinculada al scroll NO funciona.** El `stroke-dashoffset` permanece en `0px` en el 100% del recorrido, en las cinco posiciones de scroll medidas y también tras un scroll gradual real. El trazo sólido está dibujado al 100% desde el primer render y nunca se anima. Como consecuencia, el camino punteado de base queda tapado y nunca se ve.

Lo que **sí** funciona: la activación progresiva de los siete nodos, la entrada de las tarjetas con scroll real, el disclosure con re-medición de la curva, el movimiento reducido, el foco por teclado y el responsive sin overflow.

| Categoría | Estado |
|---|---|
| Línea activa vinculada al scroll | 🐛 |
| Camino base punteado | 🟡 (existe, pero queda invisible por el bug de arriba) |
| Nodos (activación progresiva) | ✅ |
| Entrada de tarjetas | 🟡 (correcta con scroll real; falla con scroll por salto) |
| Entrada del encabezado | 🐛 (ocurre fuera de pantalla) |
| Hover de tarjeta — desplazamiento | ✅ |
| Hover de tarjeta — sombra | 🐛 |
| Disclosure "Ver más" | ✅ |
| Ícono "+" (rotación) | ✅ |
| Composiciones internas | ⚪ |
| Movimiento reducido | ✅ |
| Responsive / overflow | ✅ |

---

## 1. Entorno

Comandos ejecutados y su salida real:

```bash
$ pwd
/c/Users/cavin/Proyectos/Pagina Uli/odisea

$ git rev-parse --show-toplevel
C:/Users/cavin/Proyectos/Pagina Uli/odisea

$ git branch --show-current
master

$ git log -1 --oneline
9ccd463 desarrollo de detalles en stadistic bar

$ git status --short
 M app/page.tsx
 M components/sections/hero.tsx
 M components/sections/stats-strip.tsx
 M package-lock.json
 M package.json
?? components/results/
?? components/roadmap/
?? components/sections/results-section.tsx
?? components/sections/roadmap-section.tsx
?? components/ui/animated-counter.tsx
?? content/pillars.ts
?? content/results.ts
?? docs/sections/
?? public/preview-photo-do-not-ship.jpeg
```

| Dato | Valor |
|---|---|
| Tipo de checkout | Local (no worktree) |
| URL auditada | `http://localhost:3000` |
| Puerto | 3000 |
| Comando de ejecución | `npm run dev` (servidor ya en ejecución; **no** se levantó una segunda instancia) |
| Verificación previa | `curl` devolvió `HTTP 200` antes de auditar |
| Navegador | Chromium vía Playwright `1.62.1` |
| Viewports auditados | 1440, 1280, 1024, 768, 390 (alto 900) |
| Next.js | `16.3.2` (declarada e instalada) |
| React / React-DOM | `19.2.8` |
| Paquete de animación | `motion` `13.1.1` |
| Importación usada | `from "motion/react"` (no `framer-motion`) |
| lucide-react | `1.34.0` |

Comprobación de la importación:

```
components/motion/reveal.tsx:14:   import { motion, useReducedMotion } from "motion/react";
components/roadmap/roadmap-card.tsx:31: import { motion, useReducedMotion } from "motion/react";
components/roadmap/roadmap-journey.tsx:34: import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
```

---

## 2. Componentes implicados

La lista del pedido incluía archivos que **no existen** en esta implementación. Contenido real de `components/roadmap/`:

```
roadmap-card.tsx     6614 bytes
roadmap-journey.tsx 11230 bytes
roadmap-step.tsx     2924 bytes
roadmap-visual.tsx   3258 bytes
```

No existen: `roadmap-segment.tsx`, `roadmap-marker.tsx`, `roadmap-disclosure.tsx`. El primero existió y fue eliminado al pasar a una única línea continua; los otros dos nunca se crearon (sus responsabilidades viven dentro de `roadmap-journey.tsx` y `roadmap-card.tsx`).

| Archivo | Componente / función | Server/Client | Responsabilidad visual | Responsabilidad de Motion |
|---|---|---|---|---|
| `components/sections/roadmap-section.tsx` | `RoadmapSection` | **Server** | Encabezado, halos de fondo, `<ol>` semántico, `overflow-x-clip` | Ninguna propia; delega en `Reveal` |
| `components/motion/reveal.tsx` | `Reveal` | Client | Envoltorio de entrada | `motion.div` con `initial`/`animate` (**no** `whileInView`) |
| `components/roadmap/roadmap-journey.tsx` | `RoadmapJourney` | Client | SVG único del recorrido; posiciona los 7 nodos | `useScroll`, `useSpring`, `useTransform`, `ResizeObserver` |
| `components/roadmap/roadmap-journey.tsx` | `RoadmapNode` (interno) | Client | Círculo con número | 5 × `useTransform` sobre el progreso global |
| `components/roadmap/roadmap-journey.tsx` | `buildPath` (función pura) | — | Genera el `d` encadenando 6 Bézier | Ninguna |
| `components/roadmap/roadmap-step.tsx` | `RoadmapStep` | **Server** | Grilla de la fila, paridad izq/der, ancla invisible | Ninguna |
| `components/roadmap/roadmap-card.tsx` | `RoadmapCard` | Client | Tarjeta completa, disclosure | `motion.div` con `whileInView`; transiciones CSS |
| `components/roadmap/roadmap-visual.tsx` | `RoadmapVisual` | (sin directiva) | Placeholder de imagen | Ninguna |
| `components/roadmap/roadmap-visual.tsx` | `PillarIcon` | (sin directiva) | Ícono del pilar | Ninguna |
| `content/pillars.ts` | `PILLARS`, tipos | — | Datos | Ninguna |

---

## 3. Cadena técnica scroll → interfaz

Existe **una sola** cadena para todo el recorrido (no una por segmento):

```
posición del scroll
→ useScroll({ target: containerRef, offset: ["start 82%", "end 55%"] })   [roadmap-journey.tsx:85-88]
→ scrollYProgress            (MotionValue<number>, 0→1)
→ useSpring(…, {stiffness:90, damping:30, mass:0.4})  → `progress`        [línea 89]
→ ┌─ useTransform(progress, v => pathLength * (1 - v)) → `dashOffset`     [línea 163]  🐛
  └─ useTransform(progress, range, [a,b]) × 5 por nodo                    [líneas 268-275]  ✅
→ style de <motion.path> y <motion.span>
→ DOM
```

| Eslabón | Detalle observado |
|---|---|
| Elemento observado | El `<div ref={containerRef} className="relative">` que envuelve el `<ol>`; medido en el navegador: alto real **3542 px** |
| Rango de scroll efectivo | `2039 px → 5824 px` (3785 px de recorrido) en viewport de 900 px |
| ¿Provoca render de React? | No en cada frame. Motion escribe en el DOM vía `MotionValue`. No hay `useMotionValueEvent` ni `setState` por scroll |
| Medición geométrica | `getBoundingClientRect()` en `measure()` y `getTotalLength()` en un `useEffect` dependiente de `[d, points]` — **no** por frame |
| Cleanup | `observer.disconnect()` + `removeEventListener("resize")` en el retorno del `useLayoutEffect` ✅ |
| Observers | 1 `ResizeObserver` observando el contenedor **y** cada `<li>`; se adjuntan una sola vez (`measure` es estable vía `useCallback([])`) |
| Al desmontar | Cleanup correcto; no quedan listeners |

**Nota sobre la rama de movimiento reducido**: cuando `useReducedMotion()` es `true`, el `<motion.path>` se reemplaza por un `<path>` plano y se monta además un tercer `<path>` invisible que sostiene el `pathRef` para poder medir. Verificado: en modo reducido hay **3** paths en el SVG.

---

## 4. Encabezado

Archivos: `components/sections/roadmap-section.tsx` (estructura) + `components/motion/reveal.tsx` (motion).

| Elemento | Componente | Trigger | initial | animate | transition | delay |
|---|---|---|---|---|---|---|
| Eyebrow "EL SISTEMA" | `Reveal` | **mount** | `{opacity:0, y:16}` | `{opacity:1, y:0}` | `duration: 0.8`, ease `[0.22,0.76,0.24,1]` | `0` |
| Título `h2#roadmap-title` | `Reveal` | **mount** | ídem | ídem | ídem | `0.12` |
| Descripción | `Reveal` | **mount** | ídem | ídem | ídem | `0.24` |
| Contenedor del `<ol>` | `Reveal` | **mount** | ídem | ídem | ídem | `0.36` |

No se usan `whileInView`, `variants`, `viewport.amount` ni `viewport.margin`: `Reveal` no los implementa.

### 🐛 Hallazgo: la animación del encabezado ocurre fuera de pantalla

Evidencia — 2,5 s después de cargar la página, **sin scrollear**:

```json
{ "opacity": "1", "transform": "none", "yRelViewport": 2504, "vh": 900, "yaVisibleEnPantalla": false }
```

El título está a 2504 px del tope del viewport (fuera de pantalla, viewport de 900 px) y ya terminó su animación (`opacity: 1`, `transform: none`). Como `Reveal` dispara con `animate` al montar —y el componente monta con la página entera—, la entrada se ejecuta mientras la sección todavía está muy por debajo del fold. **El usuario nunca ve esta animación.**

### Checklist del encabezado

| Ítem | Estado | Evidencia |
|---|---|---|
| El eyebrow aparece primero | 🟡 | Los delays (0 / 0.12 / 0.24) son correctos, pero se consumen fuera de pantalla |
| El título aparece después | 🟡 | Ídem |
| La descripción aparece después del título | 🟡 | Ídem |
| Desplazamiento ≤ 24 px | ✅ | `Y_OFFSET_PX = 16` en `reveal.tsx:17` |
| No existe escala agresiva | ✅ | Solo se animan `opacity` e `y` |
| No utiliza blur intenso | ✅ | Ninguna propiedad de filtro |
| Se ejecuta una sola vez | ✅ | `animate` en mount; no se repite |
| No desaparece al salir del viewport | ✅ | Estado final persistente |
| Funciona si se entra por ancla | ✅ | El contenido queda visible (la animación ya ocurrió) |
| Contenido visible tras hidratar | ✅ | `opacity: 1` medido |
| Accesible si Motion falla | ❓ | No se pudo simular un fallo de carga de Motion |
| Movimiento reducido elimina desplazamientos | ✅ | `reveal.tsx:39-41` devuelve un `<div>` plano |

---

## 5. Entrada de las tarjetas

Implementación única compartida por los siete pilares (`roadmap-card.tsx:120-130`):

```tsx
initial={{ opacity: 0, x: side === "left" ? -18 : 18, y: 16 }}
whileInView={{ opacity: 1, x: 0, y: 0 }}
viewport={{ once: true, margin: "-80px" }}
transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
```

| Dato | Valor |
|---|---|
| Elemento observado | El propio `motion.div` que envuelve el `<article>` |
| Hook | `whileInView` (IntersectionObserver interno de Motion) |
| Dirección | `x: -18` si la tarjeta va a la izquierda; `x: +18` si va a la derecha |
| Duración | 950 ms (dentro del rango 800-1100 pedido) |
| Easing | `[0.22, 1, 0.36, 1]` |
| Delay | Ninguno |
| `once` | `true` |

### Resultado con scroll gradual real (45 pasos de 120 px con `mouse.wheel`)

| pilar | opacity | transform |
|---|---|---|
| 01 | `1` | `none` |
| 02 | `1` | `none` |
| 03 | `1` | `none` |
| 04 | `1` | `none` |
| 05 | `1` | `none` |
| 06 | `1` | `none` |
| 07 | `1` | `none` |

✅ Las siete terminan exactamente en `x: 0`, `y: 0`, `opacity: 1`, sin transformaciones residuales.

### 🟡 Hallazgo: con scroll por salto, las tarjetas omitidas quedan invisibles

Evidencia — tras un `window.scrollTo()` directo al 45% del recorrido:

| pilar | opacity | transform |
|---|---|---|
| 01 | `0` | `matrix(1,0,0,1, 18, 16)` |
| 02 | `0` | `matrix(1,0,0,1,-18, 16)` |
| 03 | `1` | `none` |
| 04 | `1` | `none` |
| 05 | `0` | `matrix(1,0,0,1, 18, 16)` |
| 06 | `0` | `matrix(1,0,0,1,-18, 16)` |
| 07 | `0` | `matrix(1,0,0,1, 18, 16)` |

Solo las dos tarjetas que quedaron dentro del viewport tras el salto (03 y 04) animaron. Las 01 y 02, ya superadas, siguen en `opacity: 0`. Con scroll natural esto no ocurre; se recupera al volver a entrar en el viewport. Riesgo real acotado a: salto por ancla, recarga a mitad de sección, o restauración de scroll del navegador.

### Checklist de tarjetas

| Ítem | Estado | Evidencia |
|---|---|---|
| Oferta (01) entra desde la derecha | ✅ | Tarjeta a la DER, `x:+18` medido |
| Avatar (02) entra desde la izquierda | ✅ | Tarjeta a la IZQ, `x:-18` medido |
| Ecosistema (03) dirección correcta | ✅ | DER, `x:+18` |
| Asistente IA (04) dirección correcta | ✅ | IZQ, `x:-18` |
| Prevaloración (05) dirección correcta | ✅ | DER, `x:+18` |
| Conversión (06) dirección correcta | ✅ | IZQ, `x:-18` |
| Escala (07) dirección correcta | ✅ | DER, `x:+18` |
| Todas terminan en `x: 0` | ✅ | `transform: none` en las 7 |
| Todas terminan en `y: 0` | ✅ | Ídem |
| Sin transformaciones residuales | ✅ | Ídem |
| Ninguna genera scroll horizontal | ✅ | `scrollWidth <= innerWidth` en los 5 anchos |
| Ninguna queda invisible | 🟡 | Solo con scroll por salto (ver arriba) |
| Ocurre una sola vez | ✅ | `once: true` |
| Funciona con scroll lento | ✅ | Verificado con `mouse.wheel` |
| Funciona con scroll rápido | 🟡 | Ver el caso de salto |
| Funciona al entrar por enlace interno | 🟡 | Ídem |
| Sin flash de contenido invisible al hidratar | ❓ | No se instrumentó la ventana de hidratación |

---

## 6. Camino base

Un solo `<path>` para todo el recorrido (`roadmap-journey.tsx:184-191`).

Valores reales leídos del DOM a 1440 px:

| Atributo | Valor |
|---|---|
| `d` (inicio) | `M 336 0 C 336 278.3, 888 227.7 …` |
| `d` (fin) | `… 888 2808.3, 336 2757.7, 336 3036` |
| Curvas en el `d` | **6** (los 7 nodos encadenados en un único path) |
| `stroke` | `rgba(70, 176, 186, 0.45)` |
| `stroke-width` | `2` |
| `stroke-dasharray` (atributo) | `2 10` |
| `stroke-dasharray` (calculado) | `2px, 10px` |
| `stroke-dashoffset` (calculado) | `0px` |
| `stroke-linecap` | `round` |
| `stroke-linejoin` | `miter` (no se declara; valor por defecto) |
| `vector-effect` | *(ninguno)* |
| `pathLength` | *(ninguno)* |
| `getTotalLength()` | `4797.93` |
| `viewBox` del SVG | `0 0 1200 3542` |
| `preserveAspectRatio` | *(ninguno → `xMidYMid meet` por defecto)* |

No hay `stroke-dasharray` heredado: el valor viene del atributo propio del path.

### ⚠️ Contradicción entre el pedido de esta auditoría y el pedido del cliente

La sección 8 del pedido de auditoría exige que el camino base sea *"línea sólida, sin puntos, sin guiones"*. La implementación usa `stroke-dasharray="2 10"` (punteado) **porque el cliente lo pidió explícitamente**: *"empeza por la linea de puntos estilo roadmap del 1 al 7"*, y lo reconfirmó después: *"a medida que scrolleo se va llenando la linea de puntos"*. Se registra la discrepancia sin resolverla: el punteado es intencional, no un defecto.

### Checklist del camino base

| Ítem | Estado | Evidencia |
|---|---|---|
| `01 → 02` continuo | ✅ | Un único `d` con 6 curvas; no hay paths separados |
| `02 → 03` continuo | ✅ | Ídem |
| `03 → 04` continuo | ✅ | Ídem |
| `04 → 05` continuo | ✅ | Ídem |
| `05 → 06` continuo | ✅ | Ídem |
| `06 → 07` continuo | ✅ | Ídem |
| Sin huecos entre segmentos | ✅ | No existen segmentos: es un solo path |
| Sin tramo antes de `01` | ✅ | El `d` arranca en `M 336 0`, la posición del nodo 01 |
| Sin tramo después de `07` | ✅ | El `d` termina en `336 3036`, la posición del nodo 07 |
| ¿Sólido, sin guiones? | ⚪ | Punteado **a pedido explícito del cliente** (ver arriba) |
| No depende del scroll | ✅ | Sin `style` de Motion; se dibuja desde el primer render |
| Se adapta al disclosure abierto | ✅ | `getTotalLength()` 4798 → 5159 al abrir (ver §12) |
| Se adapta al redimensionamiento | ✅ | `ResizeObserver` + listener de `resize`; anchos de ancla 1200/944/720/30 medidos |
| Punteado en 1440 px | ✅ | `2px, 10px` |
| Punteado en 768 px | ✅ | `2px, 10px` |
| Punteado en 390 px | ✅ | `2px, 10px` |
| **Visible para el usuario** | 🐛 | Queda tapado por la línea sólida siempre al 100% (ver §7) |

---

## 7. 🐛 Línea activa vinculada al scroll — **P0, NO FUNCIONA**

Este es el hallazgo central de la auditoría.

### Evidencia 1 — barrido de las cinco posiciones de scroll

Rango medido: `scrollY 2039 → 5824`. Longitud del trazo: `4797.93`.

| Progreso | scrollY | `getTotalLength()` | dasharray (atributo) | dasharray (calculado) | dashoffset (calculado) | **Dibujado** |
|---:|---:|---:|---|---|---:|---:|
| 0% | 2039 | 4797.9 | `4797.9296875` | `4797.93px` | `0px` | **100%** |
| 25% | 2985 | 4797.9 | `4797.9296875` | `4797.93px` | `0px` | **100%** |
| 50% | 3931 | 4797.9 | `4797.9296875` | `4797.93px` | `0px` | **100%** |
| 75% | 4878 | 4797.9 | `4797.9296875` | `4797.93px` | `0px` | **100%** |
| 100% | 5824 | 4797.9 | `4797.9296875` | `4797.93px` | `0px` | **100%** |

El `stroke-dashoffset` es exactamente `0px` en las cinco posiciones. Para que el trazo se dibujara progresivamente debería ir de `4797.93` (nada dibujado) a `0` (todo dibujado).

### Evidencia 2 — tras un scroll gradual real

Después de 45 pasos de rueda de 120 px: `Línea dibujada: 100% | dashoffset: 0px`. No es un artefacto del scroll programático.

### Evidencia 3 — visual

`audit/f-linea-al-inicio.png`: posicionado en el nodo 01, con **solo 1 de 7 nodos encendidos**, la línea sólida ya está trazada de corrido pasando el nodo 02 y siguiendo fuera de cuadro. El punteado de base no se ve en ningún tramo.

### Causa raíz (análisis de código, `roadmap-journey.tsx:163`)

```tsx
const dashOffset = useTransform(progress, (value) => pathLength * (1 - value));
```

`pathLength` es estado de React, inicializado en `0` (línea 81) y actualizado recién dentro del `useEffect` de la línea 147. La función que recibe `useTransform` **captura `pathLength` por closure**. En el render inicial vale `0`, con lo cual la función calcula `0 * (1 - v) = 0` para cualquier valor de progreso. Cuando el estado pasa a `4797.93`, el `MotionValue` derivado no vuelve a crearse, y sigue evaluando la closure vieja → `dashOffset` queda clavado en `0` para siempre.

**Contraprueba dentro del mismo archivo**: los nodos usan la forma de *arrays* de `useTransform` (líneas 268-275), cuyo rango se recalcula por render a partir de `stop`. Esos **sí funcionan** (§8). El contraste entre ambos usos, en el mismo componente y con el mismo `progress`, aísla el problema al patrón de closure con estado capturado.

### Checklist de la línea activa

| Ítem | Estado | Evidencia |
|---|---|---|
| Comienza completamente oculta | 🐛 | Arranca al 100% dibujada |
| Se dibuja como trazo único | ✅ | `dasharray` = largo total, un solo guion, sin repetición |
| No aparece como patrón punteado | ✅ | `4797.93px` (valor único, no par de valores) |
| No repite el dash | ✅ | Ídem |
| El progreso corresponde al scroll | 🐛 | Constante en 100% en las 5 mediciones |
| No tiembla | ✅ | Al no animarse, no hay temblor |
| No rebota | ✅ | Ídem |
| No salta entre segmentos | ✅ | No hay segmentos |
| Llega exactamente al nodo siguiente | ✅ | El `d` pasa por los 7 puntos medidos |
| Retrocede al subir | 🐛 | No retrocede porque nunca avanza |
| Primer segmento funciona | 🐛 | Ídem |
| Segmentos intermedios funcionan | 🐛 | Ídem |
| Último segmento funciona | 🐛 | Ídem |
| Funciona con la tarjeta cerrada | 🐛 | Ídem |
| Funciona con "Ver más" abierto | 🐛 | Ídem |
| Se readapta tras cambiar la altura | ✅ | La **geometría** sí se recalcula (4798→5159) |
| Correcto tras redimensionar | ✅ | Geometría sí; animación no |
| Funciona en desktop / tablet / móvil | 🐛 | El mismo bug en los 5 anchos |

---

## 8. Nodos — ✅ funcionan correctamente

Implementación: `RoadmapNode` en `roadmap-journey.tsx:249-305`. Cinco `useTransform` en forma de array sobre el rango `[stop - 0.015, stop + 0.015]`, donde `stop` es la fracción del largo total del trazo en la que cae el nodo, medida con `getTotalLength()` sobre sub-paths (líneas 154-160).

| Propiedad | Pendiente → Alcanzado |
|---|---|
| `scale` | `1 → 1.06` |
| `borderColor` | `rgba(70,176,186,0.4) → #46b0ba` |
| `backgroundColor` | `rgba(255,255,255,0.95) → #46b0ba` |
| `color` (número) | `rgba(47,127,135,0.55) → #ffffff` |
| `boxShadow` (halo) | `0 0 0 0 transparente → 0 0 0 8px rgba(70,176,186,0.16)` |

### Evidencia — estado al 40% del scroll

| nodo | background | color | transform |
|---|---|---|---|
| 01 | `rgb(70, 176, 186)` | `rgb(255,255,255)` | `matrix(1.06, 0, 0, 1.06, 0, 0)` |
| 02 | `rgb(70, 176, 186)` | `rgb(255,255,255)` | `matrix(1.06, 0, 0, 1.06, 0, 0)` |
| 03 | `rgb(70, 176, 186)` | `rgb(255,255,255)` | `matrix(1.06, 0, 0, 1.06, 0, 0)` |
| 04 | `rgba(255,255,255,0.95)` | `rgba(47,127,135,0.55)` | `none` |
| 05 | `rgba(255,255,255,0.95)` | `rgba(47,127,135,0.55)` | `none` |
| 06 | `rgba(255,255,255,0.95)` | `rgba(47,127,135,0.55)` | `none` |
| 07 | `rgba(255,255,255,0.95)` | `rgba(47,127,135,0.55)` | `none` |

Tres encendidos y cuatro pendientes al 40%: la progresión responde al scroll. A la altura del nodo 01 se midió `nodosEncendidos: 1`.

### Centrado de los nodos

Riesgo evaluado: Tailwind v4 aplica `-translate-x-1/2 -translate-y-1/2` sobre la propiedad `translate`, mientras Motion escribe `scale` dentro de `transform`. Se comprobó que **conviven**:

| nodo | `translate` | `transform` | `left` | `top` |
|---|---|---|---|---|
| 01 | `-50% -50%` | `matrix(1.06,0,0,1.06,0,0)` | `336px` | `0px` |
| 02 | `-50% -50%` | `matrix(1.06,0,0,1.06,0,0)` | `888px` | `506px` |
| 03 | `-50% -50%` | `matrix(1.06,0,0,1.06,0,0)` | `336px` | `1012px` |

✅ No hay conflicto: el centrado se conserva mientras Motion escala.

### Checklist de nodos

| Ítem | Estado | Evidencia |
|---|---|---|
| Nodo 01 se activa correctamente | ✅ | Encendido a la altura del 01 |
| Nodos 02 y 03 se activan correctamente | ✅ | Encendidos al 40% |
| Nodos 04-07 permanecen pendientes hasta su turno | ✅ | Blancos al 40% |
| El número siempre resulta legible | 🟡 | En el punto medio de la transición el fondo y el texto pasan por tonos cercanos; es transitorio (~1 frame de scroll) |
| El halo no tapa la curva | ✅ | `rgba(...,0.16)`, translúcido |
| No hay pulsación infinita | ✅ | No hay `repeat` ni `keyframes` en el código |
| La activación coincide con la línea | ❓ | **No verificable**: la línea está siempre al 100% por el bug P0, así que no hay referencia contra la cual comparar |
| El estado no queda desincronizado | ✅ | Deriva del mismo `progress` |
| Comportamiento inverso definido | ✅ | `useTransform` es bidireccional por naturaleza |
| Movimiento reducido mantiene los nodos visibles | ✅ | Los 7 en `rgb(70,176,186)` |

---

## 9. Conectores nodo-tarjeta — ❌ NO EXISTEN

En la versión con `roadmap-segment.tsx` había un `<line>` conector por nodo. Ese archivo fue eliminado al pasar a la línea única, y **el conector no se reimplementó**. Búsqueda en el código actual: no hay ningún `<line>` en `roadmap-journey.tsx`.

Toda la sección 11 del pedido queda por lo tanto en ❌:

| Ítem | Estado |
|---|---|
| Conector de tarjeta izquierda apunta a la izquierda | ❌ |
| Conector de tarjeta derecha apunta a la derecha | ❌ |
| Sale visualmente desde el nodo | ❌ |
| No atraviesa el nodo | ❌ |
| No atraviesa la tarjeta | ❌ |
| Termina antes del borde | ❌ |
| Es visible | ❌ |
| No compite con la curva | ❌ |
| No desaparece por clipping | ❌ |
| Funciona en los siete pilares | ❌ |
| Se adapta al móvil | ❌ |
| Correcto con "Ver más" abierto | ❌ |

**Contexto**: con el layout actual el nodo está en la mitad opuesta a su tarjeta y a bastante distancia (≈420 px a 1440 px), replicando el boceto del cliente. Un conector corto ya no cubriría esa separación; requeriría un rediseño, no una restauración.

---

## 10. 🟡 Hover de las tarjetas — el desplazamiento funciona, la sombra no

Clases en `roadmap-card.tsx:47`: `transition-[box-shadow,border-color,transform] duration-slow ease-brand hover:-translate-y-[3px] hover:shadow-float`.

Evidencia:

```
antes:   {"translate":"none",     "boxShadow":"rgba(18, 63, 68, 0.08) 0px 16px 45px 0px", "borderColor":"rgba(70, 176, 186, 0.18)"}
después: {"translate":"0px -3px", "boxShadow":"rgba(18, 63, 68, 0.08) 0px 16px 45px 0px", "borderColor":"rgba(70, 176, 186, 0.18)"}
¿cambió translate? true | ¿cambió sombra? false
```

### 🐛 Causa raíz de la sombra

`.glass-surface` está definida en `app/globals.css` **fuera de cualquier `@layer`**. El CSS sin capa gana sobre las utilidades de Tailwind (que viven en `@layer utilities`), sin importar la especificidad. Su `box-shadow: var(--shadow-soft)` anula a `hover:shadow-float`. Es exactamente el mismo mecanismo que ya se había diagnosticado en las tarjetas de "Resultados", donde se resolvió con un `style` inline.

### 🐛 Segundo problema: la transición no cubre la propiedad animada

`transition-[box-shadow,border-color,transform]` no incluye `translate`. En Tailwind v4, `-translate-y-[3px]` escribe la propiedad **`translate`**, no `transform`. Por lo tanto el desplazamiento de 3 px ocurre **de golpe**, sin la transición lenta declarada.

### Checklist de hover

| Ítem | Estado | Evidencia |
|---|---|---|
| El hover es sutil | ✅ | 3 px |
| Desplazamiento ≤ 3-4 px | ✅ | `translate: 0px -3px` |
| No usa escala agresiva | ✅ | Sin `scale` |
| La sombra cambia suavemente | 🐛 | No cambia (anulada por `.glass-surface`) |
| El borde no parpadea | ✅ | No cambia |
| Al retirar el cursor vuelve | ✅ | `translate` vuelve a `none` |
| No desplaza otros elementos | ✅ | `translate` no afecta el layout |
| No es requisito en táctiles | ✅ | Solo estilo `:hover`; nada funcional depende de él |
| Movimiento reducido lo elimina | ❌ | No hay variante `motion-reduce:` en este hover |
| Transición aplicada al desplazamiento | 🐛 | `translate` no está en la lista de `transition-[...]` |

---

## 11. Disclosure "Ver más" — ✅ funciona

| Dato | Valor observado |
|---|---|
| Estado React | `useState(false)` por tarjeta, independiente (`roadmap-card.tsx:42`) |
| `aria-expanded` | `false` → `true` verificado |
| `aria-controls` | Presente, con id de `useId()` (único por instancia) |
| Texto del botón | "Ver más" → "Ver menos" verificado |
| Técnica de altura | `grid-template-rows: 0fr → 1fr` |
| Duración | `duration-500` |
| Easing | `ease-brand` |
| Overflow | `overflow-hidden` en el hijo |
| Movimiento reducido | `motion-reduce:transition-none` presente |

### Adaptación de la curva al abrir

| | `viewBox` | `getTotalLength()` | alto del `<ol>` |
|---|---|---|---|
| antes | `0 0 1200 3542` | `4798` | `3542` |
| después | `0 0 1200 3998` | `5159` | `3998` |

✅ El `ResizeObserver` detecta el crecimiento, se vuelve a medir y el path se regenera. La curva sigue conectada a los nodos.

### Checklist del disclosure

| Ítem | Estado | Evidencia |
|---|---|---|
| Abre con clic | ✅ | `aria-expanded: true` |
| Abre con teclado | ✅ | `<button>` nativo; foco por Tab verificado |
| Cierra con clic | ✅ | Verificado en rondas anteriores |
| Cierra con teclado | ✅ | Nativo |
| `aria-expanded` cambia | ✅ | `false` → `true` |
| El ícono rota | ✅ | `rotate: none` → `45deg` (ver §13) |
| El contenido aparece suavemente | ✅ | Transición de 500 ms sobre `grid-template-rows` |
| La altura no salta | ✅ | `0fr → 1fr` animado |
| La curva se adapta | ✅ | 3542 → 3998 |
| La línea no se vuelve punteada | ✅ | La sólida sigue con dasharray de valor único |
| El contenido cerrado no genera foco incorrecto | 🟡 | Sigue en el DOM sin `inert`/`hidden`: los elementos internos son texto y `<li>` no enfocables, así que en la práctica no hay trampa de foco, pero no está blindado |
| Funciona con varios abiertos | ✅ | Estado independiente por tarjeta |
| Funciona tras redimensionar | ✅ | `ResizeObserver` + listener de `resize` |
| Movimiento reducido elimina la transición | ✅ | `motion-reduce:transition-none` |

---

## 12. Composiciones internas — ⚪ intencionalmente estáticas

`RoadmapVisual` (`roadmap-visual.tsx`) ya **no** contiene las siete composiciones abstractas: fueron reemplazadas por un placeholder único, por decisión del cliente ("Armo el layout con placeholder"), a la espera de las ilustraciones reales del boceto.

Contenido actual: un halo `radial-gradient`, un círculo de vidrio con el ícono del pilar y la etiqueta "Imagen pendiente". Sin animación de ningún tipo.

| Pilar | Entrada propia | Stagger | Líneas que se dibujan | Flotación | Opacidad | Loop | Hover | Estado |
|---|---|---|---|---|---|---|---|---|
| 01 Oferta | No | No | No | No | No | No | No | ⚪ |
| 02 Avatar | No | No | No | No | No | No | No | ⚪ |
| 03 Ecosistema | No | No | No | No | No | No | No | ⚪ |
| 04 Asistente IA | No | No | No | No | No | No | No | ⚪ |
| 05 Prevaloración | No | No | No | No | No | No | No | ⚪ |
| 06 Conversión | No | No | No | No | No | No | No | ⚪ |
| 07 Escala | No | No | No | No | No | No | No | ⚪ |

### Checklist por composición (aplica a las siete por igual)

| Ítem | Estado | Evidencia |
|---|---|---|
| Representa correctamente el pilar | 🟡 | Solo mediante el ícono; la ilustración real está pendiente |
| La animación explica una relación | ⚪ | No hay animación |
| No compite con el roadmap | ✅ | Estático |
| No usa loops innecesarios | ✅ | Ninguno |
| No distrae | ✅ | Estático |
| No genera consumo constante | ✅ | Sin rAF ni animación |
| Respeta movimiento reducido | ✅ | Trivialmente |
| Legible sin animación | ✅ | Etiqueta de texto real |

---

## 13. Botones, foco y microinteracciones

| Ítem | Estado | Evidencia |
|---|---|---|
| Área táctil mínima 44 px | ✅ | Altura medida: **44 px** exactos (`h-11`) |
| Hover visible | ✅ | `hover:border-brand-500 hover:text-brand-900` |
| Foco visible | ✅ | Con Tab real: `focusVisible: true`, `outline: solid 2px rgb(47,127,135)` |
| Estado presionado perceptible | ❌ | No hay clase `active:` en el botón |
| Ningún estado depende solo del color | ✅ | El texto cambia ("Ver más"/"Ver menos") y el ícono rota |
| El foco no queda recortado | ✅ | `focus-visible:outline-offset-2`; el `overflow-x-clip` es de la sección, no de la tarjeta |
| Sin movimiento excesivo | ✅ | Solo rotación de 45° del ícono |
| Funciona por teclado | ✅ | Verificado con Tab + `<button>` nativo |
| Funciona en móvil | ✅ | 44 px de alto en todos los anchos |

Rotación del ícono "+" (verificada con la propiedad correcta):

```
ANTES:   {"rotate":"none",  "transform":"none", "transition":"transform, translate, scale, rotate"}
DESPUÉS: {"rotate":"45deg", "transform":"none", "transition":"transform, translate, scale, rotate"}
```

✅ Rota correctamente. **Nota metodológica**: una primera medición leyó `transform` y dio `none` en ambos estados, lo que habría sido un falso positivo de error. Tailwind v4 escribe `rotate-45` en la propiedad `rotate`, no en `transform`. Cualquier auditoría futura debe leer `rotate`, `translate` y `scale` por separado además de `transform`.

---

## 14. Movimiento reducido — ✅

Verificado con contexto real de Playwright `reducedMotion: "reduce"` (no solo leyendo el código):

```json
{
  "opacidadesTarjetas": ["1","1","1","1","1","1","1"],
  "cantidadPaths": 3,
  "dasharrays": ["2px, 10px", "none", "none"],
  "nodosBg": ["rgb(70,176,186)","rgb(70,176,186)","rgb(70,176,186)",
              "rgb(70,176,186)","rgb(70,176,186)","rgb(70,176,186)","rgb(70,176,186)"]
}
```

| Ítem | Estado | Evidencia |
|---|---|---|
| Encabezado visible | ✅ | `Reveal` devuelve un `<div>` plano |
| Siete tarjetas visibles | ✅ | Las 7 en `opacity: 1` |
| Curva completa | ✅ | Path sólido con `dasharray: none` = trazo entero |
| Siete nodos visibles | ✅ | Los 7 rellenos de turquesa |
| Sin animación por scroll | ✅ | El path de progreso no es `motion.path` |
| Sin desplazamientos horizontales | ✅ | Sin `motion.div` envolvente en las tarjetas |
| Sin loops | ✅ | Ninguno en el código |
| "Ver más" sigue funcionando | ✅ | El `<button>` no depende de Motion |
| Nada en `opacity: 0` | ✅ | Verificado en las 7 |
| Sin elementos fuera de posición | ✅ | Captura `audit/e3-reduced-motion.png` |
| Sin dependencia exclusiva de Motion | ✅ | Todo el contenido es HTML real |

Los 3 paths corresponden a: base punteada + sólida de movimiento reducido + auxiliar invisible de medición.

---

## 15. Responsive

| Ancho | ancho del ancla | nodos | rango X de nodos | dasharray base | overflow |
|---:|---:|---:|---|---|---|
| 1440 | 1200 | 7 | 313 – 866 | `2px, 10px` | `false` |
| 1280 | 1200 | 7 | 313 – 866 | `2px, 10px` | `false` |
| 1024 | 944 | 7 | 241 – 677 | `2px, 10px` | `false` |
| 768 | 720 | 7 | 178 – 511 | `2px, 10px` | `false` |
| 390 | **30** | 7 | −4 – −3 | `2px, 10px` | `false` |

| Función | 1440 | 1280 | 1024 | 768 | 390 | Observaciones |
|---|---|---|---|---|---|---|
| Dirección de entrada de tarjetas | ✅ | ✅ | ✅ | ✅ | ✅ | Alternancia hasta `md:`; en 390 todas a la derecha del carril |
| Línea base punteada | ✅ | ✅ | ✅ | ✅ | ✅ | `2px, 10px` en los 5 |
| Línea activa | 🐛 | 🐛 | 🐛 | 🐛 | 🐛 | Mismo bug P0 en todos |
| Nodos | ✅ | ✅ | ✅ | ✅ | 🟡 | En 390 el centro cae en x≈−3 (sobresale ~3 px del contenedor; contenido por `overflow-x-clip`) |
| Conectores | ❌ | ❌ | ❌ | ❌ | ❌ | No existen |
| Tarjetas | ✅ | ✅ | ✅ | ✅ | ✅ | En <640 px pasan a columna (imagen arriba) |
| Disclosure | ✅ | ✅ | ✅ | ✅ | ✅ | Botón de 44 px en todos |
| Hover | 🟡 | 🟡 | 🟡 | ⚪ | ⚪ | Sombra rota; en táctil no aplica |
| Overflow | ✅ | ✅ | ✅ | ✅ | ✅ | `scrollWidth <= innerWidth` |
| Sombras | 🟡 | 🟡 | 🟡 | 🟡 | 🟡 | `overflow-x-clip` de la sección puede recortar sombras laterales |
| Foco | ✅ | ✅ | ✅ | ✅ | ✅ | Outline 2 px visible |
| Movimiento reducido | ✅ | ❓ | ❓ | ❓ | ❓ | Verificado solo a 1440 |

Amplitud de la curva: a 1440 px los nodos barren de 313 a 866 px = **553 px** de recorrido horizontal (≈46% del ancho del contenedor).

---

## 16. Comportamientos extremos

| # | Prueba | Estado | Evidencia |
|---|---|---|---|
| 1 | Scroll muy lento | ✅ | 45 pasos de 120 px: las 7 tarjetas animan |
| 2 | Scroll muy rápido / por salto | 🟡 | Tarjetas omitidas quedan en `opacity: 0` (§5) |
| 3 | Subir y bajar repetidamente | ❓ | No instrumentado |
| 4 | Abrir disclosure antes de completar el segmento | ✅ | La curva se re-mide igual (4798→5159) |
| 5 | Abrir varios disclosures | ✅ | Estado independiente por tarjeta |
| 6 | Redimensionar con disclosure abierto | ✅ | `ResizeObserver` sobre contenedor y cada `<li>` |
| 7 | Entrar por `#sistema` | 🟡 | Riesgo del punto 2 |
| 8 | Recargar a mitad de sección | 🟡 | Ídem |
| 9 | Volver con navegación del navegador | ❓ | No instrumentado |
| 10 | Cambiar a movimiento reducido con la página abierta | ❓ | No instrumentado |

| Ítem | Estado | Evidencia |
|---|---|---|
| No hay saltos | ✅ | La línea no se anima, no hay saltos |
| No hay segmentos punteados en la línea activa | ✅ | Dasharray de valor único |
| No hay nodos desincronizados | ✅ | Todos derivan del mismo `progress` |
| No hay tarjetas invisibles | 🟡 | Solo con scroll por salto |
| No hay overflow | ✅ | 5 anchos verificados |
| No hay errores de hidratación | ✅ | Consola limpia |
| No hay warnings de React | ✅ | Solo `info: React DevTools` y `log: [HMR] connected` |
| No hay excepciones de Motion | ✅ | Sin `pageerror` |
| No hay listeners duplicados | ✅ | `useLayoutEffect` con dep estable + cleanup |
| No hay estados irrecuperables | ✅ | Todo se recupera al re-entrar en viewport |

Salida completa de la consola del navegador durante la auditoría:

```
info: %cDownload the React DevTools for a better development experience: …
log:  [HMR] connected
```

---

## 17. Rendimiento

| Aspecto | Observación | Estado |
|---|---|---|
| `useState` | 4 en `RoadmapJourney` (`size`, `points`, `pathLength`, `nodeStops`) + 1 por tarjeta. Ninguno se actualiza por scroll | ✅ |
| `useMotionValueEvent` | No se usa | ✅ |
| Suscripciones manuales | Ninguna; solo `useTransform` | ✅ |
| Actualizaciones por frame | Solo escrituras de Motion al DOM | ✅ |
| Lecturas de layout | `getBoundingClientRect()` en `measure()`, disparado por montaje / `ResizeObserver` / `resize`. **No** por frame | ✅ |
| `getTotalLength()` | En un `useEffect` con deps `[d, points]`. Se llama 1 vez por el path principal + 6 veces sobre un path auxiliar desprendido del DOM, por medición | ✅ |
| `ResizeObserver` | 1 instancia observando contenedor + 7 `<li>`; `disconnect()` en cleanup | ✅ |
| `IntersectionObserver` | El interno de Motion (`whileInView`), 7 instancias con `once: true` | ✅ |
| Limpieza de listeners | `removeEventListener("resize")` + `observer.disconnect()` | ✅ |
| Cantidad de MotionValues | 1 `scrollYProgress` + 1 `useSpring` + 1 `dashOffset` + 5 × 7 = **38** | 🟡 |
| Filtros | Ninguno animado | ✅ |
| Sombras | `shadow-soft` estática + halos `radial-gradient` (no `filter: blur`) | ✅ |
| `backdrop-filter` | 7 instancias de `.glass-surface` (una por tarjeta) + el círculo del placeholder | 🟡 |

| Ítem | Estado |
|---|---|
| No se ejecuta `setState` por cada pixel | ✅ |
| No se fuerza render de React por frame | ✅ |
| `getTotalLength()` no se mide continuamente | ✅ |
| Las suscripciones se limpian | ✅ |
| Los observers se desconectan | ✅ |
| No hay layout thrashing | ✅ |
| Se priorizan `transform` y `opacity` | ✅ |
| La animación SVG no genera patrones | ✅ |
| Sin filtros costosos innecesarios | ✅ |
| Sin loops decorativos permanentes | ✅ |
| Scroll fluido | ❓ **No medido.** No se instrumentó FPS; no se afirma ninguna cifra |

---

## 18. Tabla maestra de Motion

| ID | Elemento | Animación esperada | Trigger | Propiedades | Duración / spring | Reversible | Reduced motion | Estado | Evidencia | Archivo |
|---|---|---|---|---|---|---|---|---|---|---|
| H-1 | Eyebrow "EL SISTEMA" | Fade + y | mount | `opacity`, `y` | 800 ms | No | Sin animación | 🐛 | y=2504 fuera de pantalla | `reveal.tsx` |
| H-2 | Título `h2` | Fade + y, delay 0.12 | mount | `opacity`, `y` | 800 ms | No | Sin animación | 🐛 | Ídem | `reveal.tsx` |
| H-3 | Descripción | Fade + y, delay 0.24 | mount | `opacity`, `y` | 800 ms | No | Sin animación | 🐛 | Ídem | `reveal.tsx` |
| H-4 | Contenedor del `<ol>` | Fade + y, delay 0.36 | mount | `opacity`, `y` | 800 ms | No | Sin animación | 🐛 | Ídem | `reveal.tsx` |
| C-1..7 | Tarjetas 01-07 | Fade + x/y | `whileInView` `once` | `opacity`, `x`, `y` | 950 ms | No | Sin animación | 🟡 | Tabla §5 | `roadmap-card.tsx` |
| L-1 | Camino base punteado | Visible siempre | — (estático) | — | — | — | Igual | 🟡 | `2px, 10px`; tapado | `roadmap-journey.tsx:184` |
| L-2 | Línea activa | Dibujado progresivo | scroll | `strokeDashoffset` | spring 90/30/0.4 | Sí (esperado) | Path completo | 🐛 **P0** | dashoffset `0px` × 5 | `roadmap-journey.tsx:205-215` |
| N-1..7 | Nodos 01-07 | Encendido al llegar | scroll | `scale`, `borderColor`, `backgroundColor`, `color`, `boxShadow` | spring compartido | Sí | Todos encendidos | ✅ | Tabla §8 | `roadmap-journey.tsx:249-305` |
| K-1..7 | Conectores nodo-tarjeta | Línea corta al costado | — | — | — | — | — | ❌ | No existen en el código | — |
| V-1..7 | Hover de tarjeta (desplazamiento) | −3 px | `:hover` CSS | `translate` | Sin transición efectiva | Sí | Sin variante | 🐛 | `translate` fuera de `transition-[...]` | `roadmap-card.tsx:47` |
| V-8..14 | Hover de tarjeta (sombra) | `shadow-float` | `:hover` CSS | `box-shadow` | `duration-slow` | Sí | Sin variante | 🐛 | Sombra idéntica | `roadmap-card.tsx:47` |
| D-1..7 | Disclosure | Altura `0fr → 1fr` | clic / teclado | `grid-template-rows` | 500 ms | Sí | `transition-none` | ✅ | 3542→3998 | `roadmap-card.tsx:96-100` |
| X-1..7 | Ícono "+" | Rotación 45° | estado `isOpen` | `rotate` | `duration-base` | Sí | Sin variante | ✅ | `none → 45deg` | `roadmap-card.tsx:88-92` |
| P-1..7 | Composiciones | — | — | — | — | — | — | ⚪ | Placeholder estático | `roadmap-visual.tsx` |
| R-1 | Responsive | Sin overflow | — | — | — | — | — | ✅ | Tabla §15 | `roadmap-step.tsx` |
| R-2 | Movimiento reducido | Todo visible sin motion | media query | — | — | — | — | ✅ | §14 | Varios |

---

## 19. Hallazgos y prioridades

| Prioridad | Hallazgo | Impacto visual | Impacto técnico | Evidencia | Acción futura sugerida (NO aplicada) |
|---|---|---|---|---|---|
| **P0** | La línea activa nunca se dibuja: `strokeDashoffset` fijo en `0px` | La función central de la sección no existe: el recorrido aparece completo desde el inicio y el punteado nunca se ve | `useTransform` con closure que captura `pathLength = 0` del primer render | Tabla de 5 posiciones §7 + scroll gradual + `audit/f-linea-al-inicio.png` | Evitar la closure con estado capturado: derivar el offset de forma que se recalcule cuando `pathLength` cambia (p. ej. normalizando el dasharray a 1 y transformando sobre un rango constante) |
| **P1** | La animación de entrada del encabezado se consume fuera de pantalla | El usuario nunca ve la aparición escalonada del encabezado | `Reveal` usa `animate` (mount), no `whileInView` | `y=2504`, `opacity=1` sin scrollear | Evaluar una variante de `Reveal` con `whileInView`, sin tocar las secciones que ya dependen del comportamiento actual |
| **P1** | Los conectores nodo-tarjeta no existen | El nodo queda visualmente suelto respecto de su tarjeta | Se eliminaron con `roadmap-segment.tsx` y no se reimplementaron | Ausencia de `<line>` en el código | Decidir con el cliente si el layout del boceto los necesita, dada la distancia actual entre nodo y tarjeta |
| **P2** | `hover:shadow-float` no tiene efecto | El hover se siente incompleto | `.glass-surface` sin capa gana sobre la utilidad de Tailwind | `boxShadow` idéntico antes/después | Mismo patrón ya usado en "Resultados": resolver fuera del sistema de utilidades |
| **P2** | El desplazamiento del hover no transiciona | Salto seco de 3 px | `translate` no está en `transition-[box-shadow,border-color,transform]` | `transition-property` medida | Incluir `translate` en la lista de transición |
| **P2** | Tarjetas omitidas por scroll de salto quedan invisibles | Tarjetas en blanco tras un salto por ancla o recarga | `whileInView` + `once: true` | Tabla §5 con `opacity: 0` en 5 de 7 | Evaluar `viewport.amount` o un fallback de visibilidad |
| **P3** | Nodos anclados al **tope** de la fila, no al centro vertical de la tarjeta | Difiere del boceto, donde el nodo está a media altura de su tarjeta. Es la causa probable del reporte del cliente sobre el pilar 07 | El ancla está en `top-0` del `<li>` | `nodoCentroY` 0/506/1012… vs `tarjetaTopY` 16/522/1012… y medición del boceto (nodo ≈ centro vertical de la tarjeta) | Reubicar el ancla al centro vertical de la tarjeta |
| **P3** | En 390 px el nodo sobresale ~3 px del contenedor | Recorte mínimo del halo izquierdo | Carril de 30 px con nodo de 36 px y `-translate-x-1/2` | `rangoX: -4 – -3` | Ajustar el ancho del carril móvil o el tamaño del nodo |
| **P3** | El botón "Ver más" no tiene estado `:active` | Falta feedback al presionar | Sin clase `active:` | Inspección de clases | Agregar un estado presionado |
| **P3** | El contenido colapsado del disclosure no está `inert` | Riesgo teórico de foco oculto | Sigue en el DOM con altura 0 | Inspección | Hoy no hay elementos enfocables dentro; blindarlo solo si se agregan |

---

## 20. Archivos inspeccionados

Código leído íntegramente:

- `components/sections/roadmap-section.tsx`
- `components/roadmap/roadmap-journey.tsx`
- `components/roadmap/roadmap-step.tsx`
- `components/roadmap/roadmap-card.tsx`
- `components/roadmap/roadmap-visual.tsx`
- `components/motion/reveal.tsx`
- `content/pillars.ts`
- `app/globals.css` (tokens y `.glass-surface`)
- `package.json`

Verificados como inexistentes: `components/roadmap/roadmap-segment.tsx`, `components/roadmap/roadmap-marker.tsx`, `components/roadmap/roadmap-disclosure.tsx`.

## 21. Capturas utilizadas

Directorio: `%LOCALAPPDATA%\Temp\claude\c--Users-cavin-Proyectos-Pagina-Uli\7f1808df-6e44-4659-943d-f6b75bba479d\scratchpad\audit\`

| Archivo | Qué documenta |
|---|---|
| `linea-0.png` … `linea-100.png` | Estado de la línea en las 5 posiciones de scroll |
| `f-linea-al-inicio.png` | **Prueba visual del P0**: línea 100% sólida con solo 1 de 7 nodos encendidos |
| `e1-scroll-gradual.png` | Estado tras scroll gradual real |
| `e3-reduced-motion.png` | Movimiento reducido |
| `e4-disclosure.png` | Disclosure abierto con la curva readaptada |
| `e5-1440.png`, `e5-1280.png`, `e5-1024.png`, `e5-768.png`, `e5-390.png` | Responsive |

---

# CHECKLIST DE REVISIÓN EXTERNA

Para una segunda auditoría independiente. Cada ítem debe responderse con evidencia medida, no con impresión visual.

## Entorno
- [ ] Confirmar que el servidor auditado es el mismo que ve el usuario (puerto y proceso).
- [ ] Registrar `git log -1 --oneline` y `git status --short` al momento de auditar.
- [ ] Confirmar `motion@13.1.1` y la importación `motion/react`.
- [ ] Confirmar que no se levantó una segunda instancia en otro puerto.

## Encabezado
- [ ] Medir `opacity` y `transform` del `h2#roadmap-title` sin scrollear, 2 s tras cargar.
- [ ] Confirmar si la posición del título está fuera del viewport en ese momento.
- [ ] Determinar si `Reveal` usa `animate` o `whileInView`.

## Tarjetas
- [ ] Medir `opacity` y `transform` de las 7 tras un scroll gradual con `mouse.wheel`.
- [ ] Repetir tras un `window.scrollTo()` directo y comparar.
- [ ] Verificar que las 7 terminan en `transform: none`.
- [ ] Confirmar la dirección de entrada por paridad (impares DER, pares IZQ).

## Curva base
- [ ] Leer `stroke-dasharray` del primer `<path>` en 1440, 768 y 390.
- [ ] Confirmar que el `d` tiene exactamente 6 comandos `C` (un solo path).
- [ ] Verificar que el `d` arranca en el nodo 01 y termina en el nodo 07.
- [ ] Confirmar que el punteado es intencional (pedido del cliente), no un defecto.

## Línea activa
- [ ] Medir `stroke-dashoffset` calculado en 0%, 25%, 50%, 75% y 100% del rango de scroll.
- [ ] Calcular el porcentaje dibujado como `1 - offset / getTotalLength()`.
- [ ] Confirmar si el valor varía o permanece constante.
- [ ] Repetir con scroll gradual real, no solo programático.
- [ ] Capturar una imagen a la altura del nodo 01 y contar nodos encendidos vs. tramo dibujado.
- [ ] Revisar si `useTransform` captura estado por closure.

## Nodos
- [ ] Medir `backgroundColor` de los 7 al 40% del scroll.
- [ ] Confirmar que hay una frontera clara entre encendidos y pendientes.
- [ ] Verificar que `translate` sigue en `-50% -50%` con Motion escribiendo `transform`.
- [ ] Comprobar que no existe animación en loop.

## Conectores
- [ ] Buscar elementos `<line>` dentro del SVG del recorrido.
- [ ] Si no existen, confirmar el estado ❌ y no darlos por implementados.

## Disclosure
- [ ] Registrar `viewBox` y `getTotalLength()` antes y después de abrir.
- [ ] Confirmar el cambio de `aria-expanded` y del texto del botón.
- [ ] Verificar la rotación leyendo la propiedad `rotate` (no `transform`).
- [ ] Probar apertura y cierre con teclado.

## Microinteracciones
- [ ] Medir `translate` y `boxShadow` antes y después del hover.
- [ ] Verificar si `transition-property` incluye `translate`.
- [ ] Confirmar altura ≥ 44 px del botón.
- [ ] Verificar `:focus-visible` con Tab real, no con `.focus()` programático.

## Composiciones
- [ ] Confirmar que `RoadmapVisual` no contiene animación.
- [ ] Verificar que la etiqueta "Imagen pendiente" es visible (veracidad del contenido).

## Responsive
- [ ] Repetir las mediciones en 1440, 1280, 1024, 768 y 390.
- [ ] Registrar el ancho del ancla en cada uno.
- [ ] Confirmar `scrollWidth <= innerWidth` en los cinco.
- [ ] Verificar que en 390 el nodo no queda recortado de forma visible.

## Movimiento reducido
- [ ] Usar un contexto real con `reducedMotion: "reduce"`.
- [ ] Confirmar `opacity: 1` en las 7 tarjetas.
- [ ] Confirmar `dasharray: none` en la línea sólida.
- [ ] Confirmar los 7 nodos rellenos.

## Accesibilidad
- [ ] Confirmar `<section>` → `h2` → `<ol>` → `<li>` → `h3`.
- [ ] Verificar que los SVG y los nodos llevan `aria-hidden="true"`.
- [ ] Recorrer los 7 botones con Tab en orden 01→07.
- [ ] Confirmar que el orden de lectura no depende del layout visual.

## Rendimiento
- [ ] Buscar `useMotionValueEvent` y `setState` dentro de handlers de scroll.
- [ ] Contar llamadas a `getTotalLength()` y cuándo se disparan.
- [ ] Verificar `disconnect()` del `ResizeObserver` en el cleanup.
- [ ] Si se afirma una cifra de FPS, medirla; de lo contrario no afirmarla.

## Errores visuales
- [ ] Revisar la consola en busca de warnings de React o errores de hidratación.
- [ ] Confirmar que no hay `pageerror`.

## Documentación
- [ ] Contrastar cada afirmación de `ROADMAP.md` contra el comportamiento medido.
- [ ] Señalar toda afirmación de la documentación que no se sostenga con evidencia.

---

## 22. Advertencias metodológicas para quien continúe

1. **Tailwind v4 no escribe en `transform`.** `translate-*`, `rotate-*` y `scale-*` usan las propiedades CSS homónimas. Leer solo `transform` produce falsos negativos: durante esta auditoría, una primera medición del ícono "+" dio `transform: none` en ambos estados y habría reportado un error inexistente.
2. **`document.querySelector("#sistema div.relative")` devuelve el `Container`, no el contenedor del recorrido.** Usar `document.querySelector("#sistema svg.pointer-events-none.absolute").parentElement`.
3. **`document.querySelectorAll("#sistema li")` incluye los `<li>` de los chips "Qué construimos"** dentro de los disclosures. Usar `#sistema ol > li` o los hijos directos del `<ol>`.
4. **El scroll programático (`window.scrollTo`) no dispara `whileInView`** en los elementos que se saltea. Para auditar la entrada de tarjetas hay que usar `mouse.wheel` en pasos.
5. **Un `stroke-dasharray` de valor único no prueba que la animación funcione.** Hay que medir `stroke-dashoffset` en varias posiciones y confirmar que varía.

---

*Fin de la auditoría. No se modificó código de la sección. La sección no está aprobada.*
