/**
 * Franja de estadísticas debajo del hero (docs/AGENTS.md la menciona como
 * "Franja horizontal de información vinculada al sistema"). Sigue siendo
 * Server Component: el conteo animado vive aislado en components/motion/
 * stat-counter-group.tsx.
 *
 * A pedido del cliente: barra a todo el ancho de la página (por eso el
 * fondo turquesa va afuera del Container, y el Container solo se usa
 * adentro para alinear los números con el resto del contenido), en
 * turquesa sólido en vez del degradado de la versión anterior, y pegada
 * directamente contra el hero (sin padding arriba que deje una línea
 * blanca entre ambas secciones).
 *
 * Importante: ver el comentario en content/landing.ts sobre por qué estas
 * cifras describen el alcance del sistema y no resultados de clínicas o
 * pacientes -- y por qué el caption de abajo las marca como ilustrativas.
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
      <Container>
        <p className="mt-4 text-center text-xs text-text-secondary/70">
          Cifras ilustrativas del alcance del sistema — se actualizan con
          datos reales validados junto al cliente.
        </p>
      </Container>
    </section>
  );
}
