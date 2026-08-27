/**
 * Franja de estadísticas debajo del hero (docs/AGENTS.md la menciona como
 * "Franja horizontal de información vinculada al sistema"). Sigue siendo
 * Server Component: el conteo animado vive aislado en components/motion/
 * stat-counter-group.tsx.
 *
 * A pedido del cliente: barra a todo el ancho de la página (por eso el
 * fondo turquesa va afuera del Container, y el Container solo se usa
 * adentro para alinear los números con el resto del contenido), en
 * turquesa sólido en vez del degradado de la versión anterior. El
 * espacio contra el video del hero lo da el propio pb-20/pb-24 del
 * Container del hero (components/sections/hero.tsx) -- a pedido del
 * cliente, con bastante aire, no pegada.
 *
 * El caption "Cifras ilustrativas..." se sacó a pedido del cliente (no le
 * gustaba la línea visualmente). OJO: era la única marca visible de que
 * estos números (7 pilares, 5 canales, etc.) son ilustrativos y no datos
 * reales -- ver content/landing.ts y docs/AGENTS.md ("Hasta recibir casos
 * validados, identificarlos claramente como demostrativos"). Sigue
 * documentado ahí, pero ya no aparece en pantalla.
 */

import { Container } from "@/components/ui/container";
import { StatCounterGroup } from "@/components/motion/stat-counter-group";
import { STATS } from "@/content/landing";

export function StatsStrip() {
  return (
    <section className="pb-10 sm:pb-14">
      <div className="bg-brand-500 px-6 py-8 sm:px-10 sm:py-10">
        <Container>
          <StatCounterGroup stats={STATS} />
        </Container>
      </div>
    </section>
  );
}
