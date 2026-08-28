import type { CalculatorValues, Currency } from "@/lib/calculator";

/**
 * Contenido y configuración de la calculadora. Todo lo editable vive
 * acá: copys, valores iniciales, límites y pasos. Ningún componente
 * repite estos números.
 *
 * PROVISIONAL. El modelo comercial definitivo está [PENDIENTE]
 * (docs/PROJECT.md). Los valores iniciales son demostrativos: sirven
 * para que el visitante entienda de un vistazo cómo funciona, no son
 * datos de ningún cliente real ni promedios del sector (DEC-019).
 */

export type NumericFieldKey = Exclude<keyof CalculatorValues, "currency">;

export type NumericFieldConfig = {
  key: NumericFieldKey;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  /** Sufijo visible junto al input (ej. "%"). */
  unit?: string;
  /** Si es true, el campo se muestra con el símbolo de la moneda activa. */
  isCurrency?: boolean;
};

export const CALCULATOR_DEFAULTS: CalculatorValues = {
  opportunities: 100,
  currentConversionRate: 10,
  targetConversionRate: 20,
  averageValue: 500000,
  currency: "ARS",
};

/**
 * Etiquetas cortas y autoexplicativas. Antes cada campo llevaba además
 * una descripción de una línea; se sacaron porque entre las cuatro
 * sumaban más texto que toda la calculadora junta y el panel se volvía
 * ilegible de un vistazo. La descripción larga sobrevive solo como
 * `title` accesible donde el nombre corto podría quedar ambiguo.
 */
export const CALCULATOR_FIELDS: NumericFieldConfig[] = [
  {
    key: "opportunities",
    label: "Consultas por mes",
    description: "Personas que consultan o muestran interés cada mes.",
    min: 0,
    max: 1000,
    step: 1,
  },
  {
    key: "currentConversionRate",
    label: "Conversión actual",
    description: "Porcentaje de consultas que hoy se convierten.",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
  },
  {
    key: "targetConversionRate",
    label: "Conversión objetivo",
    description: "Porcentaje del escenario que querés simular.",
    min: 0,
    max: 100,
    step: 1,
    unit: "%",
  },
  {
    key: "averageValue",
    label: "Valor por conversión",
    description: "Valor promedio que genera cada paciente o cliente.",
    min: 0,
    max: 5_000_000,
    step: 10_000,
    isCurrency: true,
  },
];

export const CURRENCIES: { value: Currency; label: string }[] = [
  { value: "ARS", label: "ARS" },
  { value: "USD", label: "USD" },
];

export const CALCULATOR_CONTENT = {
  eyebrow: "Simulá tu oportunidad",
  heading: {
    prefix: "Convertí tus números en una ",
    emphasis: "proyección más clara",
    suffix: ".",
  },
  description:
    "Ingresá algunos datos básicos para estimar cómo una mejora en la conversión podría impactar en el valor generado cada mes.",

  inputsTitle: "Tus números",
  reset: "Restablecer",

  resultsTitle: "Oportunidad mensual estimada",
  annualLabel: "Al año",
  barCurrentLabel: "Hoy",
  barTargetLabel: "Con la mejora",
  conversionsCurrentLabel: "Hoy",
  conversionsTargetLabel: "Objetivo",
  conversionsExtraLabel: "Extra",

  targetBelowCurrentWarning:
    "La conversión objetivo es menor que la actual. Subila para simular una mejora.",

  // Aclaración visible, nunca en tooltip ni en metadata (docs/SEO_GEO.md:
  // no marcar cifras demostrativas como datos estructurados). Antes eran
  // dos párrafos; se fusionaron en una línea para bajar el ruido sin
  // perder ninguna de las dos advertencias.
  disclaimer:
    "Estimación calculada solo con los datos que ingreses; no es una garantía de resultados. Cambiar de moneda cambia el formato, no convierte importes.",

  cta: {
    label: "Quiero analizar mi caso",
    href: "#agendar" as const,
  },
};
