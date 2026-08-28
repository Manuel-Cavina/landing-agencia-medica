/**
 * Sección "Preguntas frecuentes" (id="preguntas-frecuentes").
 *
 * Este ancla ya existía en config/site.ts (NAV_LINKS) desde que se
 * construyó el navbar, pero ninguna sección la declaraba: hasta ahora
 * ese link del menú no llevaba a ningún lado. Esta sección lo resuelve.
 *
 * Server Component: solo el acordeón necesita estado de cliente
 * (components/faq/faq-accordion.tsx). El encabezado, la columna
 * izquierda y el JSON-LD se renderizan en el servidor, así que el texto
 * de las preguntas viaja en el HTML inicial.
 *
 * Composición: dos columnas en escritorio (introducción | acordeón) y
 * una sola columna apilada desde tablet hacia abajo. La columna
 * izquierda queda sticky SOLO en lg+, anclada a --header-offset para no
 * meterse debajo del navbar fijo; con `self-start` para que la celda del
 * grid no se estire a la altura del acordeón (si se estirara, sticky no
 * tendría recorrido y no haría nada).
 *
 * Fondo blanco/transparente con halos de marca. El tratamiento claro
 * separa el FAQ de la franja #DFEDEF de la calculadora anterior.
 */

import { Container } from "@/components/ui/container";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { FAQ_CONTENT, FAQ_ITEMS } from "@/content/faq";

/**
 * JSON-LD de FAQPage generado desde el MISMO array que renderiza el
 * acordeón (content/faq.ts). No hay forma de que el marcado y el texto
 * visible se separen: si alguien edita una pregunta, cambian los dos.
 *
 * Cumple las condiciones de docs/SEO_GEO.md sección 8: las preguntas y
 * respuestas completas están visibles en la página como texto HTML, no
 * se marca contenido oculto ni distinto del renderizado, y no se
 * inventaron preguntas solo para SEO.
 *
 * Nota: hoy la página lleva noindex (app/layout.tsx) porque todavía hay
 * contenido demostrativo. El schema queda correcto y listo para cuando
 * ese noindex se levante; no aporta nada mientras tanto, pero tampoco
 * puede volverse inconsistente.
 */
function FaqJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // El contenido es un objeto construido acá, no entrada de usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FaqSection() {
  return (
    <section
      id="preguntas-frecuentes"
      aria-labelledby="faq-title"
      className="relative scroll-mt-[var(--header-offset)] overflow-x-clip py-14 sm:py-20"
    >
      <FaqJsonLd />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-16 right-[6%] h-[420px] w-[420px] rounded-pill opacity-50"
          style={{ background: "radial-gradient(closest-side, var(--brand-20), transparent)" }}
        />
        <div
          className="absolute bottom-[10%] left-[4%] h-[360px] w-[360px] rounded-pill opacity-40"
          style={{ background: "radial-gradient(closest-side, var(--brand-12), transparent)" }}
        />
      </div>

      <Container className="relative">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,38%)_minmax(0,62%)] lg:gap-14">
          {/* Columna izquierda: introducción.
              SIN sticky. Se probó fijarla en escritorio y el cliente
              reportó que el título "se mueve" al bajar: el texto quedaba
              quieto mientras el acordeón pasaba al lado, y esa disociación
              molestaba más de lo que ayudaba. Ahora scrollea con el resto
              de la página, como cualquier otra columna. */}
          <div>
            {/* Antetítulo con el mismo tratamiento que Resultados,
                Roadmap y Calculadora: guioncito turquesa + versalita
                espaciada. Es lo que hace que las cinco secciones se
                lean como parte de la misma página. */}
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-700">
              <span aria-hidden="true" className="h-px w-6 bg-brand-500" />
              {FAQ_CONTENT.eyebrow}
            </span>

            <h2
              id="faq-title"
              className="mt-4 max-w-md text-[26px] font-black leading-[1.12] tracking-tight text-brand-700 sm:text-[36px]"
            >
              {FAQ_CONTENT.heading.prefix}
              <em className="italic">{FAQ_CONTENT.heading.emphasis}</em>
              {FAQ_CONTENT.heading.suffix}
            </h2>

            <p className="mt-4 max-w-md text-sm text-text-secondary sm:text-base">
              {FAQ_CONTENT.description}
            </p>

            {/* ELIMINADO: recuadro "¿Tenés otra consulta? / Agendar una
                reunión estratégica".
                Se sacó a pedido del cliente. Era un CTA secundario que
                repetía el mismo destino que el navbar y el CTA final, y
                colgaba solo debajo de la descripción sin nada que lo
                sostuviera. La columna izquierda ahora es únicamente
                título + descripción. */}
          </div>

          {/* Columna derecha: el acordeón. */}
          <FaqAccordion />
        </div>
      </Container>
    </section>
  );
}
