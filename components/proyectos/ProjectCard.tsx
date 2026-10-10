import Link from "next/link";
import { Sello } from "@/components/ui/Badge";
import Portada from "@/components/proyectos/Portada";
import { imagenPortada, type Proyecto } from "@/lib/tipos";
import { cn } from "@/lib/utils";

/** Anchos de la lámina según la retícula auto-fill (18 rem mínimo, columna de 1280 px). */
export const SIZES_RETICULA = "(min-width: 1440px) 320px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw";

interface Props {
  proyecto: Proyecto;
  href?: string;
  /** Mi espacio: sello de estado sobre la lámina. */
  mostrarEstado?: boolean;
  /** Las dos primeras láminas de la retícula se precargan. */
  preload?: boolean;
  sizes?: string;
  className?: string;
}

/** Líder del equipo (o quien creó el proyecto). */
function lider(p: Proyecto): string {
  return (p.miembros.find((m) => m.esLider) ?? p.miembros[0])?.usuario.nombre ?? p.creador?.nombre ?? "";
}

/** Lámina 4:3 con pie de dos líneas: nombre en Newsreader y «Líder · Carrera». Sin chips ni contadores. */
export default function ProjectCard({ proyecto, href, mostrarEstado, preload, sizes = SIZES_RETICULA, className }: Props) {
  const destino = href ?? `/proyectos/${proyecto.slug}`;
  const meta = [lider(proyecto), proyecto.carrera?.nombre].filter(Boolean).join(" · ");

  return (
    <article className={cn("min-w-0", className)}>
      <Link href={destino} className="lamina-enlace group outline-offset-4" transitionTypes={["abrir"]}>
        <div className="relative">
          <Portada id={proyecto.id} nombre={proyecto.nombre} imagen={imagenPortada(proyecto)} sizes={sizes} preload={preload} />
          {mostrarEstado && <Sello estado={proyecto.estado} />}
        </div>
        <div className="mt-4">
          <h3 className="pie-t text-ink-default">{proyecto.nombre}</h3>
          {meta && <p className="mt-1 text-body-small text-ink-muted">{meta}</p>}
        </div>
      </Link>
    </article>
  );
}
