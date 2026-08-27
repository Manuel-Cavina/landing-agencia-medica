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
 * ⚠️ `public/preview-photo-do-not-ship.jpeg` es una foto real de una
 * persona real (el nombre del archivo lo deja explícito a propósito). Se
 * usa acá SOLO para previsualizar cómo se ve una foto de verdad en cada
 * variante de tarjeta (recorte, tamaño, vidrio encima) mientras se elige
 * un diseño -- ver components/results/professional-card.tsx. Nunca debe
 * llegar a producción pegada a un nombre inventado como "Dra. Renata
 * M.": eso sería mostrar la cara de una persona real bajo una identidad
 * profesional ficticia, exactamente lo que prohíbe AGENTS.md ("no
 * descargar fotografías de médicos desconocidos; no inventar
 * identidades visuales"). Sacar este `image` de los 6 casos apenas se
 * elija una variante y antes de cualquier revisión visual con el
 * cliente fuera de esta exploración puntual.
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
    image: "/preview-photo-do-not-ship.jpeg",
    category: "professional",
    name: "[PLACEHOLDER] Dra. Renata M.",
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
    image: "/preview-photo-do-not-ship.jpeg",
    category: "clinic",
    name: "[PLACEHOLDER] Clínica F.C.",
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
    image: "/preview-photo-do-not-ship.jpeg",
    category: "company",
    name: "[PLACEHOLDER] Grupo L.V.",
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
    image: "/preview-photo-do-not-ship.jpeg",
    category: "professional",
    name: "[PLACEHOLDER] Dr. Tomás B.",
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
    image: "/preview-photo-do-not-ship.jpeg",
    category: "clinic",
    name: "[PLACEHOLDER] Estudio K.R.",
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
    image: "/preview-photo-do-not-ship.jpeg",
    category: "clinic",
    name: "[PLACEHOLDER] Clínica N.P.",
    specialty: "Nutrición y estética",
    quote:
      "El diagnóstico inicial nos mostró en qué parte del proceso perdíamos más pacientes.",
    metricLabel: "Facturación generada en 12 meses",
    value: 15_500_000,
    currency: "ARS",
  },
];
