"use client";

/**
 * Panel interactivo de la calculadora: el único dueño del estado.
 *
 * Estado y valores derivados
 * --------------------------
 * Hay UN solo estado (`values`), con los cuatro números y la moneda. Los
 * resultados NO se guardan: se calculan a partir de ese estado en cada
 * render con `calculateOpportunity` (lib/calculator.ts). Guardarlos
 * aparte crearía dos fuentes de verdad que tarde o temprano se
 * desincronizan.
 *
 * `useMemo` acá no es por rendimiento -- son cuatro multiplicaciones --
 * sino para que el objeto de resultados mantenga su identidad entre
 * renders y no dispare efectos innecesarios río abajo.
 */

import { useCallback, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { CALCULATOR_CONTENT, CALCULATOR_DEFAULTS, CALCULATOR_FIELDS, CURRENCIES, type NumericFieldKey } from "@/content/calculator";
import { calculateOpportunity, isTargetBelowCurrent, type Currency } from "@/lib/calculator";
import { CalculatorField } from "@/components/calculator/calculator-field";
import { CalculatorResultsPanel } from "@/components/calculator/calculator-results";

export function OpportunityCalculator() {
  const [values, setValues] = useState(CALCULATOR_DEFAULTS);
  const [resetAnnouncement, setResetAnnouncement] = useState("");

  const results = useMemo(() => calculateOpportunity(values), [values]);
  const showWarning = isTargetBelowCurrent(values);

  const setField = useCallback((key: NumericFieldKey, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setCurrency = useCallback((currency: Currency) => {
    // Solo cambia el formato: los números fuente quedan intactos, no se
    // convierten importes.
    setValues((prev) => ({ ...prev, currency }));
  }, []);

  const reset = useCallback(() => {
    setValues(CALCULATOR_DEFAULTS);
    // Aviso para lectores de pantalla: el cambio es puramente visual y
    // de otra forma pasaría inadvertido.
    setResetAnnouncement("Valores restablecidos.");
    window.setTimeout(() => setResetAnnouncement(""), 1200);
  }, []);

  return (
    // La sección aporta la franja #DFEDEF; cada columna usa una superficie
    // blanca para que entradas y resultados se lean como paneles distintos.
    <div className="mx-auto max-w-5xl">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,46%)_minmax(0,54%)]">
        {/* Columna de entradas */}
        <div className="flex flex-col rounded-lg border border-border-soft bg-white p-5 shadow-soft sm:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
              {CALCULATOR_CONTENT.inputsTitle}
            </h3>

            {/* Control segmentado con carril propio (bg-brand-12).
                Antes el contenedor era `bg-white` sobre un panel que
                también es blanco: invisible. Se veía una píldora
                turquesa suelta al lado de un texto suelto, no un
                conmutador de dos opciones. El carril hace que se lea
                como UN control con dos estados. */}
            <fieldset className="flex items-center rounded-pill bg-brand-12 p-1">
              <legend className="sr-only">Moneda de visualización</legend>
              {CURRENCIES.map((option) => {
                const active = values.currency === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCurrency(option.value)}
                    className={`rounded-pill px-3 py-1 text-xs font-bold transition-colors duration-fast ease-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 ${
                      active
                        ? "bg-white text-brand-700 shadow-soft"
                        : "text-text-secondary hover:text-brand-700"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </fieldset>
          </div>

          <div className="mt-5 space-y-4">
            {CALCULATOR_FIELDS.map((config) => (
              <CalculatorField
                key={config.key}
                config={config}
                value={values[config.key]}
                currency={values.currency}
                onChange={(next) => setField(config.key, next)}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center gap-3 sm:mt-auto sm:pt-5">
            <button
              type="button"
              onClick={reset}
              // Mismo color que el CTA del navbar (components/layout/site-header.tsx):
              // turquesa solido con texto blanco.
              // Botón FANTASMA, no sólido.
              // Restablecer es la acción menos importante del bloque:
              // deshacer lo que el visitante escribió. Como pastilla
              // turquesa llena pesaba más que el CTA del panel de al
              // lado, que es la conversión real. Ahora es texto con un
              // fondo que solo aparece al pasar el mouse -- sigue
              // encontrándose, deja de gritar.
              className="inline-flex h-11 items-center gap-2 rounded-pill px-3 text-sm font-semibold text-text-secondary transition-colors duration-fast ease-brand hover:bg-brand-12 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              <RotateCcw aria-hidden="true" size={15} />
              {CALCULATOR_CONTENT.reset}
            </button>
            <span aria-live="polite" className="sr-only">
              {resetAnnouncement}
            </span>
          </div>
        </div>

        {/* Columna de resultados */}
        <CalculatorResultsPanel results={results} currency={values.currency} showWarning={showWarning} />
      </div>
    </div>
  );
}
