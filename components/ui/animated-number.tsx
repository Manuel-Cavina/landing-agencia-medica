"use client";

/**
 * Número que se desplaza suavemente desde su valor ANTERIOR hasta el
 * nuevo cada vez que cambia.
 *
 * Por qué no se reutiliza components/ui/animated-counter.tsx: ese
 * componente siempre arranca en 0, se reinicia al salir del viewport y
 * hace un setState por frame. Sirve para el carrusel de Resultados
 * (donde "contar desde cero" es justamente el efecto buscado), pero acá
 * sería un error: al arrastrar un slider volvería a cero en cada
 * movimiento y dispararía un render de React por frame.
 *
 * Por qué una interpolación con duración y no un resorte: un resorte se
 * acerca a su destino de forma asintótica, nunca lo toca. Con importes
 * de millones eso se ve -- medido, el número quedaba en $4.997.819 en
 * lugar de $5.000.000, y necesitaba más de dos segundos para cerrar la
 * diferencia. Una interpolación con `animate()` llega al valor EXACTO al
 * terminar, en un tiempo previsible y sin rebote.
 *
 * El valor vive en un MotionValue y el texto se escribe directo en el
 * DOM: arrastrar el slider no genera renders de React. Cada cambio
 * detiene la animación anterior y arranca una nueva desde donde estaba,
 * así no se acumulan colas al arrastrar.
 */

import { useEffect, useRef } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";

const DURATION_SECONDS = 0.5;
const EASE = [0.22, 1, 0.36, 1] as const;

export function AnimatedNumber({
  value,
  format,
  className = "",
}: {
  value: number;
  /** Cómo mostrar el número (moneda, decimales, etc.). */
  format: (value: number) => string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const display = useMotionValue(value);

  // El formateador cambia de identidad cuando cambia la moneda. Se
  // guarda en un ref para que la suscripción no tenga que rehacerse. Se
  // escribe dentro de un efecto, no durante el render: React 19 prohíbe
  // tocar `.current` mientras se renderiza (regla react-hooks/refs).
  const formatRef = useRef(format);
  useEffect(() => {
    formatRef.current = format;
  }, [format]);

  // Suscripción única: Motion escribe el texto en cada frame sin pasar
  // por el ciclo de render de React.
  useEffect(() => {
    const write = (latest: number) => {
      if (ref.current) ref.current.textContent = formatRef.current(latest);
    };
    write(display.get());
    return display.on("change", write);
  }, [display]);

  useEffect(() => {
    if (prefersReducedMotion) {
      display.set(value);
      return;
    }
    const controls = animate(display, value, { duration: DURATION_SECONDS, ease: EASE });
    return () => controls.stop();
  }, [value, display, prefersReducedMotion]);

  // Cambió solo el formato (ARS <-> USD): se reescribe el texto con el
  // valor actual, sin reiniciar la animación ni volver a cero.
  useEffect(() => {
    if (ref.current) ref.current.textContent = format(display.get());
  }, [format, display]);

  // El contenido inicial se renderiza en el servidor con el valor real,
  // así el número es correcto antes de que corra cualquier JavaScript.
  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
