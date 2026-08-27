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

import { CalendarCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { RoadmapJourney } from "@/components/roadmap/roadmap-journey";
import { RoadmapStep } from "@/components/roadmap/roadmap-step";
import { PILLARS } from "@/content/pillars";
import { NAV_CTA } from "@/config/site";

export function RoadmapSection() {
  return (
    <section
      id="sistema"
      aria-labelledby="roadmap-title"
      className="relative overflow-x-clip py-20 sm:py-28"
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

        {/* Cierre del recorrido. Va FUERA de <RoadmapJourney> a
            propósito: si estuviera adentro, entraría en la medición del
            contenedor y la curva se estiraría hasta acá. DEC-013 de
            docs/DECISIONS.md pide que la línea termine en el pilar 07 y
            que no siga hacia un espacio vacío -- por eso este bloque es
            visualmente independiente, separado por su propio margen, y
            no lo toca ningún trazo.

            El copy es deliberadamente sobrio: describe qué pasa en la
            reunión, sin prometer resultados ni cifras (DEC-019,
            veracidad del contenido). Reutiliza el CTA principal de la
            página (#agendar), que es la única conversión definida en
            docs/PROJECT.md -- no se inventa una acción nueva que
            competiría con ella. */}
        <Reveal delay={0} className="mt-20 sm:mt-28">
          <div className="relative overflow-hidden rounded-lg border border-border-soft bg-brand-20 px-6 py-12 text-center backdrop-blur-sm sm:px-12 sm:py-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 left-1/2 h-[380px] w-[380px] -translate-x-1/2 rounded-pill opacity-70"
              style={{ background: "radial-gradient(closest-side, var(--brand-20), transparent)" }}
            />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-pill border border-border-soft bg-white/70 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700 backdrop-blur-sm">
                Fin del recorrido
              </span>

              <h3 className="mx-auto mt-6 max-w-2xl text-[26px] font-black leading-[1.12] tracking-tight text-brand-700 sm:text-[38px]">
                Siete pilares, <em className="italic">un solo sistema</em>.
              </h3>

              <p className="mx-auto mt-4 max-w-xl text-base text-text-secondary sm:text-lg">
                En una reunión de diagnóstico repasamos cuáles de estos pilares ya
                tenés resueltos y cuál conviene construir primero en tu caso.
              </p>

              <div className="mt-8 flex justify-center">
                <Button
                  href={NAV_CTA.href}
                  icon={<CalendarCheck aria-hidden="true" size={18} strokeWidth={2} />}
                  className="h-12 px-6 text-base"
                >
                  {NAV_CTA.label}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
