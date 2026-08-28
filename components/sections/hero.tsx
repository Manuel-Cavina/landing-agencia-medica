/**
 * Hero de la landing comercial.
 *
 * Sigue siendo Server Component: no tiene "use client" propio. La
 * interactividad (motion de entrada, botón de play del video) vive
 * aislada en dos componentes chicos —Reveal y YouTubeFacade— que este
 * componente solo usa, sin heredar su necesidad de JavaScript en el
 * cuerpo principal del texto.
 *
 * Lee antes: docs/DESIGN_SYSTEM.md sección 3 (tipografía), sección 7
 * ("Video principal") y sección 9 (motion). El contenido vive aparte en
 * content/landing.ts.
 */

import { ArrowRight, CalendarCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { YouTubeFacade } from "@/components/media/youtube-facade";
import { HERO_CONTENT } from "@/content/landing";

// Ruido extremadamente sutil (docs/DESIGN_SYSTEM.md, fondo del hero).
// Un data URI evita pedir un archivo extra solo para una textura de 0.03
// de opacidad; feTurbulence genera el grano sin ningún asset descargado.
const GRAIN_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function Hero() {
  return (
    <section
      // id="inicio": destino del enlace "Volver arriba" del footer
      // (components/layout/site-footer.tsx). Es lo único que se agregó al
      // hero en esta tarea -- el ancla no existía y sin ella el enlace
      // habría apuntado a la nada. No cambia nada visual.
      id="inicio"
      className="relative overflow-hidden"
      // Fondo plano #DFEDEF, el MISMO que la sección de preguntas
      // frecuentes, a pedido del cliente: la página abre y cierra sobre
      // el mismo tono. Reemplaza al degradado diagonal anterior
      // (blanco -> brand-12 -> brand-20 -> blanco).
      //
      // Los halos y el grano de abajo siguen encima y siguen leyéndose:
      // brand-20 compuesto sobre #DFEDEF da rgb(192,225,228), claramente
      // más saturado que el fondo, así que la textura no se pierde.
      style={{ background: "#DFEDEF" }}
    >
      {/* Fondo decorativo: halos difuminados en color de marca + grano
          extremadamente ligero, encima del degradado diagonal de arriba.
          Puramente visual (aria-hidden), y con overflow-hidden en la
          sección para que ningún halo genere scroll horizontal en móvil.
          Los halos son radial-gradient, no filter:blur, para que no
          tengan costo de repintado. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-pill opacity-70"
          style={{
            background:
              "radial-gradient(closest-side, var(--brand-20), transparent)",
          }}
        />
        <div
          className="absolute top-24 right-[8%] h-64 w-64 rounded-pill opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, var(--brand-12), transparent)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: GRAIN_BACKGROUND }}
        />
      </div>

      {/*
        El cliente pidió más aire entre los bloques, como en la referencia
        visual -- eso ya no entra en un viewport de 900px de alto sin
        scrollear (antes lo comprimíamos justo para lograrlo). Prioricé el
        aire por sobre el "sin scroll": ahora el hero puede necesitar un
        scroll chico para verse completo, a cambio de sentirse más
        espacioso en vez de apretado.
      */}
      <Container className="relative flex flex-col items-center gap-8 px-5 pb-20 pt-[calc(var(--header-offset)+40px)] text-center sm:gap-10 sm:pb-24">
        {/* Píldora entre el navbar y el título, a pedido del cliente sobre
            una referencia visual: mismo tratamiento de vidrio translúcido
            que "Conocer el sistema" más abajo, pero más chica/liviana --
            es una entrada, no una acción con el mismo peso que un CTA. */}
        <Reveal delay={0}>
          <a
            href={HERO_CONTENT.badge.href}
            className="inline-flex items-center gap-2 rounded-pill border border-border-soft bg-brand-12 px-4 py-1.5 text-sm font-semibold text-text-secondary backdrop-blur-sm transition-colors duration-fast ease-brand hover:bg-brand-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            {HERO_CONTENT.badge.label}
            <ArrowRight aria-hidden="true" size={15} />
          </a>
        </Reveal>

        {/* Único <h1> de toda la página (docs/SEO_GEO.md). Sin max-width
            propio a propósito: a 56px de tamaño, cualquier ancho de
            lectura angosto lo hace envolver en 3-4 líneas y eso solo, sin
            ningún otro cambio, ya rompe el "sin scroll". El ancho del
            Container (1280px) ya lo acota razonablemente. Todo el título
            en --brand-700 (no solo una palabra) y con <em> para la
            palabra destacada: es una decisión explícita del cliente,
            distinta de la regla original de docs/DESIGN_SYSTEM.md
            ("turquesa solo para una palabra"). font-black (el peso más
            alto de Inter) en vez de semibold, a pedido del cliente sobre
            una referencia visual -- sigue siendo Inter, sin tipografía
            nueva: <em> solo aplica el itálica del mismo font. */}
        <Reveal delay={0.12}>
          <h1 className="text-[32px] font-black leading-[1.08] tracking-tight text-brand-700 sm:text-[38px] md:text-[48px] lg:text-[56px]">
            {HERO_CONTENT.heading.prefix}
            <em className="italic">{HERO_CONTENT.heading.emphasis}</em>
            {HERO_CONTENT.heading.suffix}
          </h1>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="max-w-[60ch] text-base text-text-secondary sm:text-lg">
            {HERO_CONTENT.description}
          </p>
        </Reveal>

        <Reveal delay={0.34} className="w-full self-stretch">
          {/* id="hero-video": destino del link "Ver video" de arriba
              (content/landing.ts). max-w-[960px]: ahora que no estamos
              forzando el "sin scroll", el video puede volver al piso real
              del rango 960-1100px que pide docs/DESIGN_SYSTEM.md. */}
          <div id="hero-video" className="mx-auto w-full max-w-[960px] scroll-mt-[var(--header-offset)]">
            {/* Marco exterior con vidrio (fallback CSS de
                docs/DESIGN_SYSTEM.md sección 6): el glassmorphism va acá,
                en el "mat" que rodea el video, nunca encima de su
                contenido — adentro, YouTubeFacade queda opaco y nítido. */}
            <div className="glass-surface rounded-lg p-2">
              <YouTubeFacade video={HERO_CONTENT.video} />
            </div>
          </div>
        </Reveal>

        {/* CTA DESPUÉS del video, a pedido del cliente. El orden nuevo es
            promesa -> prueba -> acción: el visitante ve de qué se trata
            antes de que se le pida algo.

            Quedó UN solo botón. Antes lo acompañaba "Ver video" apuntando
            a #hero-video, y con el bloque acá abajo ese link mandaría a
            scrollear HACIA ARRIBA, al video que el visitante acaba de
            pasar. Un enlace que retrocede sobre contenido ya visto no
            aporta nada, y de paso el CTA principal deja de competir con
            nada: una sola acción domina la decisión. */}
        <Reveal delay={0.5}>
          <Button
            href={HERO_CONTENT.cta.href}
            icon={<CalendarCheck aria-hidden="true" size={18} strokeWidth={2} />}
            className="h-12 px-6 text-base"
          >
            {HERO_CONTENT.cta.label}
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
