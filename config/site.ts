/**
 * Contenido y enlaces del navbar, en un solo lugar tipado.
 *
 * Por qué existe este archivo: docs/AGENTS.md pide separar datos y
 * presentación cuando sea razonable, y el navbar necesita los mismos
 * enlaces tanto en la versión de escritorio como en el menú móvil.
 * Si en vez de esto escribiéramos los <a> a mano dos veces, cualquier
 * cambio de texto o de ancla habría que hacerlo en dos lugares y con
 * el tiempo terminarían desincronizados.
 */

export type NavLink = {
  /** Texto visible del enlace. */
  label: string;
  /** Ancla de la landing a la que apunta (ej: "#sistema"). */
  href: `#${string}`;
};

/**
 * Enlaces de navegación central del navbar (desktop y móvil).
 * El orden de este array define el orden visual.
 */
export const NAV_LINKS: NavLink[] = [
  { label: "El sistema", href: "#sistema" },
  { label: "Resultados", href: "#resultados" },
  { label: "Calculadora", href: "#calculadora" },
  { label: "Preguntas frecuentes", href: "#preguntas-frecuentes" },
];

/**
 * Call to action principal del navbar. Vive aparte de NAV_LINKS porque
 * visualmente y semánticamente es un botón, no un link de navegación más.
 */
export const NAV_CTA = {
  label: "Agendar una reunión estratégica",
  href: "#agendar" as const,
};

/**
 * URL del formulario/calendario embebido en el CTA final.
 *
 * [PENDIENTE]. docs/PROJECT.md documenta Calendly como herramienta de
 * agendamiento y marca su URL como pendiente; el cliente mencionó Tally.
 * No se inventa ninguna de las dos.
 *
 * Mientras esto sea null, el cierre conserva su composición y no muestra
 * un control de reserva sin destino. Apenas se complete con la URL real,
 * el formulario aparece embebido sin tocar ningún componente.
 *
 * Formato esperado:
 *   Tally    -> "https://tally.so/embed/<id>?alignLeft=1&hideTitle=1&transparentBackground=1"
 *   Calendly -> "https://calendly.com/<usuario>/<evento>?embed_domain=...&embed_type=Inline"
 */
export const BOOKING_EMBED_URL: string | null = null;

/**
 * Índice lateral de secciones (components/layout/section-index.tsx).
 *
 * Por qué NO se deriva de NAV_LINKS, aunque se parezcan: son dos cosas
 * distintas y mezclarlas rompería una de las dos.
 *
 * 1. El ORDEN es diferente. NAV_LINKS lista "El sistema" antes que
 *    "Resultados" porque así se decidió el menú, pero en el documento
 *    Resultados aparece ANTES que el roadmap. Un índice que sigue el
 *    scroll tiene que estar en orden de documento o la marca de sección
 *    activa salta hacia atrás.
 * 2. Tiene DOS entradas que el navbar no tiene: el inicio y el cierre.
 *    El navbar ya lleva "Agendar" como botón y el logo como vuelta al
 *    inicio, así que no las repite como links.
 *
 * Las etiquetas se mantienen cortas: acá se leen en vertical y al lado
 * del contenido, no en una barra con espacio de sobra.
 */
export const SECTION_INDEX: NavLink[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Resultados", href: "#resultados" },
  { label: "El sistema", href: "#sistema" },
  { label: "Calculadora", href: "#calculadora" },
  { label: "Preguntas", href: "#preguntas-frecuentes" },
  { label: "Agendar", href: "#agendar" },
];

/**
 * Nombre comercial: "Odisea", indicado por el cliente. Reemplaza al
 * anterior estado [PENDIENTE] de docs/DECISIONS.md -- ese documento
 * todavía no se actualizó con esto (queda para cuando el cliente lo
 * confirme como definitivo). "Órbita Growth Systems" sigue descartado
 * (DESC-001) y no debe usarse.
 */
export const SITE_NAME = "Odisea";
