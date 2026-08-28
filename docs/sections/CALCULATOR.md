# CALCULATOR.md — Calculadora de oportunidad

Estado: **PROVISIONAL / EN ITERACIÓN**. No aprobada.

## 1. Objetivo

Ayudar al visitante a dimensionar cuánto podría representar económicamente una mejora en su tasa de conversión. Es una **simulación aritmética**, no una proyección financiera ni una promesa comercial.

## 2. Estado del modelo

El modelo comercial definitivo está **[PENDIENTE]** (`docs/PROJECT.md`). Esta versión es genérica y deliberadamente fácil de reemplazar:

- No modela costos, márgenes, estacionalidad, plazos de cobro ni repetición de compra.
- Los valores iniciales son **demostrativos**, no promedios del sector ni datos de clientes (DEC-019).
- Estas cifras **no** aparecen en metadata, JSON-LD, Open Graph ni datos estructurados.

## 3. Valores iniciales y resultados esperados

```ts
{ opportunities: 100, currentConversionRate: 10, targetConversionRate: 20, averageValue: 500000, currency: "ARS" }
```

| Resultado | Valor |
|---|---|
| Conversiones actuales | 10 |
| Conversiones objetivo | 20 |
| Conversiones adicionales | 10 |
| Valor mensual actual | $ 5.000.000 |
| Valor mensual objetivo | $ 10.000.000 |
| Oportunidad mensual | **$ 5.000.000** |
| Proyección anual | $ 60.000.000 |

Verificado en el navegador: coinciden exactamente.

## 4. Fórmulas

En `lib/calculator.ts`, función pura `calculateOpportunity`:

```
currentConversions   = opportunities * (currentRate / 100)
targetConversions    = opportunities * (targetRate / 100)
currentMonthlyValue  = currentConversions * averageValue
targetMonthlyValue   = targetConversions * averageValue
additionalConversions = max(0, targetConversions - currentConversions)
monthlyOpportunity   = max(0, targetMonthlyValue - currentMonthlyValue)
annualOpportunity    = monthlyOpportunity * 12
```

Decisiones de la función:

- **No redondea nada** antes de terminar. Redondear conversiones antes de multiplicarlas por el valor promedio amplificaría el error por miles. El redondeo es exclusivamente de presentación.
- **`max(0, …)`** en las diferencias: si la tasa objetivo es menor que la actual, el escenario no es una mejora. Se muestra 0 y una advertencia, nunca un número negativo presentado como "oportunidad".
- **No muta** los argumentos; recorta a rangos válidos sobre copias.
- **`safeNumber`** neutraliza `NaN` e `Infinity`, que pueden llegar desde un `<input>` real.

## 5. Estructura de archivos

| Archivo | Rol | Server/Client |
|---|---|---|
| `lib/calculator.ts` | Tipos, función pura y formateadores | — (sin React) |
| `content/calculator.ts` | Copys, valores iniciales, límites y pasos | — |
| `components/sections/calculator-section.tsx` | Encabezado, halos, estructura semántica | **Server** |
| `components/calculator/opportunity-calculator.tsx` | Dueño del estado, panel de dos columnas | Client |
| `components/calculator/calculator-field.tsx` | Slider + input numérico sincronizados | Client |
| `components/calculator/calculator-results.tsx` | Resultados, barras, aclaraciones, CTA | Client |
| `components/ui/animated-number.tsx` | Número que interpola al cambiar | Client |
| `app/globals.css` | Clase `.calculator-range` (estilo del slider) | — |

La sección exterior es Server Component. Solo el panel interactivo es cliente.

## 6. Estado y valores derivados

Hay **un solo estado**: `values` (los cuatro números + la moneda). Los resultados **no se guardan**: se derivan con `calculateOpportunity` en cada render. Guardarlos aparte crearía dos fuentes de verdad que se desincronizan.

`useMemo` se usa para estabilizar la identidad del objeto de resultados, no por rendimiento (son cuatro multiplicaciones).

## 7. Sincronización slider ↔ input

Ambos controles leen el mismo `value` y llaman al mismo `onChange`: por construcción no pueden desincronizarse.

El input de texto tiene un matiz: mientras se escribe hay estados intermedios inválidos (campo vacío, un `-` suelto). Si se forzara el valor en cada tecla sería imposible borrar para reescribir. Por eso:

1. Mientras está enfocado, el input guarda un **borrador local** (`draft`).
2. Al salir (blur) o presionar Enter se confirma: se interpreta, se recorta a `[min, max]` y se sincroniza.
3. Si quedó inutilizable, vuelve al último valor válido — nunca `NaN`.

El slider es un `<input type="range">` **nativo**: ya trae accesibilidad de teclado, soporte táctil y semántica. Solo se le cambia la piel con CSS; no se reimplementa con listeners de puntero.

## 8. Formato monetario

`Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: 0 })`. Nunca se concatena `"$" + valor`.

**ARS ↔ USD no convierte importes.** Solo cambia el símbolo y el formato: no hay cotización ni llamada a ninguna API. La interfaz lo aclara de forma visible, no en un tooltip.

## 9. Animación de los números

`components/ui/animated-number.tsx`.

**Por qué no se reutilizó `animated-counter.tsx`**: ese componente anima una sola vez al entrar en el viewport y cuenta desde cero. En la calculadora cada cambio debe interpolar desde el valor anterior; reiniciar desde cero en cada movimiento del slider daría una lectura falsa y más ruidosa.

**Por qué una interpolación con duración y no un resorte**: se probó primero con `useSpring` (stiffness 90 / damping 22 / mass 0.8, como sugería el brief). Un resorte se acerca a su destino de forma asintótica y nunca lo toca; con importes de millones eso se ve. Medido: el número quedaba en **$4.997.819** en vez de $5.000.000 y necesitaba **más de dos segundos** para cerrar la diferencia (el resorte quedaba sobreamortiguado, ζ≈1.4).

Se reemplazó por `animate()` con duración fija de **500ms** y easing `[0.22, 1, 0.36, 1]`:

- Interpola desde el valor anterior, no desde cero.
- Llega al valor **exacto** al terminar.
- Sin rebote.
- Cada cambio detiene la animación anterior y arranca una nueva desde donde estaba: arrastrar el slider no acumula colas.
- El texto se escribe directo en el DOM vía `MotionValue`; no hay `setState` por frame.

## 10. Animación de las barras

`scaleX` con `transform-origin: left`, no `width`: escalar no recalcula layout. Duración 550ms, mismo easing, sin rebote, `initial={false}` para que anime desde el valor anterior y no desde cero.

Escala compartida: ambas barras se normalizan contra el mayor de los dos escenarios. El ratio se acota a `[0.02, 1]`, así que nunca desborda el panel ni toma valores negativos. Si ambos valores son 0, ambas quedan en su mínimo visible.

## 11. Movimiento reducido

Con `prefers-reduced-motion: reduce`:

- `Reveal` devuelve un `<div>` plano (sin desplazamiento ni fundido).
- `AnimatedNumber` hace `display.set(value)` directo: muestra el valor final de inmediato.
- Las barras usan `duration: 0`.
- Toda la funcionalidad se conserva.

Verificado en navegador con contexto real: valor principal `$ 5.000.000`, panel en opacidad 1, barras en sus ratios finales.

## 12. Accesibilidad

- `<section id="calculadora" aria-labelledby="calculator-title">` y `<h2 id="calculator-title">`.
- Cada input numérico tiene `<label htmlFor>` real y `aria-describedby` apuntando a su descripción.
- `inputMode="decimal"` (no `numeric`): habilita la coma en el teclado del teléfono, necesaria para tasas con decimales.
- Slider nativo: navegable con flechas, con foco visible sobre el thumb (`:focus-visible`).
- Selector de moneda: `<fieldset>` con `<legend class="sr-only">` y `aria-pressed` en cada opción.
- Resultado principal en `<output aria-live="polite">` — **solo** el valor principal, no todo el panel, para no anunciar en cada paso mientras se arrastra.
- Advertencia con `role="status"` e ícono además del color.
- Reset anuncia "Valores restablecidos." en una región `sr-only` con `aria-live="polite"`.
- CTA es un enlace real a `#agendar`, 48px de alto.

Verificado: flechas mueven el slider (100 → 102), `:focus-visible` activo, el foco **no** se pierde al recalcular.

## 13. Casos límite verificados

| Caso | Resultado |
|---|---|
| Valores iniciales | Exactos (tabla §3) |
| Todo en 0 | Todos los resultados en 0, sin errores |
| Objetivo < actual (30% → 20%) | Oportunidad 0 + advertencia visible |
| Valores iguales (20% / 20%) | Diferencia 0, barras del mismo ancho |
| Límites (100% / 100%) | Sin desborde, oportunidad 0 |
| Campo vacío y reescritura | Sin `NaN`, `undefined` ni `Infinity` |
| Cambio de moneda | Solo cambia el formato; valores fuente intactos (100, 10, 20, 500000) |
| Restablecer | Vuelve exacto a los valores iniciales |

Sin errores de consola en ninguno.

## 14. Cómo modificarla

**Cambiar copys**: `content/calculator.ts`, objeto `CALCULATOR_CONTENT`.

**Cambiar valores iniciales**: `CALCULATOR_DEFAULTS` en el mismo archivo.

**Cambiar límites, pasos o etiquetas de un campo**: el objeto correspondiente en `CALCULATOR_FIELDS`. Ningún componente repite estos números.

**Agregar o quitar un campo**:
1. Agregar la propiedad al tipo `CalculatorValues` en `lib/calculator.ts`.
2. Agregar su entrada en `CALCULATOR_FIELDS` y su valor en `CALCULATOR_DEFAULTS`.
3. Usarla dentro de `calculateOpportunity`.
El panel de entradas se genera con un `map` sobre `CALCULATOR_FIELDS`, así que no hay que tocar JSX.

**Reemplazar la fórmula cuando se defina el modelo definitivo**: reescribir `calculateOpportunity` en `lib/calculator.ts`. Es una función pura sin React; mientras devuelva las mismas claves de `CalculatorResults`, ningún componente cambia. Si cambian las claves, el único archivo de presentación afectado es `calculator-results.tsx`.

**Agregar una moneda**: sumarla al tipo `Currency` y al array `CURRENCIES`. Recordar que **no** habilita conversión — solo formato.

## 15. Diferencias respecto del brief

- **Fondo de la sección en `#DFEDEF` con halos blancos.** Las dos columnas usan `bg-white`, `border-border-soft`, `rounded-lg` y `shadow-soft` para distinguirse de la franja sin introducir otro color de bloque.
- **Contenido sobre superficies blancas.** Entradas, resultados, divisores y pistas de barras usan los tokens claros del sistema para conservar jerarquía y contraste sobre el nuevo fondo.
- **Se creó `components/ui/animated-number.tsx`** en vez de reutilizar `animated-counter.tsx`, por los motivos de §9. El brief lo contemplaba explícitamente.
- **Se agregó la clase `.calculator-range` a `app/globals.css`**. Es la única modificación a estilos globales: una clase nueva y aislada, ningún selector existente fue tocado. Fue necesaria porque el aspecto de un `<input type="range">` se define con pseudo-elementos por motor (`::-webkit-slider-thumb`, `::-moz-range-thumb`) que las clases utilitarias no alcanzan.
- **No existe `docs/references/`** en el repositorio, así que no hubo capturas de referencia que inspeccionar.
- **No hay suite de pruebas** configurada en el proyecto; no se instaló ninguna solo para esta sección. Los casos de §13 se verificaron en el navegador real.

## 16. Pendiente de aprobación

- Modelo y fórmula comercial definitivos.
- Copys finales (los actuales son provisorios, DEC-P04).
- Rangos y pasos de cada campo.
- Valor promedio inicial por moneda (hoy `500000` para ambas).
- Si la calculadora debe integrarse con Calendly o solo enlazar a `#agendar`.
