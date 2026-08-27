/**
 * El bloque de imagen de cada tarjeta del roadmap: una franja vertical a
 * la izquierda, con la proporción y la posición del boceto del cliente.
 *
 * Todavía NO hay ilustraciones definitivas (`public/` solo tiene el logo
 * y una foto de prueba), así que por ahora se dibuja un placeholder
 * explícito -- con el ícono del pilar y una etiqueta visible de que la
 * imagen está pendiente. No se inventa ni se descarga nada: cuando
 * lleguen las ilustraciones reales, basta con completar el campo
 * opcional `image` de cada pilar en content/pillars.ts y este componente
 * las usa sin ningún otro cambio.
 *
 * No es "use client" a propósito: no usa hooks ni estado. Cuando se
 * renderiza desde roadmap-card.tsx ("use client"), viaja igual dentro
 * del bundle de cliente.
 */

import Image from "next/image";
import {
  Sparkles,
  Users,
  Network,
  Bot,
  ClipboardCheck,
  CalendarCheck,
  ChartNoAxesCombined,
  type LucideIcon,
} from "lucide-react";
import type { Pillar, RoadmapIconName } from "@/content/pillars";

const ICONS: Record<RoadmapIconName, LucideIcon> = {
  sparkles: Sparkles,
  users: Users,
  network: Network,
  bot: Bot,
  clipboard: ClipboardCheck,
  calendar: CalendarCheck,
  chart: ChartNoAxesCombined,
};

/**
 * El ícono de un pilar, para que roadmap-card.tsx lo use en su esquina.
 *
 * Es un componente propio (y no una función que DEVUELVE el componente
 * de Lucide) a propósito: resolver un componente durante el render hace
 * que React lo trate como uno nuevo en cada pasada, y la regla
 * `react-hooks/static-components` lo marca como error. Acá la búsqueda
 * en el mapa ocurre adentro de un componente estable.
 */
export function PillarIcon({
  name,
  className,
  size = 18,
}: {
  name: RoadmapIconName;
  className?: string;
  size?: number;
}) {
  const Icon = ICONS[name];
  return <Icon aria-hidden="true" size={size} strokeWidth={1.5} className={className} />;
}

export function RoadmapVisual({ pillar }: { pillar: Pillar }) {
  const Icon = ICONS[pillar.iconName];

  return (
    <div className="relative h-56 w-full overflow-hidden rounded-md bg-surface-soft sm:h-full sm:min-h-[380px]">
      {pillar.image ? (
        <Image
          src={pillar.image}
          alt=""
          fill
          sizes="(min-width: 768px) 240px, 100vw"
          className="object-cover"
        />
      ) : (
        <>
          {/* Halo turquesa muy tenue, mismo recurso que hero.tsx. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 42%, var(--brand-20), transparent 70%)",
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-700">
            <span className="flex h-16 w-16 items-center justify-center rounded-pill border border-border-soft bg-white/70 backdrop-blur-sm">
              <Icon aria-hidden="true" size={26} strokeWidth={1.5} />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-text-secondary">
              Imagen pendiente
            </span>
          </div>
        </>
      )}
    </div>
  );
}
