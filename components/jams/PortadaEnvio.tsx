import { ViewTransition } from "react";
import Portada from "@/components/proyectos/Portada";
import { comoImagen, portadaEnvio, type Envio } from "@/lib/api-jams";
import { cn } from "@/lib/utils";

interface Props {
  envio: Pick<Envio, "id" | "nombre" | "equipoNombre" | "imagenes">;
  sizes: string;
  preload?: boolean;
  alt?: string;
  className?: string;
}

/**
 * Lámina 4:3 del envío. Con imagen es la misma Portada de los proyectos (ThumbHash, variantes y morph tarjeta → detalle);
 * sin imagen, un papel hundido con el nombre del equipo en Newsreader, sin iconos ni colores inventados.
 */
export default function PortadaEnvio({ envio, sizes, preload, alt = "", className }: Props) {
  const imagen = portadaEnvio(envio);
  if (imagen) return <Portada id={envio.id} nombre={envio.nombre} imagen={comoImagen(imagen)} sizes={sizes} preload={preload} alt={alt} className={className} />;
  return (
    <ViewTransition name={`portada-${envio.id}`} share="morph" default="none">
      <div className={cn("lamina [container-type:inline-size]", className)}>
        <span aria-hidden className="absolute inset-0 flex flex-col items-center justify-center gap-[2cqi] px-[8cqi] text-center">
          <span className="font-display text-[clamp(1.25rem,9cqi,3.5rem)] font-normal italic leading-[1.05] text-ink-muted [text-wrap:balance]">{envio.equipoNombre}</span>
          <span className="h-px w-[12cqi] bg-brand-primary opacity-60" />
        </span>
      </div>
    </ViewTransition>
  );
}
