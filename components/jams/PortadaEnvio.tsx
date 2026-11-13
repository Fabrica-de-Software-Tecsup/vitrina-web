import { ViewTransition } from "react";
import Portada from "@/components/proyectos/Portada";
import { comoImagen, portadaEnvio, type Envio } from "@/lib/api-jams";
import { cn } from "@/lib/utils";

interface Props {
  envio: Pick<Envio, "id" | "nombre" | "frase" | "equipoNombre" | "categoria" | "imagenes">;
  sizes: string;
  preload?: boolean;
  alt?: string;
  className?: string;
}

/**
 * Lámina 4:3 del envío. Con imagen es la misma Portada de los proyectos (ThumbHash, variantes y morph tarjeta → detalle);
 * sin imagen, una lámina editorial con categoría, nombre del proyecto, frase y equipo en los tokens de Vitrina.
 */
export default function PortadaEnvio({ envio, sizes, preload, alt = "", className }: Props) {
  const imagen = portadaEnvio(envio);
  if (imagen) return <Portada id={envio.id} nombre={envio.nombre} imagen={comoImagen(imagen)} sizes={sizes} preload={preload} alt={alt} className={className} />;
  return (
    <ViewTransition name={`portada-${envio.id}`} share="morph" default="none">
      <div
        className={cn("lamina [container-type:inline-size]", className)}
        style={{
          backgroundImage:
            "radial-gradient(80% 70% at 85% 15%, color-mix(in oklch, var(--c-brand-primary) 14%, transparent), transparent 70%), radial-gradient(65% 65% at 10% 90%, color-mix(in oklch, var(--c-brand-primary) 7%, transparent), transparent 65%)",
        }}
      >
        <div aria-hidden className="absolute inset-0 flex flex-col justify-between p-[7cqi]">
          <div className="flex items-center justify-end">
            <span className="h-[1.8cqi] w-[1.8cqi] rounded-full bg-brand-primary/60" />
          </div>

          <div className="my-auto flex flex-col gap-[2cqi]">
            <span className="font-display text-[clamp(1.25rem,8.5cqi,3rem)] font-normal leading-[1.08] tracking-tight text-ink-default line-clamp-2 [text-wrap:balance]">
              {envio.nombre}
            </span>
            <span className="h-px w-[12cqi] bg-brand-primary opacity-75" />
            {envio.frase && (
              <span className="text-[clamp(0.75rem,3.6cqi,1.0625rem)] leading-[1.35] text-ink-muted line-clamp-2 [text-wrap:pretty]">
                {envio.frase}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-linea/70 pt-[2.2cqi]">
            <span className="truncate font-display text-[clamp(0.75rem,3.5cqi,1rem)] italic text-ink-muted">
              {envio.equipoNombre}
            </span>
            {envio.categoria && (
              <span className="shrink-0 rounded-sm border border-linea bg-surface-default/60 px-[2cqi] py-[0.5cqi] text-[clamp(0.625rem,2.8cqi,0.8125rem)] font-medium tracking-wide text-ink-muted">
                {envio.categoria}
              </span>
            )}
          </div>
        </div>
      </div>
    </ViewTransition>
  );
}
