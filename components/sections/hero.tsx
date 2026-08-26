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
      className="relative overflow-hidden"
      // Degradado diagonal turquesa muy diluido (blanco -> brand-12 ->
      // brand-20 -> blanco), a pedido del cliente sobre una referencia
      // visual: la misma composición diagonal, pero con nuestros colores
      // de marca y bien tenue (nunca un fondo oscuro ni saturado, eso
      // sigue en contra del design system). Los halos y el grano de abajo
      // quedan encima, como textura adicional, no reemplazan esto.
      style={{
        background:
          "linear-gradient(135deg, #ffffff 0%, var(--brand-12) 40%, var(--brand-20) 65%, #ffffff 100%)",
      }}
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
            className="inline-flex items-center gap-2 rounded-pill border border-border-soft bg-brand-12 px-4 py-1.5 text-sm font-semibold text-brand-900 backdrop-blur-sm transition-colors duration-fast ease-brand hover:bg-brand-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
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

        <Reveal delay={0.34}>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {/* Botón un poco más grande que el mínimo (h-14 en vez de
                h-12): sigue siendo el mismo botón del navbar en look, pero
                con más peso visual para que gane claramente contra el
                link secundario -- una sola acción debe dominar la
                decisión del visitante. */}
            <Button
              href={HERO_CONTENT.cta.href}
              icon={<CalendarCheck aria-hidden="true" size={18} strokeWidth={2} />}
              className="h-12 px-6 text-base"
            >
              {HERO_CONTENT.cta.label}
            </Button>
            {/* Acción distinta a la del CTA principal (recorrer la página,
                no agendar), por eso no cuenta como un segundo CTA
                compitiendo con el primero. Apunta a #sistema, la misma
                ancla que ya usa el navbar. Píldora de vidrio translúcido
                (a pedido del cliente, sobre una referencia visual) en vez
                de link de texto: sigue siendo visualmente más liviana que
                el botón principal (sin relleno sólido), así que no le
                disputa la atención. */}
            <a
              href={HERO_CONTENT.secondaryLink.href}
              className="inline-flex items-center gap-2 rounded-pill border border-border-soft bg-brand-12 px-5 py-3 text-sm font-semibold text-brand-900 backdrop-blur-sm transition-colors duration-fast ease-brand hover:bg-brand-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
            >
              {HERO_CONTENT.secondaryLink.label}
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.5} className="w-full self-stretch">
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
      </Container>
    </section>
  );
}
