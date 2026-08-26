"use client";

/**
 * Fachada de video: muestra un botón de reproducción (o un estado
 * "pendiente" si todavía no hay video real) y recién monta el iframe de
 * YouTube después de que el usuario interactúa. Es "use client" porque
 * necesita estado (¿ya se hizo clic?) — el resto del hero no lo necesita,
 * por eso vive separado en su propio componente chico.
 *
 * Lee antes: docs/DESIGN_SYSTEM.md sección 7 ("Video principal").
 */

import { useState } from "react";
import Image from "next/image";
import { Play, Video as VideoIcon } from "lucide-react";

export type HeroVideo = {
  /** null mientras el video real esté pendiente. Nunca un ID inventado. */
  youtubeId: string | null;
  /** Usado en el nombre accesible del botón y en el title del iframe. */
  title: string;
  /** Imagen de portada opcional; sin ella se usa un fondo neutro de marca. */
  poster?: string;
};

export function YouTubeFacade({ video }: { video: HeroVideo }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    // aspect-video reserva el 16:9 antes de que cargue cualquier imagen o
    // iframe, así el layout no salta (CLS). El marco de vidrio va en el
    // componente padre (Hero): acá adentro la superficie queda opaca y
    // nítida, sin blur, tal como pide la spec para el contenido del video.
    <div className="relative aspect-video w-full overflow-hidden rounded-md bg-text-primary">
      {video.youtubeId === null ? (
        // Tarjeta sólida en vez de un cartel gris: el cliente pidió que el
        // estado "sin video todavía" se vea como una superficie de marca,
        // no como un placeholder de diseño. Sigue sin ser clickeable ni
        // tener aria-label de "reproducir" — no hay nada que reproducir
        // todavía, y fingir que sí sería engañoso.
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-500 to-brand-700 text-text-on-brand">
          <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-white/20">
            <VideoIcon aria-hidden="true" size={26} strokeWidth={1.75} />
          </span>
          <span className="text-sm font-medium text-white/90">
            Video disponible próximamente
          </span>
        </div>
      ) : isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
          title={`Video: ${video.title}`}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        // <a> real hacia YouTube, no <button>: sin JavaScript el enlace
        // sigue funcionando (abre el video en YouTube). Con JavaScript,
        // el click se intercepta y se monta el iframe acá mismo.
        <a
          href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
          onClick={(event) => {
            event.preventDefault();
            setIsPlaying(true);
          }}
          aria-label={`Reproducir video: ${video.title}`}
          className="group absolute inset-0 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
        >
          {video.poster ? (
            <Image
              src={video.poster}
              alt=""
              fill
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-12 to-surface-soft" />
          )}
          <span className="relative flex h-16 w-16 items-center justify-center rounded-pill bg-white/90 shadow-float transition-transform duration-fast ease-brand group-hover:scale-105">
            <Play aria-hidden="true" size={26} className="translate-x-0.5 fill-brand-700 text-brand-700" />
          </span>
        </a>
      )}
    </div>
  );
}
