/**
 * Footer de la landing.
 *
 * Server Component completo: no hay estado, no hay interacción y no hay
 * animación. Es HTML y CSS -- cero JavaScript enviado al navegador por
 * esta parte de la página.
 *
 * Enlaces: se leen de config/site.ts (NAV_LINKS y NAV_CTA), la MISMA
 * fuente que usa el navbar. No existe una segunda lista que pueda
 * quedar desincronizada: si mañana se agrega o renombra una sección,
 * navbar y footer cambian juntos.
 *
 * Qué NO tiene y por qué
 * ----------------------
 * - Columna de contacto: docs/PROJECT.md y docs/SEO_GEO.md marcan
 *   correo, teléfono, redes y datos institucionales como [PENDIENTE].
 *   Inventarlos violaría DEC-019. Se probó reemplazarla por un CTA
 *   chico de agendar y el cliente lo hizo sacar: duplicaba el CTA final
 *   a dos scrolls de distancia. El footer quedó en dos columnas.
 * - Íconos sociales: no hay perfiles oficiales confirmados.
 * - Enlaces legales: las rutas de privacidad y términos no existen en
 *   app/, así que un enlace daría 404. docs/PROJECT.md las tiene como
 *   [PENDIENTE] y AGENTS.md prohíbe crear documentos legales sin
 *   autorización.
 *
 * Año: new Date().getFullYear() se evalúa en el servidor. En una página
 * estática eso significa el año del BUILD, no el del visitante. Para una
 * landing que se redespliega es aceptable; queda anotado en
 * docs/sections/FAQ_CTA_FOOTER.md por si alguna vez importa.
 */

import Image from "next/image";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NAV_CTA, NAV_LINKS, SITE_NAME } from "@/config/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    // Fondo BLANCO, no surface-soft (#f6fbfb).
    //
    // Arriba está el CTA final en #DFEDEF, y contra ese tinte el
    // #f6fbfb quedaba a mitad de camino: ni continuaba la franja ni la
    // cerraba. Se leía como una tercera superficie sin motivo. El
    // blanco corta limpio y le da al pie una identidad propia.
    <footer className="border-t border-border-soft bg-white">
      <Container className="py-12 sm:py-16">
        {/* Marca a la izquierda, navegación a la derecha. La navegación
            se alinea a la derecha en escritorio para que las dos
            columnas se apoyen contra los bordes del contenedor y el
            espacio quede en el medio, donde no molesta. En móvil todo
            vuelve a alinearse a la izquierda. */}
        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_auto] md:gap-20">
          {/* Columna de marca */}
          <div>
            {/* width/height reservan el espacio exacto: sin layout shift
                mientras carga. alt="" porque el nombre accesible del
                enlace ya lo aporta el texto visible, igual que en el
                navbar -- duplicarlo haría que el lector de pantalla
                anuncie "Odisea Odisea". */}
            <Link
              href="/"
              className="inline-flex min-h-11 items-center gap-2.5 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
            >
              <Image
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                className="h-11 w-11"
              />
              <span className="text-xl font-extrabold tracking-tight text-brand-700">
                {SITE_NAME}
              </span>
            </Link>

            {/* max-w-md y no max-w-sm: 45-60 caracteres por línea es el
                ancho de lectura cómodo, y a max-w-sm el párrafo entraba
                en cuatro líneas cortas que se veían amontonadas. */}
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-text-secondary">
              Sistemas de crecimiento diseñados para transformar acciones aisladas en
              un proceso claro, medible y sostenible.
            </p>
          </div>

          {/* Columna de navegación */}
          <nav aria-labelledby="footer-nav-title" className="md:text-right">
            <h2
              id="footer-nav-title"
              className="text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary"
            >
              Navegación
            </h2>

            {/* items-end en escritorio: sin esto los <a> son inline-flex
                y su caja se estira a todo el ancho de la columna, así
                que el área clickeable seguiría del lado izquierdo
                aunque el texto se vea a la derecha. */}
            <ul className="mt-5 flex list-none flex-col gap-0.5 md:items-end">
              {[...NAV_LINKS, { label: "Agendar", href: NAV_CTA.href }].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-11 items-center text-[15px] font-medium text-text-secondary transition-colors duration-fast ease-brand hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* ELIMINADA: columna "Siguiente paso" con su botón de
              agendar. Se sacó a pedido del cliente.

              El motivo de fondo es bueno: ese botón era la cuarta
              aparición del mismo CTA en la página (navbar, hero, CTA
              final y éste), y estaba pegado justo debajo del CTA final,
              que ya pide exactamente lo mismo con mucho más peso
              visual. Repetir la acción a dos scrolls de distancia no la
              refuerza, la abarata. El footer vuelve a ser lo que tiene
              que ser: marca y navegación.

              El enlace "Agendar" sigue estando en la lista de
              Navegación de al lado, que es donde corresponde. */}
        </div>

        {/* Línea inferior, compacta a pedido del cliente.
            Bajó el aire arriba del divisor (mt-14/16 -> mt-10/12) y
            debajo (pt-7 -> pt-5). Sigue habiendo más espacio arriba que
            abajo: el bloque legal se separa del contenido pero queda
            apretado en sí mismo, que es como debe leerse un pie de
            pie. */}
        <div className="mt-10 flex flex-col gap-4 border-t border-border-soft pt-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-text-secondary/80">
            © {year} {SITE_NAME}. Todos los derechos reservados.
          </p>

          {/* Píldora en vez de link pelado: es el mismo lenguaje de
              controles que usa el resto de la página (navbar, botones,
              badges del hero), y le da al pie un remate en vez de
              terminar en texto suelto.

              Ancla real a #inicio (declarado por el hero). No hace falta
              JavaScript, y el html{scroll-behavior:smooth} de
              app/globals.css ya se desactiva solo con
              prefers-reduced-motion. */}
          <a
            href="#inicio"
            // h-9 (36px) en vez de h-11 (44px), a pedido del cliente.
            // 44px es el objetivo AAA de WCAG (2.5.5); el mínimo AA
            // (2.5.8) son 24px, así que 36px sigue cumpliendo AA con
            // margen. Es un atajo de conveniencia, no una acción
            // principal: se puede permitir el recorte.
            className="inline-flex h-9 w-fit items-center gap-2 self-start rounded-pill border border-border-soft px-3.5 text-[11px] font-semibold text-text-secondary transition-colors duration-fast ease-brand hover:border-brand-500/40 hover:bg-brand-12 hover:text-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 sm:self-auto"
          >
            <ArrowUp aria-hidden="true" size={14} strokeWidth={2.5} />
            Volver arriba
          </a>
        </div>
      </Container>
    </footer>
  );
}
