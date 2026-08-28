"use client";

/**
 * Columna de resultados. No recibe estado: recibe los valores ya
 * calculados y solo decide cómo se ven.
 *
 * Jerarquía deliberada (de mayor a menor peso visual):
 *   1. Oportunidad mensual -- el dato comercial protagonista.
 *   2. Proyección anual -- secundario, en la misma línea.
 *   3. Comparación hoy vs. con la mejora -- en barras.
 *   4. Conversiones -- información de soporte.
 *
 * La caja es blanca para separarse de la superficie #DFEDEF de la
 * sección y mantener el contraste del contenido secundario.
 *
 * Las barras se animan con `scaleX` y `transform-origin: left`, no con
 * `width`: escalar no recalcula el layout, así que arrastrar el slider
 * no dispara reflow en cada frame. El ratio se acota a [0.02, 1], por lo
 * que nunca puede desbordar la caja ni tomar valores negativos.
 */

import { useCallback } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, TriangleAlert } from "lucide-react";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { CALCULATOR_CONTENT } from "@/content/calculator";
import { formatConversions, formatCurrency, type CalculatorResults, type Currency } from "@/lib/calculator";

const BAR_TRANSITION = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

function ComparisonBar({
  label,
  value,
  ratio,
  currency,
  emphasis,
  reduced,
}: {
  label: string;
  value: number;
  ratio: number;
  currency: Currency;
  emphasis: boolean;
  reduced: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs font-semibold text-brand-700">{label}</span>
        <span className="text-sm font-bold text-brand-700 tabular-nums">
          {formatCurrency(value, currency)}
        </span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-pill bg-surface-soft">
        <motion.div
          className={`h-full w-full origin-left rounded-pill ${emphasis ? "bg-brand-500" : "bg-brand-36"}`}
          initial={false}
          animate={{ scaleX: ratio }}
          transition={reduced ? { duration: 0 } : BAR_TRANSITION}
        />
      </div>
    </div>
  );
}

export function CalculatorResultsPanel({
  results,
  currency,
  showWarning,
}: {
  results: CalculatorResults;
  currency: Currency;
  showWarning: boolean;
}) {
  const reduced = Boolean(useReducedMotion());

  // Memoizado por moneda: así AnimatedNumber solo reescribe el texto
  // cuando de verdad cambia el formato, y no en cada render provocado
  // por arrastrar un slider.
  const money = useCallback((value: number) => formatCurrency(value, currency), [currency]);

  // Escala compartida por las dos barras: se normaliza contra el mayor
  // de los dos escenarios. Si ambos son 0, quedan en su mínimo visible.
  const peak = Math.max(results.currentMonthlyValue, results.targetMonthlyValue);
  const ratioOf = (value: number) => (peak <= 0 ? 0.02 : Math.min(1, Math.max(0.02, value / peak)));

  return (
    <div className="flex h-full flex-col rounded-lg border border-border-soft bg-white p-5 shadow-soft sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
        {CALCULATOR_CONTENT.resultsTitle}
      </p>

      {/* <output>: el elemento pensado para el resultado de un cálculo.
          aria-live="polite" y solo sobre el valor principal -- no sobre
          todo el panel -- para no leer un anuncio nuevo en cada paso
          mientras se arrastra el slider. */}
      <output
        aria-live="polite"
        className="mt-1 block text-[32px] font-black leading-[1.05] tracking-tight text-brand-700 sm:text-[42px]"
      >
        <AnimatedNumber value={results.monthlyOpportunity} format={money} className="tabular-nums" />
      </output>

      <p className="mt-1 text-sm text-text-secondary">
        {CALCULATOR_CONTENT.annualLabel}{" "}
        <span className="font-bold text-brand-700">
          <AnimatedNumber value={results.annualOpportunity} format={money} className="tabular-nums" />
        </span>
      </p>

      {showWarning && (
        <p
          role="status"
          className="mt-3 flex items-start gap-2 rounded-md bg-surface-soft px-3 py-2 text-xs text-brand-700"
        >
          <TriangleAlert aria-hidden="true" size={14} className="mt-0.5 shrink-0" />
          {CALCULATOR_CONTENT.targetBelowCurrentWarning}
        </p>
      )}

      <div className="mt-5 space-y-3 border-t border-border-soft pt-5">
        <ComparisonBar
          label={CALCULATOR_CONTENT.barCurrentLabel}
          value={results.currentMonthlyValue}
          ratio={ratioOf(results.currentMonthlyValue)}
          currency={currency}
          emphasis={false}
          reduced={reduced}
        />
        <ComparisonBar
          label={CALCULATOR_CONTENT.barTargetLabel}
          value={results.targetMonthlyValue}
          ratio={ratioOf(results.targetMonthlyValue)}
          currency={currency}
          emphasis
          reduced={reduced}
        />
      </div>

      <div className="mt-5 border-t border-border-soft pt-5">
        <dl className="grid grid-cols-3 gap-3">
          {[
            { label: CALCULATOR_CONTENT.conversionsCurrentLabel, value: results.currentConversions },
            { label: CALCULATOR_CONTENT.conversionsTargetLabel, value: results.targetConversions },
            { label: CALCULATOR_CONTENT.conversionsExtraLabel, value: results.additionalConversions },
          ].map((item) => (
            <div key={item.label}>
              <dt className="text-[11px] text-text-secondary">{item.label}</dt>
              <dd className="mt-0.5 text-lg font-bold text-brand-700 tabular-nums">
                <AnimatedNumber value={item.value} format={formatConversions} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-1.5 text-[11px] text-text-secondary">Conversiones por mes</p>
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-border-soft pt-4 sm:mt-auto">
        {/* Aclaración visible, nunca en un tooltip. */}
        <p className="text-[10px] leading-relaxed text-text-secondary">
          {CALCULATOR_CONTENT.disclaimer}
        </p>
        {/* Botón SÓLIDO, no la píldora translúcida de antes.
            La jerarquía estaba invertida: "Restablecer" -- deshacer, la
            acción menos importante del bloque -- era un botón turquesa
            lleno, y esto, que es la conversión y llega justo después de
            que el visitante vio su propio número, era casi transparente.
            Ahora el peso visual acompaña a la importancia real. */}
        <a
          href={CALCULATOR_CONTENT.cta.href}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-pill bg-brand-500 px-5 text-sm font-semibold text-text-on-brand transition-colors duration-fast ease-brand hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:bg-brand-900"
        >
          {CALCULATOR_CONTENT.cta.label}
          <ArrowRight aria-hidden="true" size={16} strokeWidth={2} />
        </a>
      </div>
    </div>
  );
}
