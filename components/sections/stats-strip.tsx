/**
 * Franja horizontal de estadísticas debajo del hero (docs/AGENTS.md la
 * menciona como "Franja horizontal de información vinculada al sistema").
 * Sigue siendo Server Component: el conteo animado vive aislado en
 * components/motion/stat-counter.tsx.
 *
 * Importante: ver el comentario en content/landing.ts sobre por qué estas
 * cifras describen el alcance del sistema y no resultados de clínicas o
 * pacientes -- y por qué el caption de abajo las marca como ilustrativas.
 */

import { Container } from "@/components/ui/container";
import { StatCounter } from "@/components/motion/stat-counter";
import { STATS } from "@/content/landing";

export function StatsStrip() {
  return (
    <section className="border-t border-border-soft bg-surface-soft py-16 sm:py-20">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 text-center sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-brand-700 sm:text-4xl">
                <StatCounter value={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-text-secondary/70">
          Cifras ilustrativas del alcance del sistema — se actualizan con
          datos reales validados junto al cliente.
        </p>
      </Container>
    </section>
  );
}
