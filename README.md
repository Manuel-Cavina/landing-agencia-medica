# Odisea — Landing comercial

Landing de una sola página para una agencia de crecimiento orientada a clínicas y profesionales de medicina estética. El objetivo es convertir visitas en reuniones estratégicas agendadas por Calendly.

> Antes de tocar código, leé [AGENTS.md](./AGENTS.md) y la carpeta [docs/](./docs). Ese archivo manda sobre cualquier otra convención.

## Estado del proyecto

En iteración, sección por sección. Progreso actual:

| Sección | Estado |
|---|---|
| Navbar | Implementado, pendiente de aprobación visual del cliente |
| Hero | No iniciado |
| Franja informativa, resultados, pilares, roadmap, calculadora, Calendly, FAQ, CTA final, footer | No iniciados |

El nombre comercial definitivo, el dominio, los copys finales y los casos reales todavía **no están confirmados** — ver [docs/DECISIONS.md](./docs/DECISIONS.md) para el detalle de qué está aprobado y qué sigue pendiente.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** (configuración CSS-first en `app/globals.css`, sin `tailwind.config.ts`)
- **Inter** (`next/font/google`) como tipografía — reemplazo de Helvetica Neue, que al ser una fuente propietaria de Monotype no puede auto-hostearse sin licencia
- **Lucide** para iconografía
- **liquid-glass-react** instalada para efectos Liquid Glass selectivos en componentes protagonistas (no usada todavía en el navbar: ver el comentario en `components/layout/site-header.tsx`)
- **Playwright** (devDependency) para verificación visual/de accesibilidad durante el desarrollo — no es parte del build de producción

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build
```

Antes de dar por terminada cualquier sección hay que pasar `lint` y `build` en limpio, y verificar manualmente escritorio, tablet y móvil (ver AGENTS.md).

## Estructura

```
app/
  layout.tsx        # shell global: fuentes, <SiteHeader/>, <main>
  page.tsx           # todavía es el scaffold de create-next-app (hero sin empezar)
  globals.css        # tokens del design system + Tailwind v4 (@theme inline)
components/
  layout/            # componentes de layout de la página completa (navbar, footer, etc.)
  ui/                # componentes de UI genéricos y reutilizables (Container, etc.)
config/
  site.ts            # enlaces de navegación y contenido del navbar, tipado
docs/
  PROJECT.md          # qué es el producto, para quién, alcance
  DESIGN_SYSTEM.md    # colores, tipografía, espaciado, radios, sombras, motion
  SEO_GEO.md           # reglas de SEO/GEO y contenido
  DECISIONS.md         # historial de decisiones aprobadas/descartadas
public/
  logo.png            # isotipo real de marca (sin nombre comercial confirmado todavía)
```

## Sistema de diseño (resumen)

Color principal `#46B0BA`, base blanca y neutros claros. Glassmorphism selectivo (clase `.glass-surface` en `app/globals.css`), radios entre 12px y 32px, sombras suaves. El detalle completo —incluyendo la escala tipográfica, el espaciado y las reglas de motion— vive en [docs/DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md); no lo dupliques acá, actualizalo ahí cuando cambie algo.

## Convenciones de trabajo

- Una sección de la landing por tarea, salvo pedido explícito de trabajo global.
- No presentar como reales testimonios, cifras o resultados no validados por el cliente.
- Separar datos y presentación cuando sea razonable (ver `config/site.ts` como ejemplo).
- Una sección no se marca como "aprobada" sin confirmación explícita del cliente; recién ahí se actualiza su documentación y `docs/DECISIONS.md`.

## Pendientes conocidos

- Nombre comercial y dominio definitivos ("Órbita Growth Systems" fue descartado, no reutilizar).
- Fórmula real de la calculadora.
- Casos y resultados reales para reemplazar el contenido demostrativo.
- Confirmar si `liquid-glass-react` termina usándose en alguna sección (candidatos: calculadora, tarjetas del roadmap).
