import Link from "next/link";
import { AvatarGroup } from "@/components/ui/Avatar";
import { Chip, EstadoBadge } from "@/components/ui/Badge";
import { portadaDe, type Proyecto } from "@/lib/tipos";
import { cn, formatoNumero } from "@/lib/utils";

interface Props {
  proyecto: Proyecto;
  href?: string;
  mostrarEstado?: boolean;
  className?: string;
}

/** Tarjeta de proyecto: portada 16:10, carrera, nombre, tagline, chips de stack y equipo. */
export default function ProjectCard({ proyecto, href, mostrarEstado, className }: Props) {
  const portada = portadaDe(proyecto);
  const destino = href ?? `/proyectos/${proyecto.slug}`;
  const techs = proyecto.tecnologias.slice(0, 4);
  const resto = proyecto.tecnologias.length - techs.length;

  return (
    <Link href={destino} className={cn("card card-hover group flex flex-col overflow-hidden", className)}>
      <div className="relative aspect-[16/10] overflow-hidden bg-ink-100">
        {portada ? (
          // eslint-disable-next-line @next/next/no-img-element -- imagenes del storage externo
          <img
            src={portada}
            alt={proyecto.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-100 via-white to-violet-500/10">
            <span className="font-display text-4xl font-bold text-brand-300">{proyecto.nombre.slice(0, 1)}</span>
          </div>
        )}
        {proyecto.destacado && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-[11px] font-bold text-amber-950 shadow-sm">★ Destacado</span>
        )}
        {mostrarEstado && (
          <div className="absolute bottom-3 left-3">
            <EstadoBadge estado={proyecto.estado} className="bg-white/95" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        {proyecto.carrera && <p className="truncate text-[11px] font-semibold text-brand-700">{proyecto.carrera.nombre}</p>}
        <p className="mt-0.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-400">
          <span>{[proyecto.ciclo ? `Ciclo ${proyecto.ciclo}` : null, proyecto.periodo].filter(Boolean).join(" · ") || "Proyecto"}</span>
          {proyecto.versionActual > 1 && <span className="rounded-full bg-violet-500/10 px-1.5 py-0.5 text-[10px] font-bold normal-case tracking-normal text-violet-500">v{proyecto.versionActual}</span>}
        </p>
        <h3 className="mt-1 line-clamp-1 font-display text-base font-bold text-ink-900 group-hover:text-brand-700">{proyecto.nombre}</h3>
        <p className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-ink-600">
          {proyecto.tagline ?? proyecto.descripcion ?? "Sin descripción todavía."}
        </p>

        {techs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {techs.map((t) => (
              <Chip key={t.tecnologia.id}>{t.tecnologia.nombre}</Chip>
            ))}
            {resto > 0 && <Chip className="text-ink-400">+{resto}</Chip>}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-ink-100 pt-3">
          <AvatarGroup personas={proyecto.miembros.map((m) => ({ nombre: m.usuario.nombre, fotoUrl: m.usuario.fotoUrl }))} />
          <span className="text-[11px] text-ink-400">{formatoNumero(proyecto.vistas)} vistas</span>
        </div>
      </div>
    </Link>
  );
}
