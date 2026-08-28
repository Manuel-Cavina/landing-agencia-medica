# FAQ, CTA final y footer

Estado: EN REVISIÓN VISUAL — no aprobada.

Cierre de la landing: `Calculadora → Preguntas frecuentes → CTA final → Footer`.
Se agregó además un índice lateral de secciones, pedido durante la misma tarea.

---

## 1. Archivos

### Creados

| Archivo | Rol |
| --- | --- |
| `content/faq.ts` | Las 4 preguntas tipadas + copys de la sección. Fuente única. |
| `components/faq/faq-accordion.tsx` | Acordeón. Único Client Component del FAQ. |
| `components/sections/faq-section.tsx` | Sección, dos columnas, JSON-LD. Server Component. |
| `components/sections/final-cta.tsx` | CTA final `id="agendar"`. Server Component. |
| `components/layout/site-footer.tsx` | Footer. Server Component, cero JavaScript. |
| `components/layout/section-index.tsx` | Índice lateral con seguimiento de scroll. |
| `components/motion/reveal-on-view.tsx` | Entrada al entrar en vista (ver §7). |

### Modificados

| Archivo | Cambio | Motivo |
| --- | --- | --- |
| `app/page.tsx` | `<FaqSection />` y `<FinalCta />` | Integración. |
| `app/layout.tsx` | `<SectionIndex />`, `<SiteFooter />`, `flex-1` en `<main>` | Footer y índice son de layout, no de página. |
| `config/site.ts` | Se agregó `SECTION_INDEX` | Orden de documento ≠ orden del navbar (ver §6). |
| `components/sections/hero.tsx` | Se agregó `id="inicio"` | El enlace "Volver arriba" no tenía destino. Sin cambio visual. |
| `app/globals.css` | `.glass-surface` con más vidrio | Pedido del cliente. Afecta navbar y menú móvil. |
| `next.config.ts` | `distDir` por `NEXT_DIST_DIR` | Ver §11. |

**Anclas reparadas.** `#agendar` y `#preguntas-frecuentes` estaban referenciadas
desde `config/site.ts`, `hero.tsx` y `roadmap-section.tsx`, pero **ninguna sección
las declaraba**: esos cuatro enlaces no llevaban a ningún lado. Ahora existen. No se
modificó ningún enlace del navbar para conseguirlo.

---

## 2. Contenido del FAQ

Cuatro preguntas, en `content/faq.ts`. Forman un recorrido corto de decisión:

1. ¿Qué construyen exactamente?
2. ¿Para quién está pensado este sistema?
3. ¿Es solamente un servicio de publicidad?
4. ¿Qué sucede en la reunión estratégica?

Las cuatro preguntas operativas retiradas (equipo previo, plazos, medición e
integraciones) no se perdieron del historial, pero no se muestran en este mock.

**No se afirma** que la reunión sea gratuita, sin compromiso o con auditoría
incluida: nada de eso está confirmado. **No se dan plazos concretos** de
implementación. Ninguna respuesta promete resultados (DEC-019).

---

## 3. Acordeón: cómo funciona

- Cada pregunta es un `<button>` real dentro de un `<h3>`, con `aria-expanded` y
  `aria-controls`.
- La respuesta es `role="region"` con `aria-labelledby` hacia su botón.
- Cerrada lleva `inert`: fuera del orden de tabulación y del árbol de
  accesibilidad, pero **presente en el HTML** (requisito de `SEO_GEO.md` §4 y
  condición para que el JSON-LD sea legítimo).
- **Varias abiertas a la vez.** El estado es un `Set` de ids; abrir una nunca
  cierra otra. Verificado: 3 simultáneas.
- Teclado: Enter y Espacio abren y cierran. Foco visible (`outline` 2px
  `rgb(70,176,186)`).

**Animación de altura sin medir píxeles.** `grid-template-rows: 0fr → 1fr` sobre un
contenedor grid con hijo `overflow-hidden`. El navegador interpola hasta la altura
natural del contenido: no hay `scrollHeight`, no hay estilos en píxeles escritos
desde JavaScript y por lo tanto no hay saltos cuando el texto se reajusta.

El ícono `Plus` rota 45° y se lee como cruz. La rotación **no** es la señal de
estado: eso lo comunica `aria-expanded`.

---

## 4. Índice lateral de secciones

Barra vertical fija sobre el margen derecho, visible **solo desde 1280px** (por
debajo no hay margen libre y el navbar ya resuelve la navegación).

- Un solo `IntersectionObserver` sobre las seis secciones. **Cero listeners de
  scroll** (`SEO_GEO.md` §13).
- Enlaces reales a anclas: sin JavaScript sigue navegando.
- Activo marcado con `aria-current="page"`, **y con ancho de trazo además de
  color** (14px → 28px). No depende solo del color.
- Etiquetas siempre en el DOM (el lector de pantalla las lee); visualmente
  aparecen con hover o foco, para no tapar el contenido.

Los trazos usan `--brand-900` y no dependen de que la sección de fondo sea blanca o
`#DFEDEF`, por lo que conservan contraste durante todo el recorrido.

---

## 5. CTA final

`id="agendar"`, composición centrada y hero-like sobre `#DFEDEF`, con título,
descripción, halos de marca y ancho de lectura controlado.

`BOOKING_EMBED_URL` en `config/site.ts` es la única fuente del formulario. Cuando
existe, se renderiza directamente un `<iframe loading="lazy">` con altura reservada,
borde suave, radio `rounded-lg` y superficie blanca.

### Destino de reserva — [PENDIENTE]

No existe una URL real de Tally, Calendly ni otro canal de contacto. Mientras
`BOOKING_EMBED_URL` sea `null`, no se muestra un botón deshabilitado, una URL
inventada ni el fallback anterior de `#agendar` hacia sí mismo. La sección conserva
el destino de ancla para los CTAs del sitio, pero la reserva requiere configurar el
embed real antes del lanzamiento.

---

## 6. Footer

Tres columnas en escritorio, dos en tablet, una en móvil.

- **Marca**: logo real (`public/logo.png`, dimensiones reservadas, sin layout
  shift) + `SITE_NAME` + descripción.
- **Navegación**: se lee de `NAV_LINKS` y `NAV_CTA`, la **misma fuente que el
  navbar**. No hay una segunda lista que pueda desincronizarse.
- **Siguiente paso**: reemplaza a la columna de contacto.

### Lo que NO tiene y por qué

| Omitido | Motivo |
| --- | --- |
| Correo, teléfono, WhatsApp, ubicación | [PENDIENTE] en `PROJECT.md`. Inventarlos violaría DEC-019. |
| Íconos sociales | No hay perfiles oficiales confirmados. |
| Privacidad, términos, aviso legal | Las rutas no existen en `app/`: darían 404. `AGENTS.md` prohíbe crear legales sin autorización. |

`SECTION_INDEX` **no** se deriva de `NAV_LINKS` a propósito: el orden es distinto
(`NAV_LINKS` pone "El sistema" antes que "Resultados", pero en el documento
Resultados va primero — un índice que sigue el scroll saltaría hacia atrás) y tiene
dos entradas que el navbar no tiene.

**Año del copyright**: `new Date().getFullYear()` se evalúa en el servidor. En una
página estática es el año del **build**, no el del visitante. Aceptable mientras se
redespliegue; anotado por si alguna vez importa.

---

## 7. Motion

`components/motion/reveal.tsx` **no se tocó** (lo usan hero, resultados, roadmap y
calculadora). Se creó `reveal-on-view.tsx` aparte, por dos razones:

1. **Dispara al entrar en vista, no al montar.** `Reveal` anima en el montaje: para
   una sección al final del documento, la animación se reproduce mientras nadie la
   mira y el usuario llega cuando ya terminó.
2. **No deja contenido invisible si falla el JavaScript.** Motion escribe
   `opacity: 0` en el HTML del servidor; si la hidratación se rompe, el contenido
   queda invisible para siempre. Acá el primer render es **totalmente visible** y
   recién al montar en el cliente se pasa al estado oculto para animar.

El estado de la animación se escribe como atributo `data-reveal` en el DOM, **no**
como `useState`: solo lo consume el CSS, y `setState` sincrónico en un efecto
dispara renders en cascada (la regla `react-hooks/set-state-in-effect` de React 19
lo rechaza, con razón). Efecto secundario bueno: la entrada no provoca ni un
re-render.

Movimiento reducido: variantes `motion-reduce:` de Tailwind, sin rama de
JavaScript. Verificado — `transition-property: none` y `opacity: 1`.

---

## 8. SEO / GEO

`FAQPage` en JSON-LD, generado desde el **mismo array** que renderiza el acordeón.
No hay forma de que el marcado y el texto visible se separen.

Verificado en el navegador: 4 preguntas, todas coinciden con las visibles, todas las
respuestas coinciden con el texto renderizado.

Un solo `h1` en toda la página (el del hero). Las secciones usan `h2`, las preguntas
`h3`. Sin saltos de nivel.

> La página lleva `noindex` (`app/layout.tsx`) porque todavía hay contenido
> demostrativo. El schema queda correcto y listo para cuando se levante.

---

## 9. Verificaciones ejecutadas

Con Playwright contra el servidor de desarrollo.

| Prueba | Resultado |
| --- | --- |
| Anclas `#inicio` `#sistema` `#resultados` `#calculadora` `#preguntas-frecuentes` `#agendar` | Las 6 existen |
| IDs duplicados | Ninguno |
| `h1` en la página | 1 |
| Acordeón: `aria-expanded`, `aria-controls`, `role=region`, `inert` | Correctos |
| Abrir con clic / Enter / Espacio, cerrar igual | OK |
| 3 respuestas abiertas simultáneas | OK, ninguna se cerró sola |
| Foco visible | `outline: 2px rgb(70,176,186)` |
| Áreas táctiles ≥ 44px | Todas |
| Scroll horizontal en 1440 / 1280 / 1024 / 768 / 390 | Sin desborde en ninguno |
| Columna izquierda del FAQ | Flujo normal en todos los breakpoints |
| Índice: activo sigue el scroll por las 6 secciones | Correcto en las 6 |
| Índice oculto por debajo de 1280px | Correcto |
| `prefers-reduced-motion` | `transition-property: none`, contenido visible |
| Errores de consola | Ninguno |
| `npm run lint` | Limpio |
| `npm run build` | Compila |

### Contraste medido

| Texto | Ratio |
| --- | --- |
| Pregunta del FAQ sobre blanco | 4,66:1 ✓ |
| Respuesta del FAQ sobre blanco | 4,91:1 ✓ |
| Texto del footer | 4,70:1 ✓ |
| Enlaces del footer | 4,70:1 ✓ |
| Título grande del CTA sobre `#DFEDEF` | Cumple AA para texto grande |

### Estilo actual del FAQ

- Superficie blanca/transparente con halos `brand-20` y `brand-12`.
- Sin eyebrow visible y con cuatro preguntas.
- Tarjetas `bg-brand-12`, borde suave y radio medio; abiertas en `bg-brand-20`.
- Preguntas y respuestas usan `brand-900`/`text-primary` para mantener contraste
  sobre las superficies translúcidas.

---

## 10. Pendientes

- **[PENDIENTE] URL real de agendamiento embebido.** Tally o Calendly son
  compatibles; no hay un proveedor/URL configurado.
- **[PENDIENTE]** Datos de contacto, perfiles sociales y páginas legales.
- `app/layout.tsx` declara `lang="en"` en una página íntegramente en español, y la
  metadata sigue siendo `"Create Next App"`. **No se tocó** por estar fuera del
  alcance de esta tarea, pero afecta a toda la página y conviene resolverlo.

---

## 11. Nota de herramientas: builds que rompían el dev server

`next dev` y `next build` escriben en el **mismo** directorio `.next`. Correr un
build de verificación con el servidor de desarrollo levantado le pisa los
artefactos, le mata el watcher y el navegador se queda sirviendo CSS y JS viejos
**bajo nombres de archivo que no cambiaron**. Se ve como "el cambio no se aplicó"
cuando el código estaba bien. Pasó en este proyecto y costó una ronda de diagnóstico.

`next.config.ts` ahora acepta `NEXT_DIST_DIR`. Para verificar sin romper el dev
server:

```bash
NEXT_DIST_DIR=.next-build npm run build
```

Sin la variable, el comportamiento es el de siempre (`.next`): ni el deploy ni
`npm run dev` cambian.

**Detalle**: un `.next-build` recién creado no tiene caché de fuentes, así que
`next/font` vuelve a descargar Inter de Google en cada build. Si la red falla, el
build muere con `Can't resolve '@vercel/turbopack-next/internal/font/google/font'`
— que **no** es un error del código. Se evita copiando el caché una vez:

```bash
mkdir -p .next-build && cp -r .next/cache .next-build/cache
```
