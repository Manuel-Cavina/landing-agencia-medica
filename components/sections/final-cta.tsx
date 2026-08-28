/**
 * CTA final (id="agendar"), cierre comercial de la landing.
 *
 * Por qué esta sección se queda con el id "agendar"
 * -------------------------------------------------
 * "#agendar" es el destino del CTA principal del navbar (config/site.ts,
 * NAV_CTA), del hero y del FAQ. Hasta que se creó esta sección NINGUNA
 * lo declaraba: todos apuntaban a un ancla inexistente y el click no
 * hacía nada. No se modificó ningún enlace del navbar para repararlo.
 *
 * Diseño espejo del hero, a pedido del cliente
 * --------------------------------------------
 * Mismo fondo #DFEDEF, mismos halos, misma píldora de vidrio arriba,
 * mismo título en --brand-700 con una palabra en cursiva, todo centrado.
 * La página abre y cierra con la misma composición: es un marco, y le da
 * al visitante la sensación de haber completado un recorrido en vez de
 * haberse quedado sin página.
 *
 * Además arregla un problema real de contraste. La versión anterior era
 * una franja --brand-500 con texto blanco: 2,57:1 medido, muy por debajo
 * del mínimo WCAG AA de 4,5:1, el peor número de toda la página. Sobre
 * #DFEDEF el título en brand-700 da 3,88:1, que para texto grande
 * (>=24px) supera el mínimo de 3:1 con margen.
 *
 * ⚠ Queda una deuda menor y consciente: la descripción, a 16px, da
 * 4,09:1 y no llega a 4,5:1. Es exactamente el mismo par de colores que
 * ya usa la descripción del hero sobre el mismo fondo, así que la página
 * es coherente. Dentro de la paleta actual, el único color que cumpliría
 * es --brand-900, que el cliente ya rechazó por leerse como negro.
 *
 * Server Component: solo la entrada al viewport necesita cliente, y eso
 * está aislado en components/motion/reveal-on-view.tsx.
 */

import { CalendarCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { RevealOnView } from "@/components/motion/reveal-on-view";
import { BOOKING_EMBED_URL, NAV_CTA } from "@/config/site";

export function FinalCta() {
  return (
    <section
      id="agendar"
      aria-labelledby="final-cta-title"
      className="relative scroll-mt-[var(--header-offset)] overflow-x-clip py-16 sm:py-24"
      style={{ background: "#DFEDEF" }}
    >
      {/* Mismos halos que el hero: radial-gradient sin filter:blur, así
          no cuestan repintado. Estáticos -- nada se mueve solo. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-pill opacity-70"
          style={{ background: "radial-gradient(closest-side, var(--brand-20), transparent)" }}
        />
        <div
          className="absolute bottom-0 right-[8%] h-64 w-64 rounded-pill opacity-60"
          style={{ background: "radial-gradient(closest-side, var(--brand-12), transparent)" }}
        />
      </div>

      <Container className="relative flex flex-col items-center gap-6 text-center">
        {/* Misma píldora de vidrio que abre el hero. */}
        <RevealOnView delay={0}>
          <span className="inline-flex items-center gap-2 rounded-pill border border-border-soft bg-brand-12 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand-700 backdrop-blur-sm">
            Tu próxima etapa
          </span>
        </RevealOnView>

        {/* h2, no h1: docs/SEO_GEO.md reserva el único h1 para el hero. */}
        <RevealOnView delay={0.1}>
          <h2
            id="final-cta-title"
            className="max-w-3xl text-[28px] font-black leading-[1.1] tracking-tight text-brand-700 sm:text-[40px]"
          >
            Tu crecimiento no necesita más acciones sueltas. Necesita{" "}
            <em className="italic">un sistema</em>.
          </h2>
        </RevealOnView>

        <RevealOnView delay={0.2}>
          <p className="max-w-xl text-base text-text-secondary sm:text-lg">
            Conversemos sobre tu situación actual, los obstáculos que están frenando
            el proceso y la estructura que podría ayudarte a avanzar con mayor
            claridad.
          </p>
        </RevealOnView>

        {BOOKING_EMBED_URL ? (
          /* Calendario embebido, a todo el ancho de lectura.
             El alto está RESERVADO para que el iframe no provoque
             salto de layout al cargar, y `loading="lazy"` evita que
             compita con el render inicial de la página
             (docs/SEO_GEO.md sección 13). */
          <RevealOnView delay={0.3} className="w-full">
            <div className="mx-auto mt-2 w-full max-w-[820px] overflow-hidden rounded-lg border border-border-soft bg-white shadow-soft">
              <iframe
                src={BOOKING_EMBED_URL}
                title={NAV_CTA.label}
                loading="lazy"
                className="block h-[680px] w-full border-0 sm:h-[720px]"
              />
            </div>
          </RevealOnView>
        ) : (
          /* Sin URL de calendario todavía (config/site.ts,
             BOOKING_EMBED_URL sigue en [PENDIENTE]): va el botón, que
             apunta al MISMO destino que el resto de la página.

             Este es el CTA principal del cierre y el único botón de
             agendar del pie de página -- el del footer se eliminó a
             pedido del cliente justamente para que éste no compitiera
             con nada. Que la sección quede sin ninguna acción no es
             una opción: es la única conversión definida en
             docs/PROJECT.md.

             Cuando llegue la URL real, el botón se reemplaza solo por
             el calendario de arriba. No hay que tocar componentes. */
          <RevealOnView delay={0.3}>
            <div className="mt-2 flex flex-col items-center gap-3">
              <a
                href={NAV_CTA.href}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-pill bg-brand-500 px-7 text-base font-semibold text-text-on-brand transition-colors duration-fast ease-brand hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 active:bg-brand-900"
              >
                {NAV_CTA.label}
                <CalendarCheck aria-hidden="true" size={18} strokeWidth={2} />
              </a>

              <p className="text-sm text-text-secondary">
                Elegí el día y el horario que mejor se adapten a tu agenda.
              </p>
            </div>
          </RevealOnView>
        )}
      </Container>
    </section>
  );
}
