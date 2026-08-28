/**
 * Sección "Calculadora" (id="calculadora", destino del link del navbar),
 * después del roadmap de los siete pilares.
 *
 * Server Component: toda la interactividad (estado, cálculo, sliders,
 * animación de los números) vive aislada en
 * components/calculator/opportunity-calculator.tsx. Acá solo hay
 * encabezado y estructura semántica.
 *
 * Fondo #DFEDEF con halos blancos. Las dos columnas interactivas usan
 * superficies blancas para conservar separación y contraste.
 *
 * El encabezado repite la estructura de Resultados y del Roadmap
 * -- eyebrow con guioncito, h2 de la misma escala con una parte en
 * cursiva, y descripción -- para que la sección se lea como parte de la
 * misma página.
 *
 * PROVISIONAL: el modelo comercial definitivo está [PENDIENTE]
 * (docs/PROJECT.md). Ver docs/sections/CALCULATOR.md.
 */

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { OpportunityCalculator } from "@/components/calculator/opportunity-calculator";
import { CALCULATOR_CONTENT } from "@/content/calculator";

export function CalculatorSection() {
  return (
    <section
      id="calculadora"
      aria-labelledby="calculator-title"
      className="relative scroll-mt-[var(--header-offset)] overflow-x-clip bg-[#DFEDEF] py-14 sm:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-20 left-[6%] h-[420px] w-[420px] rounded-pill opacity-60"
          style={{ background: "radial-gradient(closest-side, #ffffff, transparent)" }}
        />
        <div
          className="absolute bottom-0 right-[8%] h-[380px] w-[380px] rounded-pill opacity-50"
          style={{ background: "radial-gradient(closest-side, #ffffff, transparent)" }}
        />
      </div>

      <Container className="relative">
        <div className="text-left">
          <Reveal delay={0}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
              <span aria-hidden="true" className="h-px w-6 bg-brand-500" />
              {CALCULATOR_CONTENT.eyebrow}
            </span>
          </Reveal>

          {/* h2, no h1: docs/SEO_GEO.md reserva el único h1 para el hero. */}
          <Reveal delay={0.12} className="mt-4">
            <h2
              id="calculator-title"
              className="max-w-2xl text-[26px] font-black leading-[1.12] tracking-tight text-brand-700 sm:text-[36px]"
            >
              {CALCULATOR_CONTENT.heading.prefix}
              <em className="italic">{CALCULATOR_CONTENT.heading.emphasis}</em>
              {CALCULATOR_CONTENT.heading.suffix}
            </h2>
          </Reveal>

          <Reveal delay={0.24} className="mt-4">
            <p className="max-w-xl text-sm text-text-secondary sm:text-base">
              {CALCULATOR_CONTENT.description}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.36} className="mt-8">
          <OpportunityCalculator />
        </Reveal>
      </Container>
    </section>
  );
}
