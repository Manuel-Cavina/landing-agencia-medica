/**
 * Preguntas frecuentes de la landing.
 *
 * Vive en content/ y no en config/ porque es CONTENIDO editable, igual
 * que content/calculator.ts y content/pillars.ts. config/ está reservado
 * para configuración estructural del sitio (config/site.ts: enlaces y
 * anclas del navbar).
 *
 * Un solo array tipado: el componente nunca repite preguntas a mano en
 * JSX, y el JSON-LD de FAQPage se genera desde esta MISMA fuente, así
 * que el marcado no puede desincronizarse del texto visible (requisito
 * de docs/SEO_GEO.md sección 8: "el marcado debe representar contenido
 * visible y real").
 *
 * Veracidad (DEC-019): ninguna respuesta promete plazos, cifras,
 * resultados garantizados ni condiciones comerciales. Deliberadamente NO
 * se afirma que la reunión sea gratuita ni sin compromiso -- eso no está
 * confirmado en docs/PROJECT.md. Tampoco se dan tiempos de
 * implementación concretos, por el mismo motivo.
 *
 * CUATRO preguntas, no ocho. Se recortó a pedido del cliente ("la idea
 * es mockear, así que no pongas mucho"). Las cuatro que quedaron arman
 * un arco de decisión completo:
 *
 *   qué es  ->  si es para mí  ->  la objeción  ->  el próximo paso
 *
 * Las cuatro que salieron eran operativas (equipo previo, plazos,
 * medición, integración de herramientas): útiles, pero se responden
 * mejor en la reunión que en una landing. Están guardadas en
 * docs/sections/FAQ_CTA_FOOTER.md para recuperarlas cuando haga falta.
 */

export type FaqItem = {
  /** Identificador estable; forma los ids de aria-controls. */
  id: string;
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: "que-construyen",
    question: "¿Qué construyen exactamente?",
    answer:
      "Diseñamos un sistema de crecimiento adaptado a cada negocio. El trabajo puede integrar la oferta, el posicionamiento, la captación de oportunidades, la calificación de consultas, el seguimiento comercial, la conversión y la medición. El alcance definitivo se establece después de analizar la situación actual.",
  },
  {
    id: "para-quien",
    question: "¿Para quién está pensado este sistema?",
    answer:
      "Está pensado para clínicas de medicina estética, cirujanos plásticos y centros con tratamientos de alto valor que quieren ordenar su proceso comercial y crecer con una estructura más clara. Antes de comenzar evaluamos si el servicio, el momento del negocio y los objetivos son compatibles con el sistema.",
  },
  {
    id: "solo-publicidad",
    question: "¿Es solamente un servicio de publicidad?",
    answer:
      "No. La publicidad puede ser una parte del sistema, pero no funciona de manera aislada. También analizamos la oferta, el recorrido del potencial cliente, los filtros, el seguimiento, la conversión y los indicadores necesarios para tomar decisiones.",
  },
  {
    id: "reunion-estrategica",
    question: "¿Qué sucede en la reunión estratégica?",
    answer:
      "La reunión sirve para conocer el contexto, los objetivos y los principales obstáculos del negocio. También permite evaluar si existe una oportunidad concreta de trabajo y definir cuáles podrían ser los siguientes pasos.",
  },
];

export const FAQ_CONTENT = {
  eyebrow: "Preguntas frecuentes",
  heading: {
    prefix: "Antes de avanzar, ",
    emphasis: "resolvamos tus dudas",
    suffix: ".",
  },
  description:
    "Estas son algunas de las preguntas que suelen aparecer antes de construir un sistema de crecimiento.",
  // `asidePrompt` se eliminó junto con el recuadro "¿Tenés otra
  // consulta?" de la columna izquierda (ver components/sections/faq-section.tsx).
};
