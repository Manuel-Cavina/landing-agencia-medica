/**
 * Lógica de la calculadora de oportunidad (components/calculator/*).
 *
 * Deliberadamente SIN React: es una función pura que recibe valores y
 * devuelve resultados. Así se puede probar, razonar y -- sobre todo --
 * reemplazar sin tocar ni un componente cuando se defina el modelo
 * comercial definitivo, que hoy está [PENDIENTE] (ver docs/PROJECT.md y
 * docs/sections/CALCULATOR.md).
 *
 * El modelo actual es una simulación aritmética simple: cuánto valor
 * mensual adicional representaría pasar de una tasa de conversión a
 * otra. No modela estacionalidad, costos, márgenes, plazos de cobro ni
 * tasa de repetición. No es una proyección financiera.
 */

export type Currency = "ARS" | "USD";

export type CalculatorValues = {
  /** Consultas u oportunidades que llegan por mes. */
  opportunities: number;
  /** Porcentaje (0-100) de esas oportunidades que hoy se convierten. */
  currentConversionRate: number;
  /** Porcentaje (0-100) del escenario simulado. */
  targetConversionRate: number;
  /** Valor promedio generado por cada conversión. */
  averageValue: number;
  currency: Currency;
};

export type CalculatorResults = {
  currentConversions: number;
  targetConversions: number;
  additionalConversions: number;
  currentMonthlyValue: number;
  targetMonthlyValue: number;
  monthlyOpportunity: number;
  annualOpportunity: number;
};

/**
 * Devuelve `fallback` si el número no es utilizable. Cubre los tres
 * casos que rompen una cadena aritmética y que además pueden llegar
 * desde un <input> real: NaN (campo con texto o vacío), Infinity
 * (división o desbordamiento) y undefined/null vía coerción.
 */
function safeNumber(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

export function calculateOpportunity(values: CalculatorValues): CalculatorResults {
  // No se muta el argumento: se leen copias saneadas.
  const opportunities = Math.max(0, safeNumber(values.opportunities));
  const currentRate = Math.min(100, Math.max(0, safeNumber(values.currentConversionRate)));
  const targetRate = Math.min(100, Math.max(0, safeNumber(values.targetConversionRate)));
  const averageValue = Math.max(0, safeNumber(values.averageValue));

  const currentConversions = opportunities * (currentRate / 100);
  const targetConversions = opportunities * (targetRate / 100);

  // Nunca se redondea acá: el redondeo es cosa de la presentación. Si se
  // redondeara antes de multiplicar por el valor promedio, el error se
  // amplificaría por miles.
  const currentMonthlyValue = currentConversions * averageValue;
  const targetMonthlyValue = targetConversions * averageValue;

  // Math.max(0, ...) a propósito: si la tasa objetivo es MENOR que la
  // actual, el escenario no representa una mejora. Se muestra 0 y una
  // advertencia (ver isTargetBelowCurrent), nunca un número negativo
  // presentado como "oportunidad".
  const additionalConversions = Math.max(0, targetConversions - currentConversions);
  const monthlyOpportunity = Math.max(0, targetMonthlyValue - currentMonthlyValue);

  return {
    currentConversions,
    targetConversions,
    additionalConversions,
    currentMonthlyValue,
    targetMonthlyValue,
    monthlyOpportunity,
    annualOpportunity: monthlyOpportunity * 12,
  };
}

/**
 * True cuando el escenario simulado es peor que el actual. No corrige el
 * valor que escribió el usuario -- solo habilita el aviso.
 */
export function isTargetBelowCurrent(values: CalculatorValues): boolean {
  return safeNumber(values.targetConversionRate) < safeNumber(values.currentConversionRate);
}

/**
 * Formato monetario real vía Intl. Se usa `es-AR` como locale fijo
 * (idioma de la landing) y la moneda como parámetro: por eso USD se
 * muestra como "US$", que es la forma correcta en español rioplatense.
 *
 * OJO: cambiar de moneda NO convierte importes. Solo cambia el símbolo y
 * el formato -- no hay cotización ni llamada a ninguna API. La interfaz
 * lo aclara de forma visible.
 */
export function formatCurrency(value: number, currency: Currency): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(safeNumber(value));
}

/** Conversiones: enteras si dan exactas, con un decimal si no. */
export function formatConversions(value: number): string {
  const safe = safeNumber(value);
  return new Intl.NumberFormat("es-AR", {
    maximumFractionDigits: Number.isInteger(safe) ? 0 : 1,
  }).format(safe);
}
