"use client";

/**
 * Un campo de la calculadora: etiqueta, descripción, slider e input
 * numérico, todos apuntando al MISMO valor del estado.
 *
 * Sincronización slider <-> input
 * ------------------------------
 * No hay dos estados. Los dos controles leen `value` del padre y ambos
 * llaman a `onChange`, así que por construcción no pueden desincronizarse.
 *
 * El input de texto necesita un matiz: mientras se escribe hay estados
 * intermedios que no son números válidos (campo vacío, un "-" suelto).
 * Si se forzara el valor en cada tecla, sería imposible borrar para
 * reescribir. Por eso el input guarda un borrador local (`draft`)
 * mientras está enfocado y recién al salir (blur) se confirma: se
 * interpreta, se recorta a [min, max] y se sincroniza. Si quedó
 * inutilizable, vuelve al último valor válido -- nunca NaN.
 *
 * El slider es un <input type="range"> nativo: ya trae accesibilidad de
 * teclado, soporte táctil y semántica correcta. Solo se le cambia la
 * piel con CSS (.calculator-range en app/globals.css); no se reimplementa
 * con listeners de puntero.
 */

import { useId, useState } from "react";
import type { NumericFieldConfig } from "@/content/calculator";
import type { Currency } from "@/lib/calculator";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function CalculatorField({
  config,
  value,
  currency,
  onChange,
}: {
  config: NumericFieldConfig;
  value: number;
  currency: Currency;
  onChange: (value: number) => void;
}) {
  const inputId = useId();
  const [draft, setDraft] = useState<string | null>(null);

  // Relleno del track hasta el thumb, como porcentaje. Lo consume el CSS
  // vía la custom property --range-progress.
  const progress =
    config.max === config.min ? 0 : ((clamp(value, config.min, config.max) - config.min) / (config.max - config.min)) * 100;

  const commitDraft = () => {
    if (draft === null) return;
    const parsed = Number(draft.replace(",", "."));
    // Si quedó vacío o ilegible, se conserva el último valor válido.
    onChange(Number.isFinite(parsed) ? clamp(parsed, config.min, config.max) : value);
    setDraft(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        {/* `title` conserva la explicación larga para quien la necesite,
            sin ocupar una línea de texto en pantalla. */}
        <label
          htmlFor={inputId}
          title={config.description}
          className="text-[13px] font-semibold text-brand-700"
        >
          {config.label}
        </label>

        {/* Sin borde ni caja visible: el numero se apoya directo sobre el
            fondo del panel. El recuadro sigue existiendo en el DOM porque
            agrupa simbolo de moneda + input + unidad, pero no se pinta.
            El anillo de foco se conserva -- es la unica senal de que el
            numero es editable para quien navega con teclado. */}
        <div className="flex shrink-0 items-center gap-1 rounded-md px-2.5 py-1 focus-within:ring-2 focus-within:ring-brand-36">
          {config.isCurrency && (
            <span aria-hidden="true" className="text-xs font-semibold text-brand-700/70">
              {currency === "ARS" ? "$" : "US$"}
            </span>
          )}
          <input
            id={inputId}
            // "decimal" y no "numeric": habilita la coma/punto en el
            // teclado del teléfono, necesario para tasas con decimales.
            inputMode="decimal"
            type="text"
            value={draft ?? String(value)}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                commitDraft();
              }
            }}
            className="w-[7ch] bg-transparent text-right text-sm font-bold text-brand-700 tabular-nums outline-none"
          />
          {config.unit && (
            <span aria-hidden="true" className="text-xs font-semibold text-brand-700/70">
              {config.unit}
            </span>
          )}
        </div>
      </div>

      <input
        type="range"
        aria-label={config.label}
        min={config.min}
        max={config.max}
        step={config.step}
        value={clamp(value, config.min, config.max)}
        onChange={(event) => onChange(Number(event.target.value))}
        style={{ ["--range-progress" as string]: `${progress}%` }}
        className="calculator-range mt-2 w-full"
      />
    </div>
  );
}
