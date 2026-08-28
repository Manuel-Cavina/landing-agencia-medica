/**
 * Casos de la sección "Resultados" (components/sections/results-section.tsx).
 * Separado del componente para no duplicar casos dentro del JSX.
 *
 * TODOS los casos de acá son demostrativos (status: "placeholder"). No hay
 * nombres, cifras ni testimonios reales todavía -- ver docs/DECISIONS.md
 * ("[PENDIENTE] Casos, testimonios y cifras validadas") y DEC-019
 * (veracidad del contenido). Cuando existan casos reales, agregarlos con
 * status: "validated" y una fotografía real en `image`.
 *
 * Mientras no haya material validado, las tarjetas muestran una
 * composición abstracta por categoría. No se asocia una persona real
 * con una identidad o un testimonio ficticios.
 */

export type ProfessionalCase = {
  id: string;
  status: "placeholder" | "validated";
  category: "professional" | "clinic" | "company";
  name: string;
  specialty: string;
  quote: string;
  /** Sin imagen real todavía: queda undefined a propósito (no se inventa
   *  ni se descarga la foto de un profesional que no existe). */
  image?: string;
  metricLabel: string;
  value: number;
  currency: string;
  suffix?: string;
};

export const RESULTS_CASES: ProfessionalCase[] = [
  {
    id: "renata-m",
    status: "placeholder",
    category: "professional",
    name: "Dra. Renata M.",
    specialty: "Medicina estética",
    quote:
      "El sistema ordenó todo el proceso, desde la primera consulta hasta el seguimiento.",
    metricLabel: "Facturación generada en 12 meses",
    value: 52_000_000,
    currency: "ARS",
  },
  {
    id: "clinica-fc",
    status: "placeholder",
    category: "clinic",
    name: "Clínica F.C.",
    specialty: "Cirugía plástica",
    quote:
      "Pudimos ver en un solo lugar cada oportunidad, desde que entra hasta que se convierte.",
    metricLabel: "Facturación generada en 12 meses",
    value: 38_000_000,
    currency: "ARS",
  },
  {
    id: "grupo-lv",
    status: "placeholder",
    category: "company",
    name: "Grupo L.V.",
    specialty: "Dermatología avanzada",
    quote:
      "Dejamos de perder consultas por falta de seguimiento ordenado.",
    metricLabel: "Facturación generada en 12 meses",
    value: 24_000_000,
    currency: "ARS",
  },
  {
    id: "tomas-b",
    status: "placeholder",
    category: "professional",
    name: "Dr. Tomás B.",
    specialty: "Odontología estética",
    quote:
      "La calificación automática de consultas nos ahorró horas de trabajo administrativo.",
    metricLabel: "Facturación generada en 12 meses",
    value: 19_000_000,
    currency: "ARS",
  },
  {
    id: "estudio-kr",
    status: "placeholder",
    category: "clinic",
    name: "Estudio K.R.",
    specialty: "Medicina capilar",
    quote:
      "Tener estrategia, adquisición y seguimiento conectados cambió cómo tomamos decisiones.",
    metricLabel: "Facturación generada en 12 meses",
    value: 31_000_000,
    currency: "ARS",
  },
  {
    id: "clinica-np",
    status: "placeholder",
    category: "clinic",
    name: "Clínica N.P.",
    specialty: "Nutrición y estética",
    quote:
      "El diagnóstico inicial nos mostró en qué parte del proceso perdíamos más pacientes.",
    metricLabel: "Facturación generada en 12 meses",
    value: 15_500_000,
    currency: "ARS",
  },
];
