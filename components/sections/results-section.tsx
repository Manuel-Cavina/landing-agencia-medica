/**
 * Sección "Casos y resultados" (id="resultados", destino del link del
 * navbar). Server Component: la interactividad vive aislada en
 * components/results/results-carousel.tsx (Embla) y components/ui/
 * animated-counter.tsx (el número de cada tarjeta).
 *
 * Fondo: mismo degradado diagonal + halos + grano de components/
 * sections/hero.tsx, a pedido del cliente, copiado acá a propósito (no
 * se importa ni se refactoriza hero.tsx: esta tarea tiene prohibido
 * tocarlo). Hubo una vuelta intermedia a blanco liso porque el tinte del
 * degradado se notaba de más contra la sombra de las tarjetas del
 * carrusel -- pero esa sombra era el problema real (se sacó en
 * components/results/professional-card.tsx), no el degradado en sí.
 *
 * -mt-10/-mt-14: cierra el espacio en blanco que dejaba el
 * padding-bottom de la franja anterior (components/sections/
 * stats-strip.tsx, pb-10/pb-14) sin modificar ese archivo -- se resuelve
 * desde acá, tirando esta sección hacia arriba para que no quede la
 * franja blanca entre ambas.
 */

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { ResultsCarousel } from "@/components/results/results-carousel";
import { RESULTS_CASES } from "@/content/results";

const GRAIN_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function ResultsSection() {
  return (
    <section
      id="resultados"
      className="relative -mt-10 overflow-hidden pt-12 pb-20 sm:-mt-14 sm:pt-16 sm:pb-24"
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, var(--brand-12) 40%, var(--brand-20) 65%, #ffffff 100%)",
      }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 right-[10%] h-[420px] w-[420px] rounded-pill opacity-70"
          style={{
            background:
              "radial-gradient(closest-side, var(--brand-20), transparent)",
          }}
        />
        <div
          className="absolute bottom-0 left-[6%] h-56 w-56 rounded-pill opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, var(--brand-12), transparent)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: GRAIN_BACKGROUND }}
        />
      </div>

      <Container className="relative">
        {/* Encabezado apilado (a pedido del cliente): eyebrow, título y
            descripción en una sola columna, uno debajo del otro -- en vez
            del bloque asimétrico anterior (título a la izquierda,
            descripción aparte a la derecha). */}
        <div className="text-left">
          <Reveal delay={0}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
              <span aria-hidden="true" className="h-px w-6 bg-brand-500" />
              Casos y resultados
            </span>
          </Reveal>

          {/* h2: docs/SEO_GEO.md pide un solo h1 por página (vive en el
              hero) y h2 para las secciones principales. */}
          <Reveal delay={0.12} className="mt-5">
            <h2 className="max-w-xl text-[28px] font-black leading-[1.15] tracking-tight text-brand-700 sm:text-[40px]">
              Resultados que se pueden entender{" "}
              <em className="italic">y medir.</em>
            </h2>
          </Reveal>

          <Reveal delay={0.24} className="mt-5">
            <p className="max-w-sm text-left text-sm text-text-secondary sm:text-base">
              No observamos métricas aisladas. Analizamos oportunidades,
              consultas, seguimiento y resultados dentro de un mismo
              sistema.
            </p>
          </Reveal>
        </div>
      </Container>

      <Reveal delay={0.4}>
        {/* Ancho completo (no Container) para que el carrusel pueda usar
            todo el viewport y la tarjeta parcial de móvil se corte contra
            el borde real de la pantalla, no contra un margen artificial.
            mt-16/20: mucho más aire respecto del encabezado (más
            "editorial", menos apretado) que el mt-8 anterior. */}
        <div className="relative mt-16 px-4 sm:px-6 lg:mt-20 lg:px-10">
          <ResultsCarousel cases={RESULTS_CASES} />
        </div>
      </Reveal>

      <Container className="relative">
        <p className="mt-14 text-center text-xs text-text-secondary/70 sm:mt-16">
          Datos demostrativos. Serán reemplazados por casos reales y
          validados.
        </p>
      </Container>
    </section>
  );
}
