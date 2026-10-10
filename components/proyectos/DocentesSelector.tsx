"use client";

import { useMemo, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import Icono from "@/components/ui/Icono";
import { Field, Input } from "@/components/ui/Field";
import type { DocenteOpcion } from "@/lib/api-usuarios";
import { cn } from "@/lib/utils";

interface Props {
  docentes: DocenteOpcion[];
  seleccionados: string[];
  onChange: (ids: string[]) => void;
  carreraId?: number | null;
  disabled?: boolean;
}

/** Elige uno o varios docentes; primero los de la carrera del proyecto, agrupados por carrera y con buscador. */
export default function DocentesSelector({ docentes, seleccionados, onChange, carreraId, disabled }: Props) {
  const [q, setQ] = useState("");
  const texto = q.trim().toLowerCase();

  const grupos = useMemo(() => {
    const filtrados = docentes.filter((d) => !texto || d.nombre.toLowerCase().includes(texto) || d.carrera?.nombre.toLowerCase().includes(texto));
    const porCarrera = new Map<string, DocenteOpcion[]>();
    for (const d of filtrados) {
      const k = d.carrera?.nombre ?? "Sin carrera asignada";
      porCarrera.set(k, [...(porCarrera.get(k) ?? []), d]);
    }
    const propia = docentes.find((d) => d.carrera?.id === carreraId)?.carrera?.nombre;
    return [...porCarrera.entries()].sort((a, b) => (a[0] === propia ? -1 : b[0] === propia ? 1 : a[0].localeCompare(b[0])));
  }, [docentes, texto, carreraId]);

  const elegidos = seleccionados.map((id) => docentes.find((d) => d.id === id)).filter(Boolean) as DocenteOpcion[];
  const alternar = (id: string) => onChange(seleccionados.includes(id) ? seleccionados.filter((x) => x !== id) : [...seleccionados, id].slice(0, 5));

  return (
    <Field label="Docentes involucrados" required hint="Necesitas al menos uno para enviar a revisión: él recibe el aviso y lo valida. Puedes sumar más en versiones futuras (máx. 5).">
      {elegidos.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {elegidos.map((d) => (
            <span key={d.id} className="inline-flex items-center gap-1.5 rounded-full bg-brand-container py-0.5 pl-0.5 pr-2.5 text-xs font-semibold text-brand-on-container">
              <Avatar name={d.nombre} src={d.fotoUrl} size="xs" />{d.nombre}
              {!disabled && <button type="button" aria-label={`Quitar ${d.nombre}`} onClick={() => alternar(d.id)} className="text-brand-on-container hover:text-ink-default"><Icono nombre="cerrar" tam={14} /></button>}
            </span>
          ))}
        </div>
      )}
      <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar docente por nombre o carrera…" disabled={disabled} />
      <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-linea bg-surface-raised">
        {grupos.length === 0 && <p className="p-3 text-sm text-ink-muted">No hay docentes con ese nombre. Si tu docente aún no entró a Vitrina, pídele que lo haga o avisa al administrador.</p>}
        {grupos.map(([carrera, lista]) => (
          <div key={carrera}>
            <p className={cn("sticky top-0 bg-surface-sunken px-3 py-1 text-caption font-bold ", lista[0].carrera?.id === carreraId ? "text-brand-primary" : "text-ink-muted")}>{carrera}{lista[0].carrera?.id === carreraId ? " · tu carrera" : ""}</p>
            {lista.map((d) => {
              const activo = seleccionados.includes(d.id);
              return (
                <button key={d.id} type="button" disabled={disabled} onClick={() => alternar(d.id)} className={cn("flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-surface-sunken disabled:opacity-60", activo && "bg-brand-container")}>
                  <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border", activo ? "border-brand-primary bg-brand-primary text-brand-on-primary" : "border-surface-outline")}>{activo && <Icono nombre="check" tam={12} />}</span>
                  <Avatar name={d.nombre} src={d.fotoUrl} size="sm" />
                  <span className="font-medium text-ink-default">{d.nombre}</span>
                  {d.sede && <span className="ml-auto text-xs text-ink-subtle">{d.sede}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </Field>
  );
}
