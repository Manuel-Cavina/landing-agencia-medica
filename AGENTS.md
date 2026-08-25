AGENTS.md — Landing comercial de agencia

Propósito

Este archivo contiene las reglas permanentes que debe seguir cualquier agente de IA que trabaje en este repositorio. La documentación cambiante vive en docs/; este archivo debe mantenerse breve, estable y sin ideas descartadas.

Producto y alcance

El alcance activo es una única landing comercial orientada a convertir visitas de clínicas y profesionales de medicina estética en reuniones estratégicas.

El onboarding ya fue desarrollado por separado y queda fuera de este repositorio. No crear ni modificar rutas, componentes, contratos, Tally o flujos de onboarding salvo pedido explícito.

La landing incluye:

Navbar minimalista.

Hero con promesa, video de YouTube y CTA.

Franja horizontal de información vinculada al sistema.

Resultados y casos reales.

Presentación resumida de los siete pilares.

Roadmap interactivo y detallado.

Calculadora estimativa.

Calendly embebido.

Preguntas frecuentes.

CTA final y footer.

Estado del contenido

Usar estas etiquetas en la documentación:

[REAL]: información validada por el cliente.

[PLACEHOLDER]: contenido demostrativo pendiente de reemplazo.

[PENDIENTE]: decisión o material aún no recibido.

El nombre comercial, el dominio definitivo, los copys finales, los casos reales, las cifras, las fórmulas y parte de los recursos visuales están pendientes.

“Órbita Growth Systems” fue un nombre utilizado en prototipos. No usarlo como marca definitiva.

Nunca presentar como reales testimonios, profesionales, resultados económicos, certificaciones, cantidades de clientes o métricas no validadas.

Stack y arquitectura

Next.js con App Router y TypeScript.

Tailwind CSS como base de estilos.

Motion para animaciones justificadas.

liquid-glass-react para efectos Liquid Glass selectivos.

Embla Carousel para carruseles.

Lucide para iconografía de interfaz.

Un repositorio y una aplicación.

No usar Turborepo.

No agregar base de datos sin un requerimiento que la justifique.

Evitar dependencias nuevas si la solución puede resolverse de forma simple y mantenible.

Integraciones previstas:

YouTube para el video principal.

Calendly para agendamiento.

Identidad visual

Color principal: #46B0BA.

Base blanca y neutros claros.

Sensaciones: tranquilidad, frescura, confianza, modernización y crecimiento.

Aplicar glassmorphism selectivamente, especialmente en navegación y controles.

Usar Liquid Glass únicamente como mejora progresiva en componentes protagonistas y siempre con fallback CSS.

No aplicar refracción, aberración o elasticidad intensa a textos, formularios, carruseles completos ni al roadmap completo.

Mantener contraste y legibilidad.

Integrar el símbolo turquesa de marca sin repetirlo excesivamente.

El resultado debe ser moderno, profesional y vendible, pero no ruidoso.

Resolver responsive junto con cada sección.

Resultados

Mostrar tres casos simultáneos en escritorio cuando exista espacio.

Carrusel continuo, lento y fluido.

Los contadores pueden animarse desde cero una sola vez al entrar en vista.

Hasta recibir casos validados, identificarlos claramente como demostrativos.

Siete pilares y roadmap

Nombres provisionales: Oferta, Avatar, Ecosistema, Asistente IA, Prevaloración, Conversión y Escala.

Mostrar primero una vista resumida de los siete pilares.

Desarrollarlos luego en un recorrido vertical con curvas marcadas.

Alternar tarjetas entre izquierda y derecha; el pilar 7 queda a la derecha.

Equilibrar visualmente línea, nodos y tarjetas.

Todos los nodos conservan forma, tamaño y estilo.

Tarjetas compactas con imagen, explicación y acción “Ver más”.

Mantener espacio suficiente entre pilares en todos los anchos.

La tarjeta más centrada en el viewport se muestra al 100%.

Las transiciones son progresivas y nunca dejan el recorrido vacío.

Movimiento lento, suave y funcional.

Respetar prefers-reduced-motion.

La línea termina en el último pilar.

Calculadora

Moderna, minimalista y comprensible.

La fórmula final está [PENDIENTE]; no inventarla.

Presentar resultados como estimaciones con supuestos visibles.

SEO, GEO y contenido

Usar HTML semántico y encabezados coherentes.

Un único h1 por página.

Mantener la información importante como texto HTML.

Configurar metadata, canonical, Open Graph, sitemap y robots.

Agregar JSON-LD solamente con información real.

Optimizar imágenes, fuentes, scripts, embeds y Core Web Vitals.

Incluir texto alternativo útil.

Escribir para personas; no usar keyword stuffing.

Explicar claramente qué hace la empresa, para quién, cómo funciona y qué la diferencia.

Mantener entidades, servicios, ubicación y público consistentes.

FAQ concreta, verificable y útil para buscadores y asistentes de IA.

No crear contenido duplicado ni afirmaciones sin sustento.

Accesibilidad y rendimiento

Navegación por teclado y foco visible.

Contraste suficiente.

Nombres accesibles en botones y enlaces.

No depender solo de color o movimiento.

Evitar animaciones que bloqueen scroll o provoquen saltos de layout.

Reservar dimensiones de imágenes, videos y embeds.

Diferir la carga de YouTube y Calendly cuando sea posible.

Cargar los efectos Liquid Glass únicamente en Client Components y evitar incluirlos en listas extensas o superficies de gran tamaño.

Forma de trabajo

Trabajar una sección por tarea salvo pedido global explícito.

Leer este archivo y docs/sections/<seccion>.md antes de editar una sección, cuando exista.

Inspeccionar el componente actual antes de reemplazarlo.

No modificar otras secciones para resolver un problema local.

Preservar las decisiones marcadas como aprobadas.

Señalar contradicciones antes de eliminar decisiones aprobadas.

No marcar una sección como aprobada sin confirmación explícita del usuario.

Después de aprobar, actualizar su documento y docs/DECISIONS.md.

Separar datos y presentación cuando sea razonable.

Ejecutar npm run lint y npm run build al finalizar.

Verificar escritorio, tablet y móvil.

Informar cambios, verificaciones y pendientes.

Definición de terminado

Una sección termina cuando cumple su objetivo, funciona responsive, conserva legibilidad y accesibilidad, no contiene datos ficticios presentados como reales, contempla SEO/GEO, pasa lint y build, recibe aprobación explícita y actualiza su documentación.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
