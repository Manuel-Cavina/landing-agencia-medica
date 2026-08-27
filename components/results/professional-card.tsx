/**
 * Tarjeta individual de la sección "Resultados". Server Component: el
 * único fragmento que necesita JavaScript (el número animado) vive
 * aislado en components/ui/animated-counter.tsx.
 *
 * Diseño elegido por el cliente después de comparar 6 variantes lado a
 * lado en el carrusel real: foto grande arriba (58% de la tarjeta) con
 * una tarjeta de vidrio (nombre + especialidad) flotando sobre el borde
 * inferior de la foto. El vidrio de esa etiqueta usa el mismo estilo que
 * el botón "Ver video" del hero (bg-brand-12 + borde + blur), no el
 * blanco de .glass-surface -- pedido explícito del cliente para unificar
 * el lenguaje visual entre el hero y esta sección.
 */

import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import type { ProfessionalCase } from "@/content/results";

const CATEGORY_LABELS: Record<ProfessionalCase["category"], string> = {
  professional: "Profesional",
  clinic: "Clínica",
  company: "Empresa",
};

export function ProfessionalCard({ case: item }: { case: ProfessionalCase }) {
  return (
    <article className="flex h-full min-h-[450px] flex-col overflow-hidden rounded-lg shadow-soft">
      <div className="relative h-[58%] min-h-[240px] w-full shrink-0 bg-surface-soft">
        {item.image ? (
          <Image
            src={item.image}
            alt={`${item.name} — ${item.specialty}`}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 85vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-text-secondary">
            <ImageIcon aria-hidden="true" size={28} strokeWidth={1.5} />
            <span className="text-xs font-medium">[FOTO PENDIENTE]</span>
          </div>
        )}

        <span className="absolute left-3 top-3 rounded-pill bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
          {CATEGORY_LABELS[item.category]}
        </span>

        {/* Mismo vidrio que "Ver video" en el hero (bg-brand-12 + borde +
            blur), no .glass-surface blanco -- a pedido del cliente. */}
        <div className="absolute inset-x-4 -bottom-7 rounded-lg border border-border-soft bg-brand-12 px-4 py-3 backdrop-blur-sm">
          <h3 className="text-base font-semibold text-text-secondary">{item.name}</h3>
          <p className="text-sm text-text-secondary">{item.specialty}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 bg-surface px-6 pt-11 pb-6">
        <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-text-secondary">
          &ldquo;{item.quote}&rdquo;
        </p>
        <div>
          <p className="text-2xl font-semibold text-brand-700 sm:text-3xl">
            <AnimatedCounter value={item.value} currency={item.currency} suffix={item.suffix} />
          </p>
          <p className="mt-1 text-xs font-medium text-text-primary">{item.metricLabel}</p>
        </div>
      </div>
    </article>
  );
}
