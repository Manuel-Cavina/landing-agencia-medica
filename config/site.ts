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
 * Nombre comercial: "Odisea", indicado por el cliente. Reemplaza al
 * anterior estado [PENDIENTE] de docs/DECISIONS.md -- ese documento
 * todavía no se actualizó con esto (queda para cuando el cliente lo
 * confirme como definitivo). "Órbita Growth Systems" sigue descartado
 * (DESC-001) y no debe usarse.
 */
export const SITE_NAME = "Odisea";
