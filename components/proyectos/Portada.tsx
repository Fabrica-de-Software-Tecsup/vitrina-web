import { ViewTransition, type CSSProperties } from "react";
import Image from "next/image";
import { cargadorDe, placeholderDe, posicionFocal } from "@/lib/imagenes";
import type { Imagen } from "@/lib/tipos";
import { cn } from "@/lib/utils";

interface Props {
  /** id del proyecto: da nombre a la transición compartida tarjeta → detalle. */
  id: string;
  nombre: string;
  imagen: Imagen | null;
  /** Ancho que ocupa la lámina en cada punto de corte (para el srcset). */
  sizes: string;
  /** Solo la portada del detalle y las dos primeras láminas de una retícula. */
  preload?: boolean;
  /** En tarjetas usa recorte 4:3 (`cover`); en el detalle conviene mostrar la captura completa (`contain`). */
  ajustar?: "cover" | "contain";
  alt?: string;
  className?: string;
}

/**
 * La lámina: portada 4:3 con marco de 1 px (o halo en oscuro), hueco teñido con el color dominante y el
 * ThumbHash mientras carga. Es el mismo elemento en la tarjeta y en la cabecera del detalle: ambas llevan
 * `portada-${id}` y la vista se transforma de una a otra («abrir la vitrina»).
 */
export default function Portada({ id, nombre, imagen, sizes, preload, ajustar = "cover", alt = "", className }: Props) {
  const dominante = imagen?.colorDominante ?? undefined;
  const lqip = placeholderDe(imagen?.placeholder);
  const loader = imagen ? cargadorDe(imagen) : undefined;
  const esContain = ajustar === "contain";
  const estilo = {
    backgroundColor: esContain ? undefined : dominante,
    backgroundImage: esContain
      ? dominante
        ? `radial-gradient(75% 75% at 50% 50%, color-mix(in oklch, ${dominante} 14%, transparent), transparent 72%)`
        : undefined
      : lqip
        ? `url(${lqip})`
        : undefined,
    "--dominante": dominante,
  } as CSSProperties;

  return (
    <ViewTransition name={`portada-${id}`} share="morph" default="none">
      <div className={cn("lamina", esContain && "bg-surface-sunken", className)} style={estilo}>
        {imagen ? (
          <Image
            src={imagen.url}
            alt={alt}
            fill
            sizes={sizes}
            preload={preload}
            loading={preload ? undefined : "lazy"}
            {...(loader ? { loader } : { unoptimized: true })}
            style={esContain ? { objectFit: "contain" } : { objectFit: "cover", objectPosition: posicionFocal(imagen) }}
          />
        ) : (
          <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-[clamp(3rem,10cqi,6rem)] font-normal text-ink-subtle [container-type:inline-size]">
            {nombre.trim().slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>
    </ViewTransition>
  );
}
