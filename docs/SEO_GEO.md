SEO_GEO.md — Landing comercial

Estado

EN ITERACIÓN

Propósito

Este documento define los requisitos de SEO y GEO de la landing.

SEO: facilitar el rastreo, comprensión, indexación y posicionamiento en buscadores tradicionales.

GEO: facilitar que motores de respuesta y asistentes de IA comprendan correctamente la empresa, sus servicios, su público, su método y sus evidencias.

GEO no reemplaza al SEO técnico ni garantiza que un asistente cite la página. La estrategia se basa en contenido accesible, entidades consistentes, afirmaciones verificables, estructura semántica y datos estructurados válidos.

1. Información necesaria antes de publicar

No finalizar la estrategia de posicionamiento hasta recibir:

[PENDIENTE] Nombre comercial y razón social.

[PENDIENTE] Dominio definitivo.

[PENDIENTE] Países, ciudades o regiones atendidas.

[PENDIENTE] Servicios ofrecidos y alcance exacto de cada uno.

[PENDIENTE] Público objetivo prioritario.

[PENDIENTE] Diferencial comercial verificable.

[PENDIENTE] Datos institucionales y medios de contacto.

[PENDIENTE] Perfiles sociales oficiales.

[PENDIENTE] Casos, testimonios y resultados validados.

[PENDIENTE] Video definitivo y sus metadatos.

[PENDIENTE] Políticas de privacidad y términos.

Mientras exista contenido ficticio o demostrativo, el sitio debe permanecer privado o con noindex.

2. Intenciones de búsqueda

La investigación de palabras clave debe organizarse por intención, no como una lista indiscriminada de términos.

Comercial

Usuarios que buscan contratar una solución:

agencia de marketing para clínicas estéticas;

captación de pacientes para medicina estética;

marketing para cirujanos plásticos;

automatización de consultas para clínicas;

generación de pacientes para tratamientos estéticos.

Estas frases son hipótesis iniciales [PENDIENTE DE INVESTIGACIÓN], no palabras clave aprobadas.

Informacional

Usuarios que buscan comprender un problema:

cómo conseguir pacientes para una clínica estética;

cómo mejorar la conversión de consultas médicas;

cómo automatizar el seguimiento de pacientes;

cuánto invertir en publicidad para una clínica;

cómo calcular el retorno de campañas para tratamientos estéticos.

De marca

Se define cuando exista nombre comercial definitivo:

nombre de la empresa;

nombre + opiniones;

nombre + servicios;

nombre + contacto;

nombre + casos de éxito.

Local

Solo se trabaja si existe una ubicación o mercado geográfico real. No insertar ciudades artificialmente en títulos y textos.

3. Mapa de intención por sección

Cada sección debe responder una pregunta concreta.

Sección

Pregunta principal

Hero

¿Qué hace la empresa y para quién?

Resultados

¿Qué impacto produjo y cómo se midió?

Resumen de pilares

¿Cómo funciona el sistema completo?

Roadmap

¿Qué hace cada pilar y cómo se conecta con el siguiente?

Calculadora

¿Cómo se estima el retorno y bajo qué supuestos?

FAQ

¿Qué objeciones y dudas resuelve el servicio?

Calendly

¿Cuál es el siguiente paso para evaluar el caso?

Footer

¿Quién es la empresa y cómo se la contacta?

4. Contenido visible

Debe existir un solo h1 descriptivo.

Utilizar h2 para secciones principales y h3 para subsecciones o pilares.

No saltar niveles de encabezado por motivos visuales.

La información principal debe existir como texto HTML, no únicamente dentro de imágenes, videos, canvas o animaciones.

Los enlaces deben describir su destino; evitar “hacé clic aquí”.

Las respuestas relevantes deben aparecer de forma directa antes de desarrollar detalles.

Los párrafos deben ser claros, específicos y comprensibles sin contexto publicitario.

No repetir palabras clave artificialmente.

No ocultar bloques de texto creados exclusivamente para buscadores.

5. Reglas GEO de redacción

Respuesta directa

Cada bloque importante comienza con una explicación breve y autosuficiente. Después puede ampliarse con ejemplos, proceso o evidencia.

Entidades consistentes

Mantener idénticos en toda la web:

nombre comercial;

razón social cuando corresponda;

logo;

descripción principal;

servicios;

público atendido;

ubicación y zona de servicio;

teléfono, correo y redes oficiales.

Definiciones claras

Cuando se introduzca un concepto propio —por ejemplo, “prevaloración” o el nombre del sistema— explicar qué significa en lenguaje concreto.

Evidencia y procedencia

Toda afirmación cuantitativa debe indicar, cuando corresponda:

período medido;

moneda;

alcance del resultado;

metodología de atribución;

contexto inicial;

fecha de actualización;

autorización para publicar.

Autoridad y confianza

Identificar claramente a la empresa responsable del contenido.

Incluir información institucional real.

Diferenciar resultados comprobados de estimaciones.

Mostrar supuestos en la calculadora.

Corregir o actualizar información desactualizada.

No inventar profesionales, premios, certificaciones, socios o clientes.

6. Metadata

Configurar mediante la Metadata API de Next.js.

Requerido

metadataBase con el dominio definitivo.

title descriptivo y específico.

description única y orientada a la intención principal.

alternates.canonical.

Open Graph: título, descripción, URL, imagen y tipo.

Twitter/X card.

favicon e iconos de marca.

idioma del documento: es o variante regional validada.

Plantilla provisional

export const metadata: Metadata = {
  metadataBase: new URL("https://dominio-pendiente.example"),
  title: {
    default: "[Servicio principal] para [público] | [Marca]",
    template: "%s | [Marca]",
  },
  description: "[Qué hace la empresa, para quién y cuál es el próximo paso]",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    title: "[Título]",
    description: "[Descripción]",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "[Descripción]" }],
  },
};

No publicar literalmente los placeholders de esta plantilla.

7. Archivos técnicos de Next.js

Estructura esperada:

app/
├── layout.tsx
├── robots.ts
├── sitemap.ts
├── icon.png o favicon.ico
└── opengraph-image.png o metadata equivalente

components/
└── seo/
    └── JsonLd.tsx

robots.ts

Durante desarrollo o cuando exista contenido ficticio: usar noindex mediante metadata o acceso privado.

En producción: permitir rastreo de la landing pública y declarar el sitemap.

No usar robots.txt como único mecanismo para impedir indexación; una URL bloqueada para crawling todavía puede aparecer en resultados.

Revisar conscientemente cualquier regla específica para crawlers de IA antes de bloquearlos.

sitemap.ts

Incluir únicamente URLs canónicas, públicas e indexables.

No incluir enlaces de Calendly, anclas, previews o rutas privadas.

Usar el dominio definitivo.

Para una landing de una sola página, un sitemap simple es suficiente.

8. Datos estructurados

Usar JSON-LD. El marcado debe representar contenido visible y real. Su presencia no garantiza resultados enriquecidos.

Tipos previstos

Organization para identificar la empresa.

WebSite para identificar el sitio oficial.

Service para describir el servicio principal.

VideoObject cuando el video definitivo tenga título, descripción, thumbnail, fecha y URL reales.

FAQPage únicamente si las preguntas y respuestas completas son visibles en la página y el marcado cumple las políticas vigentes.

No usar MedicalBusiness salvo que la empresa sea realmente un establecimiento que presta atención médica. Esta landing describe una agencia o sistema para clínicas, no una clínica.

Propiedades mínimas de Organization

@context;

@type;

@id estable;

name;

url;

logo;

description;

sameAs con perfiles oficiales;

contactPoint si existe información pública validada.

Prohibiciones

No crear Review o AggregateRating con testimonios demostrativos.

No marcar contenido oculto.

No inventar dirección, teléfono, fecha de fundación o redes.

No duplicar entidades contradictorias.

No usar propiedades irrelevantes solo porque Schema.org las permite.

Validación

Google Rich Results Test.

Schema Markup Validator.

Inspección de URL de Google Search Console después de publicar.

9. Resultados y testimonios

Antes de publicar un caso deben confirmarse:

nombre o anonimización autorizada;

cargo o especialidad;

imagen autorizada;

resultado exacto;

período;

moneda;

criterio de atribución;

texto del testimonio;

autorización de uso.

Si falta cualquiera de estos elementos, mantener el caso como [PLACEHOLDER] y no indexarlo como evidencia real.

10. Video

Integrar YouTube de forma diferida para evitar afectar carga inicial.

Incluir título y descripción visibles.

Preparar una transcripción revisada cuando el video definitivo esté disponible.

La transcripción debe reflejar el contenido real; no generar afirmaciones que el video no contiene.

Reservar dimensiones para evitar cambios de layout.

Evaluar VideoObject únicamente con datos reales.

11. Imágenes

Usar next/image cuando sea compatible con el entorno.

Definir ancho y alto o una relación de aspecto estable.

Comprimir y servir formatos modernos.

Usar nombres de archivo descriptivos.

alt explica la función o información de la imagen, no acumula keywords.

Imágenes decorativas: alt="".

No colocar textos esenciales únicamente dentro de imágenes.

12. Enlaces y arquitectura

La versión inicial es una landing de una sola página. Las anclas facilitan navegación, pero no sustituyen páginas independientes para intenciones diferentes.

No crear nuevas páginas solo para “tener más SEO”. Una página futura se justifica si posee:

intención de búsqueda propia;

contenido sustancial y original;

valor para el usuario;

capacidad de mantenerse actualizada.

Posibles expansiones futuras [FUERA DEL ALCANCE ACTUAL]:

página institucional;

página por servicio real;

metodología o sistema;

casos de éxito individuales;

recursos educativos;

contacto.

13. Rendimiento

Objetivos de Core Web Vitals en el percentil 75:

LCP: ≤ 2,5 s.

INP: ≤ 200 ms.

CLS: ≤ 0,1.

Acciones prioritarias:

evitar que toda la página sea un único Client Component;

cargar JavaScript solo donde exista interacción;

diferir YouTube y Calendly;

limitar librerías de motion;

limitar instancias de liquid-glass-react y mantener un fallback CSS liviano;

animar principalmente transform y opacity;

optimizar imágenes y fuentes;

reservar tamaños de embeds;

evitar listeners de scroll costosos;

probar dispositivos móviles reales o equivalentes.

14. Accesibilidad relacionada con SEO

HTML semántico.

Navegación por teclado.

Foco visible.

Contraste suficiente.

Labels en formularios y calculadora.

Botones reales para acciones; enlaces para navegación.

Orden de lectura coherente aunque el roadmap alterne visualmente tarjetas.

Mensajes y resultados comprensibles sin depender del motion.

15. Indexación por ambiente

Desarrollo, demo o contenido pendiente

Acceso privado o noindex, nofollow.

No enviar sitemap a Search Console.

No usar el dominio temporal como canonical definitivo.

Producción validada

index, follow.

Canonical al dominio definitivo.

robots.ts y sitemap.ts activos.

JSON-LD validado.

Search Console configurado.

Sitemap enviado.

URL principal inspeccionada.

16. Medición

Configurar después de definir dominio y política de privacidad:

Google Search Console.

Herramienta analítica [PENDIENTE].

Medición de clics al CTA.

Inicio de interacción con Calendly.

Reserva completada cuando la integración lo permita legal y técnicamente.

Reproducción del video.

Uso de la calculadora.

Rendimiento de consultas y páginas en Search Console.

No enviar datos personales sensibles a analítica.

17. Criterio SEO/GEO por sección

Una sección no se considera terminada hasta que:

responde una intención o pregunta concreta;

usa HTML semántico;

posee encabezados coherentes;

mantiene el contenido importante visible como texto;

no contiene afirmaciones ficticias;

funciona sin depender de la animación;

cumple responsive y accesibilidad básica;

no perjudica Core Web Vitals;

actualiza el documento de su sección.

18. Checklist previo al lanzamiento

Nombre, dominio, público y mercado confirmados.

Copys validados.

Un solo h1.

Metadata y canonical definitivos.

Open Graph con imagen de 1200 × 630.

robots.ts revisado.

sitemap.ts revisado.

JSON-LD real y validado.

Casos y cifras autorizados.

Fórmula y supuestos de la calculadora confirmados.

Video, transcripción y Calendly reales.

Legales publicados.

Core Web Vitals revisados.

Navegación móvil y por teclado verificada.

Search Console configurado.

Analítica y consentimiento revisados.

No quedan placeholders indexables.

Referencias oficiales

Google Search Central — Guía para desarrolladores: https://developers.google.com/search/docs/fundamentals/get-started-developers

Google Search Central — Datos estructurados: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

Google Search Central — Políticas de datos estructurados: https://developers.google.com/search/docs/appearance/structured-data/sd-policies

Next.js — Metadata: https://nextjs.org/docs/app/api-reference/functions/generate-metadata

Next.js — Robots: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots

Next.js — Sitemap: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

Schema.org — Organization: https://schema.org/Organization

Schema.org — VideoObject: https://schema.org/VideoObject

web.dev — Core Web Vitals: https://web.dev/articles/vitals