/**
 * Contenido de los siete pilares del roadmap (components/sections/
 * roadmap-section.tsx y components/roadmap/*). Centralizado acá para no
 * duplicar datos dentro del JSX (docs/AGENTS.md, "separar datos y
 * presentación").
 *
 * `iconName` es una clave serializable (string), NO el componente de
 * Lucide directamente: este archivo lo importa components/sections/
 * roadmap-section.tsx, un Server Component, que le pasa cada `pillar`
 * como prop a components/roadmap/roadmap-step.tsx y de ahí a componentes
 * "use client" (roadmap-card.tsx, roadmap-visual.tsx). React no puede
 * serializar funciones/componentes al cruzar de un Server Component a un
 * Client Component como prop -- por eso el ícono real (el componente de
 * Lucide) se resuelve recién adentro de roadmap-visual.tsx, vía el mapa
 * `ICONS`, nunca acá.
 *
 * Provisional: docs/DECISIONS.md marca los nombres de los pilares como
 * PROVISIONAL (DEC-P01) y los copys de diseño como PROVISIONAL (DEC-P04).
 * Reemplazar acá, en un solo lugar, cuando el cliente valide el contenido
 * definitivo -- no hace falta tocar ningún componente.
 */

export type RoadmapIconName =
  | "sparkles"
  | "users"
  | "network"
  | "bot"
  | "clipboard"
  | "calendar"
  | "chart";

export type Pillar = {
  id: string;
  slug: string;
  /** "01".."07". */
  number: string;
  title: string;
  category: string;
  /** Descripción breve, para el estado siempre visible de la tarjeta. */
  summary: string;
  /** Descripción completa, para el contenido expandido ("Ver más"). */
  description: string;
  solves: string;
  deliverables: string[];
  enables: string;
  iconName: RoadmapIconName;
  /** Sin imagen real todavía: queda undefined a propósito. Cuando exista,
   *  reemplaza la composición abstracta en components/roadmap/roadmap-visual.tsx. */
  image?: string;
};

export const PILLARS: Pillar[] = [
  {
    id: "oferta",
    slug: "oferta",
    number: "01",
    title: "Oferta",
    category: "Posicionamiento",
    summary: "Una propuesta clara, diferenciada y fácil de comprender.",
    description:
      "Organizamos los servicios, la propuesta de valor y los diferenciales para construir una oferta coherente y comercialmente clara.",
    solves: "Evita comunicar servicios aislados sin una propuesta que los conecte.",
    deliverables: ["Estructura de la oferta", "Propuesta de valor", "Diferenciación", "Organización de servicios"],
    enables: "Una base clara para investigar y atraer al público correcto.",
    iconName: "sparkles",
  },
  {
    id: "avatar",
    slug: "avatar",
    number: "02",
    title: "Avatar",
    category: "Investigación",
    summary: "Comprender a quién queremos ayudar antes de comunicar.",
    description:
      "Analizamos necesidades, objeciones, expectativas, búsquedas y criterios de decisión de las personas a las que se dirige la propuesta.",
    solves: "Evita construir mensajes genéricos basados únicamente en suposiciones.",
    deliverables: ["Perfil del público", "Necesidades", "Objeciones", "Motivaciones", "Recorrido de decisión"],
    enables: "Una comunicación más relevante y una experiencia digital mejor orientada.",
    iconName: "users",
  },
  {
    id: "ecosistema",
    slug: "ecosistema",
    number: "03",
    title: "Ecosistema",
    category: "Experiencia",
    summary: "Todos los puntos de contacto funcionando como un sistema.",
    description:
      "Conectamos la landing, el contenido, los canales de contacto y los puntos de conversión dentro de una misma experiencia.",
    solves: "Evita que cada canal funcione de manera aislada o contradictoria.",
    deliverables: ["Landing", "Contenido", "Canales", "Puntos de contacto", "Medición"],
    enables: "Un entorno preparado para recibir, acompañar y organizar consultas.",
    iconName: "network",
  },
  {
    id: "asistente-ia",
    slug: "asistente-ia",
    number: "04",
    title: "Asistente IA",
    category: "Automatización",
    summary: "Acompañamiento inicial y organización de consultas.",
    // El asistente no se presenta como profesional médico, no realiza ni
    // promete diagnósticos (pedido explícito del cliente) -- el copy de
    // abajo respeta esa restricción a propósito.
    description:
      "El asistente responde preguntas frecuentes, reúne información inicial y orienta cada contacto hacia el próximo paso adecuado.",
    solves: "Reduce demoras y evita que las oportunidades queden sin una primera respuesta.",
    deliverables: ["Respuestas frecuentes", "Captura inicial", "Clasificación", "Derivación", "Disponibilidad ampliada"],
    enables: "Consultas mejor organizadas antes de la intervención humana.",
    iconName: "bot",
  },
  {
    id: "prevaloracion",
    slug: "prevaloracion",
    number: "05",
    title: "Prevaloración",
    category: "Calificación",
    summary: "Información inicial para orientar mejor cada consulta.",
    // La prevaloración no reemplaza una evaluación profesional ni se
    // presenta como diagnóstico médico (mismo pedido explícito de arriba).
    description:
      "Reunimos datos relevantes y organizamos el contexto de cada persona antes de la atención personalizada.",
    solves: "Evita comenzar cada conversación sin información suficiente.",
    deliverables: ["Formularios", "Datos iniciales", "Criterios de orientación", "Contexto", "Derivación"],
    enables: "Un seguimiento más claro y una atención mejor preparada.",
    iconName: "clipboard",
  },
  {
    id: "conversion",
    slug: "conversion",
    number: "06",
    title: "Conversión",
    category: "Seguimiento",
    summary: "Convertir consultas en próximos pasos concretos.",
    description:
      "Organizamos el contacto, el seguimiento, los recordatorios y el agendamiento para acompañar cada oportunidad.",
    solves: "Evita perder consultas por respuestas tardías o seguimientos desordenados.",
    deliverables: ["Seguimiento", "Recordatorios", "Agenda", "Estados", "Próximos pasos"],
    enables: "Un proceso comercial más claro, medible y consistente.",
    iconName: "calendar",
  },
  {
    id: "escala",
    slug: "escala",
    number: "07",
    title: "Escala",
    category: "Optimización",
    summary: "Medir, aprender y mejorar el sistema completo.",
    description:
      "Analizamos información y resultados para detectar oportunidades, corregir fricciones y sostener el crecimiento.",
    solves: "Evita crecer sin control, sin información y sin capacidad de mejora.",
    deliverables: ["Métricas", "Tableros", "Análisis", "Experimentación", "Optimización"],
    enables: "Crecimiento más controlado, previsible y sostenible.",
    iconName: "chart",
  },
];
