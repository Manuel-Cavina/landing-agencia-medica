/**
 * Roadmap vertical y curvo de los siete pilares (id="sistema"), entre
 * Resultados y la próxima sección de la landing. Reemplaza a la sección
 * interactiva "El ecosistema" (ver docs/sections/ROADMAP.md, "Objetivo
 * visual", para el porqué del reemplazo).
 *
 * Server Component: la interactividad (progreso de scroll, dibujo de la
 * curva, aparición de tarjetas, disclosure "Ver más") vive aislada en
 * components/roadmap/*. Acá solo hay encabezado + estructura semántica
 * (<ol>/<li>), igual que el resto de las secciones de la landing.
 *
 * id="sistema": el navbar (config/site.ts, NAV_LINKS) ya apunta a
 * "#sistema" desde que se construyó ("El sistema"). Antes lo usaba
 * components/sections/ecosystem-section.tsx (eliminado en esta tarea);
 * ahora es esta sección la única que lo declara.
 *
 * overflow-x-clip: antes de entrar en vista, las tarjetas del lado
 * derecho (components/roadmap/roadmap-card.tsx) arrancan con un
 * transform de +18px sin animar todavía -- en móvil eso empuja el ancho
 * de la página unos px más allá del viewport (confirmado con
 * scrollWidth) mientras la tarjeta sigue oculta (opacity:0). Se contiene
 * acá, en el eje horizontal únicamente. `overflow-x-clip` en vez de
 * `overflow-x-hidden`: recorta igual, pero no convierte a la sección en
 * un contenedor con semántica de scroll (no crea un nuevo "scroll
 * container" para lectores de pantalla ni para el foco por teclado) y no
 * corta sombras que sobresalgan del flujo normal en el eje vertical.
 *
 * Halos: dos zonas amplias de luz turquesa a lo largo de toda la
 * sección (arriba y a mitad de recorrido), mismo recurso que hero.tsx y
 * results-section.tsx (radial-gradient, sin filter:blur -- no repinta en
 * cada frame), para que el fondo no quede plano frente a esas dos
 * secciones.
 */

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { RoadmapJourney } from "@/components/roadmap/roadmap-journey";
import { RoadmapStep } from "@/components/roadmap/roadmap-step";
import { PILLARS } from "@/content/pillars";

export function RoadmapSection() {
  return (
    <section
      id="sistema"
      aria-labelledby="roadmap-title"
      // Padding simétrico con Calculadora y FAQ (py-14 / sm:py-20). El
      // `pb-0` de antes existía solo mientras la franja turquesa de
      // cierre era el último elemento de la sección; sin ella, la
      // sección necesita su propio aire abajo.
      className="relative overflow-x-clip py-14 sm:py-20"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 right-[8%] h-[480px] w-[480px] rounded-pill opacity-60"
          style={{ background: "radial-gradient(closest-side, var(--brand-20), transparent)" }}
        />
        <div
          className="absolute top-[55%] left-[4%] h-[420px] w-[420px] rounded-pill opacity-50"
          style={{ background: "radial-gradient(closest-side, var(--brand-12), transparent)" }}
        />
      </div>

      <Container className="relative">
        <div className="text-left">
          <Reveal delay={0}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
              <span aria-hidden="true" className="h-px w-6 bg-brand-500" />
              El sistema
            </span>
          </Reveal>

          {/* h2, no h1: docs/SEO_GEO.md reserva el único h1 de la página
              para el hero. Misma escala que "Resultados que se pueden
              entender y medir" (text-[28px] sm:text-[40px] font-black). */}
          <Reveal delay={0.12} className="mt-5">
            <h2
              id="roadmap-title"
              className="max-w-2xl text-[28px] font-black leading-[1.15] tracking-tight text-brand-700 sm:text-[40px]"
            >
              Siete pilares. Un <em className="italic">recorrido conectado</em> de crecimiento.
            </h2>
          </Reveal>

          <Reveal delay={0.24} className="mt-5">
            <p className="max-w-md text-left text-sm text-text-secondary sm:text-base">
              Cada etapa resuelve una parte del proceso y habilita la siguiente. El
              objetivo no es sumar acciones aisladas, sino construir un sistema capaz
              de atraer, organizar, convertir, medir y mejorar.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.36} className="mt-12 sm:mt-16">
          {/* RoadmapJourney dibuja, por encima de toda la lista, UNA
              sola línea continua del nodo 01 al 07 más los siete nodos
              (ver components/roadmap/roadmap-journey.tsx). El <ol> le
              llega como children y conserva intacta su semántica. */}
          <RoadmapJourney total={PILLARS.length}>
            {/* <ol>: el orden 01-07 es semántico, no solo visual (docs/
                SEO_GEO.md, "no saltar niveles de encabezado"; cada pilar
                usa h3 dentro de su tarjeta). list-none saca el número de
                lista del navegador -- ya está el número real como texto
                visible dentro de cada tarjeta, uno más sería redundante. */}
            <ol className="flex list-none flex-col">
              {PILLARS.map((pillar, index) => (
                <RoadmapStep key={pillar.id} pillar={pillar} index={index} />
              ))}
            </ol>
          </RoadmapJourney>
        </Reveal>

      </Container>
    </section>
  );
}

/* ELIMINADO: franja de cierre "Siete pilares. Un solo sistema."
   ------------------------------------------------------------
   Era una banda turquesa a todo el ancho con tres tarjetas (Dónde estás
   hoy / Qué construir primero / Cómo se sostiene) y un CTA.

   Se sacó a pedido del cliente ("siento que no dice nada"), y la
   auditoría de diseño coincidía por tres motivos medidos:

   1. Redundante. Su título repetía "siete pilares", que es exactamente
      lo que ya dice el h2 de la sección unos scrolls más arriba.
   2. Peso. La sección del roadmap ya ocupaba 4551px, el 47% de toda la
      página. Esta franja aportaba ~500px de eso sin información nueva.
   3. CTA duplicado. Su botón era el quinto "Agendar una reunión
      estratégica" de la página (navbar, hero, éste, FAQ, CTA final).
      Repetir la misma acción le quita peso, no se lo suma.

   Con la franja afuera, la sección vuelve a tener padding inferior
   propio: el `pb-0` existía solo porque la banda cerraba la sección y
   cualquier padding metía una franja blanca entre ella y la sección
   siguiente. Ese problema ya no existe.

   DEC-013 se sigue cumpliendo: la línea termina en el pilar 07. */
