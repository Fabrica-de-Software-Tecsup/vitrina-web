"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Chip, EstadoBadge } from "@/components/ui/Badge";
import { Container, Stat } from "@/components/ui/Section";
import { CardSkeleton, EmptyState, Tabs } from "@/components/ui/Feedback";
import ProjectCard from "@/components/proyectos/ProjectCard";
import { useSesion } from "@/components/sesion/SesionProvider";
import { listarProyectos } from "@/lib/api-proyectos";
import { fechaCorta, formatoNumero } from "@/lib/utils";
import { ESTADO_LABEL, type EstadoProyecto, type Proyecto, portadaDe } from "@/lib/tipos";

type TabAlumno = "todos" | EstadoProyecto;
type TabDocente = "revision" | "asesorados" | "publicados";

export default function DashboardPage() {
  const { usuario, esDocente } = useSesion();
  if (!usuario) return null;
  return esDocente ? <PanelDocente /> : <PanelAlumno />;
}

/* ─────────────── ALUMNO ─────────────── */
function PanelAlumno() {
  const { usuario } = useSesion();
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null);
  const [tab, setTab] = useState<TabAlumno>("todos");

  useEffect(() => {
    listarProyectos({ ambito: "mios", limit: 100 }).then((r) => setProyectos(r.items)).catch(() => setProyectos([]));
  }, []);

  const conteo = useMemo(() => {
    const c: Record<string, number> = { todos: proyectos?.length ?? 0 };
    for (const p of proyectos ?? []) c[p.estado] = (c[p.estado] ?? 0) + 1;
    return c;
  }, [proyectos]);
  const visibles = (proyectos ?? []).filter((p) => tab === "todos" || p.estado === tab);
  const vistas = (proyectos ?? []).reduce((s, p) => s + p.vistas, 0);
  const conObservaciones = (proyectos ?? []).filter((p) => p.estado === "EN_DESARROLLO" && p.observaciones);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Mi espacio</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">Hola, {usuario!.nombre.split(" ")[0]} 👋</h1>
          <p className="mt-1 text-sm text-ink-500">{usuario!.carrera?.nombre}{usuario!.ciclo ? ` · Ciclo ${usuario!.ciclo}` : ""}</p>
        </div>
        <Button href="/dashboard/proyectos/nuevo" size="lg">+ Nuevo proyecto</Button>
      </div>

      {conObservaciones.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">Tu docente dejó observaciones en {conObservaciones.length === 1 ? "un proyecto" : `${conObservaciones.length} proyectos`}</p>
          <ul className="mt-2 space-y-1">
            {conObservaciones.map((p) => (
              <li key={p.id} className="text-sm text-amber-800">
                <Link href={`/dashboard/proyectos/${p.id}`} className="font-semibold underline-offset-2 hover:underline">{p.nombre}</Link>: <span className="italic">“{p.observaciones}”</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat valor={conteo.todos} label="proyectos" icono="📁" />
        <Stat valor={conteo.PUBLICADO ?? 0} label="publicados" icono="✅" />
        <Stat valor={formatoNumero(vistas)} label="vistas acumuladas" icono="👁" />
        <Stat valor={new Set((proyectos ?? []).flatMap((p) => p.tecnologias.map((t) => t.tecnologia.nombre))).size} label="tecnologías usadas" icono="⚡" />
      </div>

      <div className="mt-8">
        <Tabs
          valor={tab}
          onChange={setTab}
          opciones={[
            { id: "todos", label: "Todos", count: conteo.todos },
            { id: "EN_DESARROLLO", label: "Borradores", count: conteo.EN_DESARROLLO ?? 0 },
            { id: "POR_REVISAR", label: "En revisión", count: conteo.POR_REVISAR ?? 0 },
            { id: "PUBLICADO", label: "Publicados", count: conteo.PUBLICADO ?? 0 },
            { id: "OCULTO", label: "Ocultos", count: conteo.OCULTO ?? 0 },
          ]}
        />
      </div>

      <div className="mt-6">
        {proyectos === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
        ) : visibles.length === 0 ? (
          <EmptyState
            icono="🚀"
            titulo={proyectos.length === 0 ? "Publica tu primer proyecto" : "Nada en esta pestaña"}
            texto={proyectos.length === 0 ? "Solo necesitas una frase, una descripción y una foto para enviarlo a revisión. Lo demás lo completas cuando quieras." : undefined}
            accion={proyectos.length === 0 ? <Button href="/dashboard/proyectos/nuevo">Empezar ahora</Button> : undefined}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibles.map((p) => (
              <ProjectCard key={p.id} proyecto={p} mostrarEstado href={p.estado === "PUBLICADO" ? `/proyectos/${p.slug}` : `/dashboard/proyectos/${p.id}`} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

/* ─────────────── DOCENTE ─────────────── */
function PanelDocente() {
  const { usuario, esAdmin } = useSesion();
  const [tab, setTab] = useState<TabDocente>("revision");
  const [revision, setRevision] = useState<Proyecto[] | null>(null);
  const [asesorados, setAsesorados] = useState<Proyecto[] | null>(null);
  const [publicados, setPublicados] = useState<Proyecto[] | null>(null);

  useEffect(() => {
    listarProyectos({ ambito: "revision", limit: 100 }).then((r) => setRevision(r.items)).catch(() => setRevision([]));
    listarProyectos({ ambito: "asesorados", limit: 100 }).then((r) => setAsesorados(r.items)).catch(() => setAsesorados([]));
    listarProyectos({ estado: "PUBLICADO", orden: "recientes", limit: 12 }).then((r) => setPublicados(r.items)).catch(() => setPublicados([]));
  }, []);

  const lista = tab === "revision" ? revision : tab === "asesorados" ? asesorados : publicados;

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Panel docente</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">Hola, {usuario!.nombre.split(" ")[0]}</h1>
          <p className="mt-1 max-w-xl text-sm text-ink-500">Los alumnos crean y documentan sus proyectos solos. Tu trabajo es revisar la cola: publicar o devolver con observaciones. Nada más.</p>
        </div>
        <div className="flex gap-2">
          {esAdmin && <Button href="/admin" variant="outline">Administración</Button>}
          <Button href="/dashboard/proyectos/nuevo" variant="outline">+ Proyecto propio</Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat valor={revision?.length ?? "—"} label="esperan tu revisión" icono="📬" />
        <Stat valor={asesorados?.length ?? "—"} label="proyectos donde estás involucrado" icono="🧭" />
        <Stat valor={(asesorados ?? []).filter((p) => p.estado === "PUBLICADO").length} label="de ellos, publicados" icono="✅" />
        <Stat valor={formatoNumero((asesorados ?? []).reduce((s, p) => s + p.vistas, 0))} label="vistas acumuladas" icono="👁" />
      </div>

      <div className="mt-8">
        <Tabs
          valor={tab}
          onChange={setTab}
          opciones={[
            { id: "revision", label: "Por revisar", count: revision?.length },
            { id: "asesorados", label: "Donde estoy involucrado", count: asesorados?.length },
            { id: "publicados", label: "Publicados recientes", count: publicados?.length },
          ]}
        />
      </div>

      <div className="mt-6">
        {lista === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
        ) : lista.length === 0 ? (
          <EmptyState icono={tab === "revision" ? "🎉" : "📭"} titulo={tab === "revision" ? "No hay nada por revisar" : "Nada por aquí"} texto={tab === "revision" ? "Cuando un equipo envíe su proyecto te avisaremos por correo." : "Los alumnos pueden sumarte como docente involucrado al crear o actualizar su proyecto."} />
        ) : tab === "revision" ? (
          <ul className="card divide-y divide-ink-100">
            {lista.map((p) => {
              const portada = portadaDe(p);
              return (
                <li key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-ink-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {portada && <img src={portada} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-base font-bold text-ink-900">{p.nombre}</p>
                      {p.carrera && <Chip color={p.carrera.color}>{p.carrera.nombre}</Chip>}
                      {p.docentes.some((d) => d.usuarioId === usuario!.id) && <Chip className="border-brand-200 bg-brand-50 text-brand-700">Te eligió como docente</Chip>}
                      {p.versionActual > 0 && <Chip className="border-violet-500/30 bg-violet-500/10 text-violet-500">Nueva versión (v{p.versionActual + 1})</Chip>}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-sm text-ink-600">{p.tagline ?? p.descripcion}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-500">
                      <Avatar name={p.creador.nombre} src={p.creador.fotoUrl} size="xs" />
                      {p.creador.nombre} · {p.miembros.length} integrante{p.miembros.length === 1 ? "" : "s"} · enviado el {fechaCorta(p.updatedAt)}
                    </div>
                  </div>
                  <Button href={`/dashboard/revision/${p.id}`}>Revisar</Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lista.map((p) => (
              <div key={p.id} className="relative">
                <ProjectCard proyecto={p} mostrarEstado href={p.estado === "POR_REVISAR" ? `/dashboard/revision/${p.id}` : p.estado === "PUBLICADO" ? `/proyectos/${p.slug}` : `/dashboard/proyectos/${p.id}`} />
                {tab === "asesorados" && (
                  <div className="absolute right-3 top-3 flex gap-1">
                    <Link href={`/dashboard/revision/${p.id}`} className="rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink-800 shadow-sm hover:bg-white">{ESTADO_LABEL[p.estado]} · gestionar</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-6 text-xs text-ink-400">¿Un estado no coincide? <EstadoBadge estado="POR_REVISAR" className="align-middle" /> significa que el equipo ya terminó y espera tu decisión.</p>
    </Container>
  );
}
