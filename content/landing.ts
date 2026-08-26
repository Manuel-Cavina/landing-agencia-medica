import type { HeroVideo } from "@/components/media/youtube-facade";

/**
 * Contenido del hero, separado de components/sections/hero.tsx para poder
 * reemplazarlo sin tocar el componente.
 *
 * Aviso importante: este copy todavía NO es definitivo. El cliente pidió
 * mostrarlo sin las etiquetas [PLACEHOLDER] en pantalla (más fácil de
 * evaluar visualmente), pero sigue siendo contenido de muestra a validar
 * antes de publicar — ver docs/DECISIONS.md (copy comercial [PENDIENTE])
 * y DEC-019 (veracidad del contenido).
 */
export const HERO_CONTENT = {
  // Píldora entre el navbar y el título (a pedido del cliente, sobre una
  // referencia visual). Texto de muestra, fácil de cambiar acá sin tocar
  // el componente.
  badge: {
    label: "Conocé el nuevo sistema de crecimiento",
    href: "#sistema" as const,
  },

  // El título se arma como prefijo + fragmento en cursiva + sufijo para
  // poder darle énfasis a una palabra sin cambiar de tipografía (el
  // cliente pidió mantener Inter en todo el sitio, incluido el título).
  heading: {
    prefix: "Convertimos atención en ",
    emphasis: "pacientes",
    suffix: " de alto valor.",
  },

  description:
    "Diseñamos un sistema de captación, calificación y seguimiento para clínicas que quieren crecer con mayor claridad y previsibilidad.",

  cta: {
    label: "Agendar una reunión estratégica",
    href: "#agendar" as const,
  },

  // Link secundario junto al CTA: una acción distinta (ver el video) y no
  // otro "agendar" compitiendo con el CTA principal. Apunta al propio
  // video del hero (id="hero-video" en hero.tsx), no a #sistema -- el
  // texto ahora habla de ver el video, así que tiene que llevar ahí.
  secondaryLink: {
    label: "Ver video",
    href: "#hero-video" as const,
  },

  // youtubeId en null hasta tener el video real: no se inventa un ID de
  // muestra. Mientras tanto, YouTubeFacade muestra un estado pendiente.
  video: {
    youtubeId: null,
    title: "cómo funciona nuestro sistema",
  } satisfies HeroVideo,
};

/**
 * Franja de contadores animados debajo del hero (components/sections/
 * stats-strip.tsx). Esto es, en rigor, contenido de la sección
 * "Resultados" que docs/AGENTS.md reserva para más adelante -- lo
 * adelantamos a pedido explícito del cliente, pero SIN inventar cifras de
 * resultados de clínicas/pacientes (eso violaría DEC-019, veracidad del
 * contenido). Por eso los cuatro valores describen el ALCANCE del
 * sistema (cuántos pilares tiene, cuánto tarda implementarse), no
 * resultados económicos o médicos de terceros. "7 pilares" es un dato
 * real (docs/AGENTS.md, sección "Siete pilares y roadmap"); los otros
 * tres son estimaciones ilustrativas, marcadas como tales en la propia
 * página (ver el caption debajo de la franja).
 */
export const STATS: { value: number; suffix: string; label: string }[] = [
  { value: 7, suffix: "", label: "Pilares del sistema" },
  { value: 5, suffix: "", label: "Canales conectados en un solo panel" },
  { value: 30, suffix: "+", label: "Días estimados de implementación" },
  { value: 24, suffix: "h", label: "Acompañamiento durante el arranque" },
];
