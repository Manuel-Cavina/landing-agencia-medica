ECISIONS.md — Registro de decisiones

Propósito

Este archivo registra las decisiones importantes del proyecto para evitar que una IA vuelva atrás, mezcle propuestas descartadas o cambie criterios ya aprobados.

No reemplaza PROJECT.md, DESIGN_SYSTEM.md ni los documentos de cada sección. Solo conserva decisiones que afectan el producto o su implementación.

Estados

APROBADA: debe conservarse hasta que el usuario indique lo contrario.

PROVISIONAL: se utiliza para avanzar, pero puede cambiar.

PENDIENTE: todavía no existe una decisión.

DESCARTADA: no debe volver a proponerse sin una nueva indicación.

REEMPLAZADA: fue válida, pero otra decisión posterior ocupa su lugar.

Decisiones aprobadas

DEC-001 — Alcance del repositorio

Estado: APROBADA

Decisión: este repositorio contiene únicamente la landing comercial.

Motivo: el onboarding ya fue desarrollado por separado.

Consecuencia: no crear rutas de onboarding, firma, contrato o Tally dentro de este proyecto.

DEC-002 — Framework

Estado: APROBADA

Decisión: utilizar Next.js con App Router y TypeScript.

Consecuencia: los ejemplos y componentes deben respetar esta arquitectura.

DEC-003 — Repositorio único

Estado: APROBADA

Decisión: utilizar una sola aplicación y un solo repositorio.

Consecuencia: no utilizar Turborepo.

DEC-004 — Base de datos

Estado: APROBADA

Decisión: no incorporar base de datos en la landing inicial.

Motivo: YouTube, Calendly, contenido y calculadora no requieren persistencia propia.

Consecuencia: no agregar Supabase u otra base sin un requerimiento nuevo y concreto.

DEC-005 — Forma de trabajo

Estado: APROBADA

Decisión: trabajar, revisar y aprobar una sección por vez.

Consecuencia: una tarea local no debe rediseñar otras secciones.

DEC-006 — Paleta

Estado: APROBADA

Decisión: trabajar con #46B0BA, blanco y variaciones tonales derivadas necesarias para contraste.

Consecuencia: no introducir colores decorativos ajenos a la identidad.

DEC-007 — Dirección visual

Estado: APROBADA

Decisión: la página debe transmitir tranquilidad, frescura, confianza, modernización y crecimiento.

Consecuencia: evitar una estética agresiva, saturada, excesivamente editorial o recargada.

DEC-008 — Glassmorphism

Estado: APROBADA

Decisión: el glassmorphism forma parte del sistema visual.

Consecuencia: aplicarlo selectivamente en navbar, controles, calculadora o contenedores destacados; no en todos los componentes.

DEC-009 — Liquid Glass

Estado: APROBADA

Decisión: utilizar liquid-glass-react como mejora progresiva en pocos componentes protagonistas.

Consecuencia: mantener fallback CSS, compatibilidad, legibilidad y rendimiento. No aplicar Liquid Glass a toda la página, listas extensas o todas las tarjetas.

DEC-010 — Roadmap de pilares

Estado: APROBADA

Decisión: presentar primero los siete pilares resumidos y luego un roadmap vertical detallado.

Consecuencia: conservar la lectura de camino durante el scroll.

DEC-011 — Forma del recorrido

Estado: APROBADA

Decisión: utilizar curvas amplias y marcadas, no una línea cronológica recta ni una composición circular.

Consecuencia: el camino debe seguir siendo reconocible en desktop y móvil.

DEC-012 — Distribución de pilares

Estado: APROBADA

Decisión: alternar tarjetas entre izquierda y derecha; el pilar 7 debe ubicarse a la derecha.

Consecuencia: la curva final debe permitir que Escala entre con la misma lógica visual que los pilares anteriores.

DEC-013 — Final del roadmap

Estado: APROBADA

Decisión: la línea termina en el pilar 7.

Consecuencia: no continuar la curva hacia un espacio vacío ni agregar obligatoriamente un botón “Listo para crecer”.

DEC-014 — Tarjetas de pilares

Estado: APROBADA

Decisión: tarjetas compactas con imagen, título, explicación breve y acción “Ver más”.

Consecuencia: evitar bloques extensos, componentes pegados y un tratamiento excesivamente editorial.

DEC-015 — Foco durante el scroll

Estado: APROBADA

Decisión: la tarjeta más centrada en el viewport se muestra al 100%.

Consecuencia: las tarjetas visibles nunca desaparecen; el cambio de foco es progresivo.

DEC-016 — Motion

Estado: APROBADA

Decisión: utilizar animaciones lentas, suaves y funcionales.

Consecuencia: evitar movimientos bruscos, reconstrucciones pesadas y estados vacíos. Respetar prefers-reduced-motion.

DEC-017 — Resultados

Estado: APROBADA

Decisión: utilizar un carrusel constante que muestre tres casos en escritorio.

Consecuencia: mantener separación entre tarjetas y una velocidad lenta.

DEC-018 — Contadores

Estado: APROBADA

Decisión: animar resultados desde cero hasta el valor validado cuando la sección entra en vista.

Consecuencia: el contador se ejecuta una vez y no se reinicia constantemente.

DEC-019 — Veracidad del contenido

Estado: APROBADA

Decisión: ningún nombre, testimonio, cifra, resultado o certificación demostrativa puede presentarse como real.

Consecuencia: utilizar [REAL], [PLACEHOLDER] y [PENDIENTE] en la documentación.

DEC-020 — SEO y GEO

Estado: APROBADA

Decisión: SEO, GEO, accesibilidad y rendimiento se trabajan durante cada sección.

Consecuencia: no dejarlos como una tarea exclusivamente final.

DEC-021 — Documentación necesaria

Estado: APROBADA

Decisión: no crear TECHNICAL_ARCHITECTURE.md por ahora.

Motivo: la landing es relativamente simple y AGENTS.md ya contiene las reglas técnicas necesarias.

Consecuencia: si el proyecto incorpora backend, autenticación, persistencia o múltiples aplicaciones, se reconsiderará.

Decisiones provisionales

DEC-P01 — Nombres de los pilares

Estado: PROVISIONAL

Valor actual: Oferta, Avatar, Ecosistema, Asistente IA, Prevaloración, Conversión y Escala.

Pendiente: validación con el cliente y copy final.

DEC-P02 — Herramientas de interacción

Estado: PROVISIONAL

Valor actual: Motion para animaciones, Embla para carrusel y liquid-glass-react para Liquid Glass.

Pendiente: validar compatibilidad y rendimiento durante la implementación.

DEC-P03 — Tipografía

Estado: PROVISIONAL

Valor actual: sans serif moderna como base y serif opcional solamente como acento.

Pendiente: elegir familias definitivas.

DEC-P04 — Copys de diseño

Estado: PROVISIONAL

Decisión: utilizar textos UX provisorios para diseñar jerarquías.

Consecuencia: deben identificarse y reemplazarse antes del lanzamiento.

Decisiones pendientes

PENDIENTE Nombre comercial definitivo.

PENDIENTE Dominio definitivo.

PENDIENTE Copy comercial final.

PENDIENTE Familia tipográfica.

PENDIENTE URL y portada del video de YouTube.

PENDIENTE URL de Calendly.

PENDIENTE Casos, imágenes, testimonios y cifras validadas.

PENDIENTE Fórmula de la calculadora.

PENDIENTE Mercado geográfico para SEO.

PENDIENTE Políticas legales.

PENDIENTE Componentes exactos e intensidad final de Liquid Glass.

Propuestas descartadas

DESC-001 — “Órbita Growth Systems” como marca

Estado: DESCARTADA

Motivo: fue un nombre utilizado solamente en prototipos.

DESC-002 — Roadmap circular

Estado: DESCARTADA

Motivo: no representa la idea de recorrido vertical solicitada.

DESC-003 — Línea cronológica recta

Estado: DESCARTADA

Motivo: el usuario pidió curvas visibles y una estructura más orgánica.

DESC-004 — Motion rápido o agresivo

Estado: DESCARTADA

Motivo: perjudica la calma, la lectura y el rendimiento.

DESC-005 — Tarjetas que desaparecen durante el scroll

Estado: DESCARTADA

Motivo: provoca estados vacíos y bugs visuales.

DESC-006 — Resultados estáticos sin carrusel

Estado: DESCARTADA

Motivo: se aprobó un carrusel constante con tres casos visibles.

DESC-007 — Base de datos preventiva

Estado: DESCARTADA

Motivo: no existe una necesidad funcional actual.

DESC-008 — Documento de arquitectura independiente

Estado: DESCARTADA POR AHORA

Motivo: agregaría documentación sin aportar valor proporcional en esta etapa.

Cómo actualizar este archivo

Agregar una decisión solo cuando afecte varias tareas o deba conservarse en el tiempo.

No registrar cada ajuste menor de padding, color o copy.

No borrar decisiones anteriores.

Si una decisión cambia, marcar la anterior como REEMPLAZADA y agregar la nueva.

Registrar la aprobación de una sección en su propio archivo y resumir aquí únicamente cambios globales.