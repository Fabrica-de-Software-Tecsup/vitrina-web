import Link from "next/link";
import Icono from "@/components/ui/Icono";
import PortadaEnvio from "@/components/jams/PortadaEnvio";
import { SIZES_RETICULA } from "@/components/proyectos/ProjectCard";
import type { Envio } from "@/lib/api-jams";
import { cn } from "@/lib/utils";

/** Distintivo del reconocimiento: sello opaco sobre la esquina, con la estrella en terracota. */
export function Reconocimiento({ texto, className }: { texto: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 max-w-full items-center gap-1.5 rounded-sm bg-surface-default px-2.5 text-caption font-semibold text-ink-default shadow-[0_0_0_0.5px_var(--c-marco)]",
        className,
      )}
    >
      <Icono nombre="estrella" tam={14} className="shrink-0 text-brand-primary" />
      <span className="truncate">{texto}</span>
    </span>
  );
}

interface Props {
  envio: Envio;
  jamSlug: string;
  preload?: boolean;
  className?: string;
}

/** Lámina 4:3 con pie de dos líneas, como las de Explorar: nombre del proyecto y «Equipo · Categoría». */
export default function TarjetaEnvio({ envio, jamSlug, preload, className }: Props) {
  const meta = [envio.equipoNombre, envio.categoria].filter(Boolean).join(" · ");
  return (
    <article className={cn("min-w-0", className)}>
      <Link href={`/jams/${jamSlug}/p/${envio.slug}`} className="lamina-enlace group outline-offset-4" transitionTypes={["abrir"]}>
        <div className="relative">
          <PortadaEnvio envio={envio} sizes={SIZES_RETICULA} preload={preload} />
          {envio.reconocimiento && <Reconocimiento texto={envio.reconocimiento} className="absolute left-2 top-2 z-[1] max-w-[calc(100%-1rem)]" />}
        </div>
        <div className="mt-4">
          <h3 className="pie-t text-ink-default">{envio.nombre}</h3>
          {meta && <p className="mt-1 text-body-small text-ink-muted">{meta}</p>}
        </div>
      </Link>
    </article>
  );
}
