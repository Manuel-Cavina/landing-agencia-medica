"use client";

/**
 * Tarjeta individual de la sección "Resultados".
 *
 * Comparte con el roadmap el radio exterior, el borde suave, el ritmo de
 * padding y la elevación de 3px. Su superficie permanece transparente:
 * no recupera el bloque turquesa que separaba las tarjetas del fondo.
 *
 * Compacta: medía 606px de alto y el cliente la pidió más chica. Se bajó
 * la imagen de aspect-[4/5] a aspect-[4/3] (el recorte sigue siendo
 * cómodo para un retrato), la cita a dos líneas y la cifra un escalón
 * tipográfico. El ancho no cambió: lo fija el carrusel con basis-[25%].
 *
 * La card comparte la geometría del roadmap, pero no su placa turquesa:
 * borde, radio, padding y elevación organizan el contenido sin producir
 * un salto de color contra el fondo de Resultados.
 */

import Image from "next/image";
import { Building2, Hospital, Stethoscope, type LucideIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import type { ProfessionalCase } from "@/content/results";

const CATEGORY_ICONS: Record<ProfessionalCase["category"], LucideIcon> = {
  professional: Stethoscope,
  clinic: Hospital,
  company: Building2,
};

export function ProfessionalCard({ case: item }: { case: ProfessionalCase }) {
  const CategoryIcon = CATEGORY_ICONS[item.category];

  return (
    <article
      // Tarjeta BLANCA sobre el fondo #DFEDEF de la sección.
      //
      // Este componente pasó por las tres variantes y el orden importa
      // para entender por qué ésta es la correcta:
      //
      //  1. Blanca sobre sección blanca -> el borde recortaba el fondo
      //     sin separar nada. Un marco que no hacía trabajo.
      //  2. Sin caja, transparente -> resolvía lo anterior, pero al
      //     pasar la sección a #DFEDEF el contenido quedó apoyado
      //     directamente sobre el tinte, sin jerarquía.
      //  3. Blanca sobre #DFEDEF (ésta) -> el blanco por fin CONTRASTA
      //     con el fondo, así que el borde y la sombra vuelven a hacer
      //     lo que se supone que hacen: levantar la tarjeta del plano.
      //
      // Efecto secundario medido: el texto vuelve a apoyarse sobre
      // blanco puro. brand-700 pasa de 3,88:1 (falla AA) a 4,66:1 (lo
      // cumple) y text-primary llega a 11,54:1.
      //
      // Hover: lift de 3px + shadow-float + borde turquesa, el mismo
      // trío que usan las tarjetas del roadmap.
      className="flex h-full flex-col rounded-lg border border-border-soft bg-white p-3 shadow-soft transition-[box-shadow,border-color,translate] duration-slow ease-brand hover:-translate-y-[3px] hover:border-brand-500/40 hover:shadow-float motion-reduce:transition-none"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md bg-surface-soft">
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.name} — ${item.specialty}`}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 85vw"
            className="object-cover"
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 42%, var(--brand-20), transparent 68%)",
              }}
            />
            <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
              <span className="absolute h-36 w-36 rounded-pill border border-border-soft/70" />
              <span className="absolute h-52 w-52 rounded-pill border border-white/60" />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-pill border border-border-soft bg-white/75 text-brand-700 shadow-soft backdrop-blur-sm">
                <CategoryIcon size={32} strokeWidth={1.5} />
              </span>
            </div>
          </>
        )}

        {/* ELIMINADA: píldora de categoría ("Profesional" / "Clínica" /
            "Empresa") en la esquina superior izquierda de la imagen.
            Se sacó a pedido del cliente.

            La categoría igual sigue viva en los datos y se sigue
            leyendo: define qué ícono se dibuja en el marcador de imagen
            (CATEGORY_ICONS). Solo dejó de escribirse como texto. */}
      </div>

      <div className="flex flex-1 flex-col px-1.5 pb-1 pt-4">
        {/* Turquesa, a pedido del cliente: el nombre es lo primero que
            se lee de la tarjeta y así engancha con la cifra de abajo,
            que ya usa el mismo brand-700. Sobre blanco da 4,66:1 y
            cumple AA. */}
        <h3 className="text-[15px] font-bold tracking-tight text-brand-700">{item.name}</h3>
        <p className="mt-0.5 text-[13px] text-text-secondary">{item.specialty}</p>

        {/* Dos líneas, no tres: es una cita de apoyo, no el contenido
            principal de la tarjeta. La cifra de abajo es lo que importa. */}
        <p className="mt-2.5 line-clamp-2 flex-1 text-[13px] leading-relaxed text-text-secondary">
          &ldquo;{item.quote}&rdquo;
        </p>

        <div className="mt-3 border-t border-border-soft pt-3">
          <p className="text-xl font-black tracking-tight text-brand-700 sm:text-2xl">
            <AnimatedCounter value={item.value} currency={item.currency} suffix={item.suffix} />
          </p>
          <p className="mt-0.5 text-[11px] font-medium text-text-secondary">{item.metricLabel}</p>
        </div>
      </div>
    </article>
  );
}
