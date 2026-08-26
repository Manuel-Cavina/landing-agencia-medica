"use client";

/**
 * Navbar de la landing comercial.
 *
 * Es "use client" porque casi todo lo que hace requiere JavaScript en el
 * navegador: reaccionar al scroll, detectar qué sección está a la vista,
 * abrir/cerrar el menú móvil y atrapar el foco del teclado ahí adentro.
 * Nada de esto se puede calcular en el servidor, así que convertirlo en
 * Client Component acá es necesario, no una comodidad.
 *
 * Lee antes: docs/DESIGN_SYSTEM.md sección 7 (Navbar) y sección 6
 * (Glassmorphism). Los tokens (--brand-500, --radius-md, .glass-surface,
 * etc.) están definidos en app/globals.css.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { NAV_CTA, NAV_LINKS, SITE_NAME } from "@/config/site";

export function SiteHeader() {
  // true una vez que el usuario scrolleó más allá de un pequeño umbral
  // (8px, básicamente "apenas se mueve"). Controla dos cosas a la vez:
  // que la barra pase de transparente a la tarjeta de vidrio sólida, y el
  // pequeño refuerzo de opacidad/sombra sobre esa tarjeta. Nunca cambia
  // el tamaño del navbar.
  //
  // Antes esto se decidía con un IntersectionObserver sobre el hero
  // completo (transparente mientras CUALQUIER parte del hero, incluido
  // el video, siguiera a la vista) -- pero eso rompía visualmente apenas
  // el usuario scrolleaba hasta la tarjeta turquesa del video: el navbar
  // transparente quedaba flotando encima de ese fondo turquesa, ilegible.
  // Con un umbral de scroll chico, la barra ya es sólida mucho antes de
  // llegar al video.
  const [isScrolled, setIsScrolled] = useState(false);

  // Controla si el panel del menú móvil está abierto.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ancla de la sección actualmente visible, para remarcar su link en
  // el nav de escritorio. Empieza en null: ninguna sección "activa"
  // hasta que el usuario scrollea (todavía no existen las secciones
  // reales de la landing, así que esto queda listo para cuando existan).
  const [activeHref, setActiveHref] = useState<string | null>(null);

  // Referencias a nodos del DOM que necesitamos manipular directamente:
  // - toggleButtonRef: para devolver el foco al botón que abrió el menú.
  // - panelRef: para encontrar los elementos enfocables dentro del panel
  //   y armar el "focus trap" (que Tab no se escape del menú abierto).
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    // Accesibilidad: quien abrió el menú con teclado espera que el foco
    // vuelva a su origen al cerrarlo, no que se pierda en el <body>.
    toggleButtonRef.current?.focus();
  }, []);

  // --- Efecto 1: opacidad/sombra del navbar según el scroll ---------------
  // Usamos requestAnimationFrame para no recalcular en cada evento de
  // scroll (pueden ser decenas por segundo): "ticking" evita encolar más
  // de un cálculo pendiente por frame. Además, React ya evita re-renderizar
  // si el valor booleano no cambió, así que esto no genera renders extra
  // mientras el usuario sigue scrolleando dentro de la misma zona.
  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 8);
        ticking = false;
      });
    }

    handleScroll(); // por si la página carga ya scrolleada (ej: volviendo con el historial)
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Efecto 2: detectar la sección visible para marcar el link activo ---
  // Buscamos en el DOM los elementos cuyo id coincide con cada ancla del
  // navbar. Como las secciones reales todavía no existen (solo el navbar
  // se está construyendo en esta tarea), el array puede salir vacío hoy;
  // el observer simplemente no tendrá nada que observar hasta que esas
  // secciones se creen, sin romper nada.
  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.querySelector(link.href),
    ).filter((el): el is Element => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;

        // Si hay varias secciones parcialmente visibles a la vez, tomamos
        // la que está más arriba en el viewport (la que el usuario está
        // "leyendo" en este momento).
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveHref(`#${topMost.target.id}`);
      },
      {
        // El margen superior negativo compensa la altura del navbar: una
        // sección solo cuenta como "activa" cuando ya quedó debajo de él.
        rootMargin: "-112px 0px -55% 0px",
        threshold: 0.1,
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // --- Efecto 3: comportamiento del menú móvil mientras está abierto -----
  // Se encarga de tres cosas a la vez: enfocar el primer link al abrir,
  // atrapar el Tab dentro del panel (focus trap) y cerrar con Escape.
  useEffect(() => {
    if (!isMenuOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusableElements = Array.from(
      panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
    );
    focusableElements[0]?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      // Si el foco está en el último elemento y se presiona Tab, volvemos
      // al primero (y viceversa con Shift+Tab). Así el foco nunca "se
      // escapa" hacia el contenido de atrás mientras el menú está abierto.
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    // Bloquea la interacción con el resto de la página mientras el menú
    // está abierto: <main> se vuelve inert (no clickeable ni enfocable) y
    // el body no scrollea de fondo. Ver components/layout/site-header.tsx
    // + app/layout.tsx, donde {children} está envuelto en <main>.
    const main = document.querySelector("main");
    main?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      main?.removeAttribute("inert");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen, closeMenu]);

  return (
    // fixed, no sticky: el navbar nunca participa del flujo del documento,
    // así que cualquier sección de más abajo (ver app/page.tsx) reserva su
    // propio padding-top para no quedar tapada por él.
    <header className="fixed inset-x-0 top-4 z-50 sm:top-6">
      <Container className="relative">
        {/* Barra principal: logo + nav + CTA (o logo + botón de menú en
            móvil). Transparente en el tope de la página (flota directamente
            sobre el fondo del hero, sin tarjeta de vidrio) y con
            .glass-surface apenas hay cualquier scroll -- el mismo patrón
            que pidió el cliente a partir de una referencia visual. La
            barra en sí nunca deja de estar montada ni interactiva; lo
            único condicional es la clase que le da el fondo de vidrio.
            liquid-glass-react queda instalado (AGENTS.md lo declara para
            todo el sitio) pero no se usa en este navbar: probé envolver la
            barra completa y su técnica interna de auto-centrado
            (position:absolute + top/left 50% + translate(-50%,-50%)) no
            calza con una barra full-width en flujo normal -- el contenido
            terminaba renderizado fuera del área visible del "pill"
            (confirmado con capturas de Playwright). Tampoco tiene sentido en
            el CTA: su fondo es sólido (--brand-500) por spec del design
            system, y el efecto de Liquid Glass depende de refractar lo que
            hay detrás de una superficie translúcida -- sobre un fondo opaco
            ese refractado no se ve. Queda disponible para una superficie
            realmente translúcida en una futura sección (candidatos ya
            anotados en DESIGN_SYSTEM.md: calculadora, tarjetas del roadmap). */}
        <div
          data-scrolled={isScrolled}
          className={`flex h-16 items-center justify-between gap-4 rounded-lg px-4 transition-[background-color,box-shadow,border-color] duration-slow ease-brand sm:h-[72px] sm:px-6 ${
            isScrolled ? "glass-surface" : ""
          }`}
        >
          {/* Logo + wordmark. width/height del logo reservan el espacio
              exacto para que next/image no genere layout shift mientras
              carga. alt="" porque el nombre accesible del link ya lo da el
              texto visible "Odisea" (SITE_NAME) -- no hace falta aria-label
              ni duplicar el nombre en el alt de la imagen. text-brand-700:
              mismo turquesa que el título del hero (a pedido del cliente),
              ya no el mismo color que los links de al lado. */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src="/logo.png" alt="" width={48} height={48} priority className="h-11 w-11 sm:h-12 sm:w-12" />
            <span className="text-lg font-extrabold tracking-tight text-brand-700 sm:text-xl">
              {SITE_NAME}
            </span>
          </Link>

          {/* Nav + CTA + botón móvil agrupados juntos del lado derecho
              (en vez de nav al centro y CTA en la punta): el logo queda
              solo como ancla a la izquierda, todo lo demás a la derecha. */}
          <div className="flex items-center gap-6">
            {/* Navegación de escritorio */}
            <nav
              aria-label="Navegación principal"
              className="hidden items-center gap-1 lg:flex"
            >
              {NAV_LINKS.map((link) => {
                const isActive = activeHref === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative rounded-pill px-4 py-2 text-xs transition-colors duration-fast ease-brand hover:text-brand-700 ${
                      isActive
                        ? "font-semibold text-brand-700"
                        : "font-medium text-text-secondary"
                    }`}
                  >
                    {link.label}
                    {/* Indicador de activo que no depende solo del color: un
                        punto debajo del link, sumado al cambio de peso de
                        fuente de arriba. */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-pill bg-brand-500"
                      />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* CTA de escritorio */}
            <a
              href={NAV_CTA.href}
              className="hidden h-12 shrink-0 items-center gap-2 rounded-pill bg-brand-500 px-5 text-sm font-semibold text-text-on-brand transition-colors duration-fast ease-brand hover:bg-brand-700 lg:inline-flex"
            >
              {NAV_CTA.label}
              <CalendarCheck aria-hidden="true" size={18} strokeWidth={2} />
            </a>

            {/* Botón de menú móvil */}
            <button
              ref={toggleButtonRef}
              type="button"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-panel"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-pill text-text-primary transition-colors duration-fast ease-brand hover:bg-brand-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 lg:hidden"
            >
              {isMenuOpen ? (
                <X aria-hidden="true" size={22} />
              ) : (
                <Menu aria-hidden="true" size={22} />
              )}
            </button>
          </div>
        </div>

        {/* Fondo oscurecido detrás del panel móvil. Cerrar tocando afuera
            es un atajo esperado además de Escape y del botón. */}
        <div
          aria-hidden="true"
          onClick={closeMenu}
          className={`fixed inset-0 z-40 bg-brand-900/20 transition-opacity duration-base ease-brand motion-reduce:transition-none lg:hidden ${
            isMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        />

        {/* Panel del menú móvil. Se mantiene siempre montado (nunca
            desaparece del DOM) para poder animar tanto la apertura como
            el cierre con una simple transición CSS; cuando está cerrado,
            "inert" lo saca del orden de tabulación y evita que reciba
            foco o clicks. */}
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          inert={!isMenuOpen}
          className={`glass-surface absolute inset-x-0 top-full z-40 mt-3 flex flex-col gap-1 rounded-lg p-3 transition-[opacity,transform] duration-slow ease-brand motion-reduce:transition-none lg:hidden ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-2 opacity-0"
          }`}
        >
          <nav aria-label="Navegación móvil" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={activeHref === link.href ? "true" : undefined}
                onClick={closeMenu}
                className={`rounded-sm px-4 py-3 text-base transition-colors duration-fast ease-brand hover:bg-brand-12 ${
                  activeHref === link.href
                    ? "font-semibold text-brand-700"
                    : "font-medium text-text-secondary"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href={NAV_CTA.href}
            onClick={closeMenu}
            className="mt-2 flex h-12 items-center justify-center gap-2 rounded-pill bg-brand-500 px-5 text-sm font-semibold text-text-on-brand transition-colors duration-fast ease-brand hover:bg-brand-700"
          >
            {NAV_CTA.label}
            <CalendarCheck aria-hidden="true" size={18} strokeWidth={2} />
          </a>
        </div>
      </Container>
    </header>
  );
}
