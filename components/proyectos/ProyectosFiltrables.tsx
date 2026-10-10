"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Field";
import { EmptyState } from "@/components/ui/Feedback";
import ProjectCard from "@/components/proyectos/ProjectCard";
import type { Proyecto } from "@/lib/tipos";

interface Props {
  proyectos: Proyecto[];
  titulo: string;
  vacio: { titulo: string; texto?: string; accion?: React.ReactNode };
  mostrarEstado?: boolean;
  hrefDe?: (p: Proyecto) => string | undefined;
}

/** Grilla de proyectos con filtros locales por carrera, periodo y tecnologia (aparecen solo cuando hay variedad). */
export default function ProyectosFiltrables({ proyectos, titulo, vacio, mostrarEstado, hrefDe }: Props) {
  const [carrera, setCarrera] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [tecnologia, setTecnologia] = useState("");

  const carreras = useMemo(() => [...new Set(proyectos.map((p) => p.carrera?.nombre).filter(Boolean) as string[])].sort(), [proyectos]);
  const periodos = useMemo(() => [...new Set(proyectos.map((p) => p.periodo).filter(Boolean) as string[])].sort().reverse(), [proyectos]);
  const tecnologias = useMemo(() => {
    const c = new Map<string, number>();
    proyectos.forEach((p) => p.tecnologias.forEach((t) => c.set(t.tecnologia.nombre, (c.get(t.tecnologia.nombre) ?? 0) + 1)));
    return [...c.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n);
  }, [proyectos]);

  const visibles = proyectos.filter(
    (p) =>
      (!carrera || p.carrera?.nombre === carrera) &&
      (!periodo || p.periodo === periodo) &&
      (!tecnologia || p.tecnologias.some((t) => t.tecnologia.nombre === tecnologia)),
  );
  const hayFiltros = proyectos.length > 1 && (carreras.length > 1 || periodos.length > 1 || tecnologias.length > 1);

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-display text-xl font-bold text-ink-900">
          {titulo} <span className="text-base font-medium text-ink-400">({visibles.length}{visibles.length !== proyectos.length ? ` de ${proyectos.length}` : ""})</span>
        </h2>
        {hayFiltros && (
          <div className="flex flex-wrap gap-2">
            {carreras.length > 1 && (
              <Select value={carrera} onChange={(e) => setCarrera(e.target.value)} className="w-auto py-1.5 text-xs" aria-label="Carrera">
                <option value="">Todas las carreras</option>
                {carreras.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            )}
            {periodos.length > 1 && (
              <Select value={periodo} onChange={(e) => setPeriodo(e.target.value)} className="w-auto py-1.5 text-xs" aria-label="Periodo">
                <option value="">Todos los periodos</option>
                {periodos.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            )}
          </div>
        )}
      </div>
      {hayFiltros && tecnologias.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Chip active={!tecnologia} onClick={() => setTecnologia("")}>Todas</Chip>
          {tecnologias.slice(0, 14).map((t) => <Chip key={t} active={tecnologia === t} onClick={() => setTecnologia(tecnologia === t ? "" : t)}>{t}</Chip>)}
        </div>
      )}
      <div className="mt-4">
        {proyectos.length === 0 ? (
          <EmptyState icono="carpeta" titulo={vacio.titulo} texto={vacio.texto} accion={vacio.accion} />
        ) : visibles.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-500">Ningún proyecto coincide con esos filtros.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">{visibles.map((p) => <ProjectCard key={p.id} proyecto={p} mostrarEstado={mostrarEstado && p.estado !== "PUBLICADO"} href={hrefDe?.(p)} />)}</div>
        )}
      </div>
    </section>
  );
}
