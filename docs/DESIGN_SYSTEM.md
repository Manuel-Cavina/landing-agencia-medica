DESIGN_SYSTEM.md — Landing comercial

Estado

EN ITERACIÓN

Propósito

Este documento define el lenguaje visual y de interacción de la landing. Toda sección nueva debe reutilizar estas reglas antes de introducir variantes. Los cambios globales requieren aprobación y deben registrarse en docs/DECISIONS.md.

1. Dirección visual

La identidad debe transmitir:

tranquilidad;

confianza;

frescura;

crecimiento;

modernización;

precisión profesional.

El resultado debe sentirse premium y contemporáneo sin volverse frío, excesivamente editorial o visualmente pesado.

Principios

Claridad antes que decoración. Cada recurso visual debe ayudar a comprender o recorrer la página.

Movimiento con intención. El motion guía la atención; no compite con el contenido.

Aire y jerarquía. Evitar componentes pegados, textos diminutos y acumulación de bordes.

Consistencia. Línea, nodos, tarjetas, botones y superficies deben responder al mismo sistema.

Marca presente, no repetida. Utilizar el símbolo turquesa en momentos relevantes sin convertirlo en un patrón constante.

2. Paleta

El cliente solicitó trabajar principalmente con #46B0BA y blanco. Para asegurar contraste y profundidad se permiten variaciones tonales derivadas del mismo color, no colores de acento ajenos.

:root {
  --brand-500: #46b0ba;
  --brand-700: #2f7f87;
  --brand-900: #123f44;

  --brand-12: rgba(70, 176, 186, 0.12);
  --brand-20: rgba(70, 176, 186, 0.20);
  --brand-36: rgba(70, 176, 186, 0.36);

  --surface: #ffffff;
  --surface-soft: #f6fbfb;
  --surface-glass: rgba(255, 255, 255, 0.72);

  --text-primary: #123f44;
  --text-secondary: #52777a;
  --text-on-brand: #ffffff;

  --border-soft: rgba(70, 176, 186, 0.18);
  --border-strong: rgba(70, 176, 186, 0.34);
}

Uso

Fondo principal: blanco.

CTA principal: --brand-500 con texto blanco.

Texto principal: --brand-900.

Texto secundario: --text-secondary.

Líneas, nodos y bordes: transparencias del color de marca.

Fondos alternos: --surface-soft o degradados muy suaves entre blanco y --brand-12.

No hacer

No introducir dorado, violeta, rojo o azul oscuro como acentos decorativos.

No usar texto #46B0BA pequeño sobre blanco si no alcanza contraste.

No aplicar degradados saturados ni fondos que resten tranquilidad.

3. Tipografía

La tipografía debe ser más moderna que editorial. La familia definitiva está [PENDIENTE], pero se trabajará con esta jerarquía:

Interfaz, navegación y cuerpo: sans serif moderna, limpia y altamente legible.

Títulos: la misma sans serif con peso y escala diferenciados.

Acento editorial opcional: serif únicamente en palabras breves, cursivas o frases destacadas; nunca en bloques largos ni en todas las tarjetas.

Escala orientativa

--text-xs: 0.75rem;
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.375rem;
--text-2xl: 1.75rem;
--text-3xl: clamp(2rem, 4vw, 3.25rem);
--text-hero: clamp(3rem, 7vw, 6.5rem);

Reglas

Cuerpo mínimo recomendado: 16px en escritorio y móvil.

Etiquetas: mínimo 12px, con espaciado de letras moderado.

No usar párrafos extensos en mayúsculas.

El h1 debe dominar sin ocupar todo el primer viewport.

Evitar contrastes extremos entre títulos gigantes y textos demasiado pequeños.

Longitud máxima de párrafo: aproximadamente 65ch.

4. Espaciado y estructura

Usar una escala base de 4 y 8 píxeles:

--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--space-7: 48px;
--space-8: 64px;
--space-9: 96px;
--space-10: 128px;

Ancho máximo general: 1280px.

Ancho de lectura: 640px–720px.

Padding lateral desktop: clamp(32px, 5vw, 80px).

Padding lateral móvil: 16px–20px.

Separación vertical de secciones: 96px–144px en escritorio y 72px–96px en móvil.

Las tarjetas nunca deben tocarse ni superponerse por cambios de viewport.

El contenido no debe quedar oculto debajo del navbar fijo.

5. Bordes, radios y sombras

--radius-sm: 12px;
--radius-md: 20px;
--radius-lg: 32px;
--radius-pill: 999px;

--shadow-soft: 0 16px 45px rgba(18, 63, 68, 0.08);
--shadow-float: 0 24px 70px rgba(18, 63, 68, 0.14);

Botones y controles: radios de 12px–999px según el componente.

Tarjetas principales: 20px–32px.

Evitar una sombra distinta en cada componente.

Las sombras deben ser suaves, amplias y derivadas del color de marca.

6. Glassmorphism

El efecto de vidrio se usa como acento, no como estilo universal.

.glass-surface {
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(70, 176, 186, 0.20);
  box-shadow: 0 18px 50px rgba(18, 63, 68, 0.10);
  backdrop-filter: blur(20px) saturate(130%);
  -webkit-backdrop-filter: blur(20px) saturate(130%);
}

Aplicaciones recomendadas

Navbar flotante.

Controles del carrusel.

Etiquetas o indicadores destacados.

Panel de resultados de la calculadora.

Contenedor exterior de Calendly.

Evitar

Aplicarlo a todas las tarjetas.

Usarlo sobre fondos sin contraste.

Exagerar blur, reflejos o transparencias que reduzcan legibilidad.

Depender del efecto para separar contenido: siempre debe existir borde o contraste de superficie.

6.1 Liquid Glass con React

Se utilizará la librería liquid-glass-react para sumar refracción y respuesta al puntero en pocos componentes destacados.

npm install liquid-glass-react

"use client";

import LiquidGlass from "liquid-glass-react";

export function LiquidGlassAccent({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass-fallback">
      <LiquidGlass
        displacementScale={32}
        blurAmount={0.08}
        saturation={115}
        aberrationIntensity={0.6}
        elasticity={0.16}
        cornerRadius={24}
        overLight
      >
        {children}
      </LiquidGlass>
    </div>
  );
}

Los valores son una base visual, no una configuración definitiva. Se ajustarán probando contraste, rendimiento y compatibilidad.

Componentes candidatos

contenedor del navbar;

control o CTA destacado del hero;

indicador activo del índice lateral;

panel de resultado de la calculadora;

control activo del roadmap;

confirmación visual cercana a Calendly.

No es obligatorio aplicarlo a todos los candidatos. En una misma vista deberían existir pocos elementos Liquid Glass para que el efecto conserve jerarquía.

No utilizar en

todas las tarjetas de resultados;

las siete tarjetas del roadmap simultáneamente;

bloques extensos de texto;

inputs completos de la calculadora;

fondos de página completa;

componentes repetidos en bucles grandes;

cualquier contenido cuya comprensión dependa de la refracción.

Compatibilidad y fallback

Implementar primero una superficie .glass-fallback con fondo translúcido, borde, sombra y backdrop-filter.

Liquid Glass se monta como mejora visual sobre esa base.

Safari y Firefox pueden mostrar una versión parcial sin desplazamiento visible; el componente debe seguir siendo claro y atractivo.

Si WebGL, filtros o efectos avanzados no están disponibles, conservar el glassmorphism CSS.

El contenido, foco, clic y navegación deben funcionar aun si el efecto no se carga.

Respetar prefers-reduced-motion reduciendo elasticidad y seguimiento del puntero.

Rendimiento

Importar el componente solo del lado cliente.

Evitar envolver áreas de scroll muy extensas.

No crear decenas de instancias simultáneas.

Evitar actualizar el efecto continuamente por estados ajenos al componente.

Verificar INP, fluidez de scroll y consumo en dispositivos móviles.

Desactivar la variante avanzada si perjudica el objetivo de Core Web Vitals.

Dirección estética

Refracción sutil.

Aberración cromática casi imperceptible.

Elasticidad lenta y controlada.

Tinte blanco/turquesa derivado de #46B0BA.

Bordes luminosos suaves.

Nada debe parecer gelatina, plástico grueso o efecto de videojuego.

7. Componentes

Navbar

Flotante y centrado.

Altura aproximada: 64px–76px.

Fondo de vidrio claro.

Logo a la izquierda, navegación al centro y CTA a la derecha.

En móvil se simplifica la navegación sin perder el CTA.

El estado activo debe ser sutil y visible.

Botones

Primario

Fondo --brand-500.

Texto blanco.

Altura mínima 48px.

Icono final opcional.

Secundario

Fondo blanco o transparente.

Borde --border-soft.

Texto --brand-900.

Estados obligatorios: default, hover, focus-visible, active y disabled.

Video principal

Presentación minimalista, sin controles falsos complejos.

Ratio estable, preferentemente 16:9.

Portada limpia con logo, título breve y botón de reproducción.

Reservar dimensiones antes de cargar YouTube.

Cargar el iframe solamente cuando sea necesario.

Tarjetas de resultados

Mostrar tres en escritorio.

Jerarquía: profesional/empresa, testimonio, resultado y contexto del resultado.

No parecer una ficha editorial con exceso de texto.

Usar cifras grandes únicamente cuando estén validadas.

Carrusel continuo con separación constante entre tarjetas.

Tarjetas de pilares

Más compactas que las tarjetas de resultados.

Imagen relevante, título, explicación breve y acción “Ver más”.

No incluir bloques largos que nadie vaya a leer durante el scroll.

Alternar izquierda/derecha sin romper la continuidad del camino.

Calculadora

Dos zonas: entradas y resultado.

Controles grandes y etiquetados.

Resultado en panel moderno y claro.

Mostrar supuestos y carácter estimativo.

Evitar apariencia de formulario administrativo.

FAQ

Acordeón de una pregunta abierta por vez.

Área clickeable amplia.

Iconos y transiciones discretos.

Texto con ancho de lectura controlado.

Calendly

Integración dentro de un contenedor de marca.

No dibujar un calendario falso cuando exista el embed real.

Reservar altura para evitar saltos de layout.

Footer

Más simple y liviano que el resto de la página.

Logo, navegación mínima, contacto y legales.

No repetir toda la propuesta comercial.

8. Roadmap de pilares

El roadmap es el componente distintivo de la landing.

Recorrido vertical con curvas amplias y claramente visibles.

Línea principal más marcada que las decoraciones secundarias.

Nodos uniformes y legibles.

La línea y los números deben equilibrarse con las tarjetas.

El pilar centrado en el viewport se ve al 100%.

Los pilares cercanos pueden reducir levemente opacidad, nunca desaparecer mientras sean visibles.

La transición de foco entre pilares debe ser progresiva.

La línea termina en el nodo 7.

El pilar 7 se posiciona a la derecha.

En móvil se conserva la idea de camino curvo; no se convierte automáticamente en una cronología recta.

9. Motion

El movimiento debe sentirse lento, natural y liviano.

Tiempos orientativos

--motion-fast: 180ms;
--motion-base: 420ms;
--motion-slow: 800ms;
--motion-reveal: 1000ms;
--ease-brand: cubic-bezier(0.22, 0.76, 0.24, 1);

Hover: 180ms–300ms.

Aparición de secciones: 700ms–1000ms.

Transición de foco del roadmap: 700ms–1200ms.

Contadores: aproximadamente 2800ms–3600ms.

Carrusel automático: ciclo lento de 28s–40s según cantidad de tarjetas.

Reglas

Las apariciones se ejecutan una sola vez salvo que la interacción requiera repetición.

Evitar animar simultáneamente posición, escala, blur y opacidad con valores extremos.

No bloquear el scroll.

No dejar estados momentáneamente vacíos.

No reiniciar contadores cada vez que el usuario vuelve a la sección.

Usar transform y opacity cuando sea posible.

Implementar una variante sin desplazamientos ni autoplay con prefers-reduced-motion.

10. Responsive

Breakpoints orientativos:

Desktop amplio: 1280px o más
Desktop/tablet horizontal: 1024px–1279px
Tablet: 768px–1023px
Móvil: menos de 768px
Móvil pequeño: menos de 480px

Reglas

Diseñar estados específicos; no limitarse a reducir tamaños proporcionalmente.

Ocultar el índice lateral cuando compita con el contenido.

El navbar móvil debe conservar marca y CTA.

Resultados: tres tarjetas en desktop, dos o una según ancho.

Roadmap: tarjetas con ancho legible y curva visible sin overflow horizontal accidental.

Evitar textos menores a 14px salvo etiquetas no esenciales.

Objetivos táctiles mínimos: 44px × 44px.

11. Imágenes e iconografía

Usar imágenes con función explicativa, no decoración genérica.

Mantener una dirección visual coherente entre los siete pilares.

Optimizar formatos, dimensiones y carga.

Iconos lineales y simples.

No mezclar múltiples familias de iconos.

El logo no debe deformarse, recolorearse arbitrariamente ni perder su espacio de protección.

12. Accesibilidad

Contraste WCAG AA como objetivo mínimo.

Foco visible en todos los controles.

Navegación por teclado.

Texto alternativo útil en imágenes informativas.

Imágenes decorativas con alt="".

No comunicar estados solo mediante color.

Respetar reducción de movimiento.

Mantener orden de lectura lógico independientemente de la posición visual de las tarjetas.

13. Regla para nuevas variantes

Una variante de componente solo se crea si cambia al menos una de estas dimensiones:

función;

jerarquía;

estado;

contexto de uso;

comportamiento responsive.

No crear variantes únicamente por pequeñas diferencias arbitrarias de color, radio o sombra.

14. Pendientes de validación

[PENDIENTE] Familia tipográfica definitiva.

[PENDIENTE] Nombre comercial y wordmark.

[PENDIENTE] Manual original del logo.

[PENDIENTE] Dirección fotográfica final.

[REAL] Uso de glassmorphism y Liquid Glass confirmado.

[PENDIENTE] Intensidad definitiva y componentes exactos que usarán Liquid Glass.