"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Chip, EstadoBadge } from "@/components/ui/Badge";
import { Container, Stat } from "@/components/ui/Section";
import { CardSkeleton, EmptyState, Tabs } from "@/components/ui/Feedback";
import ProjectCard from "@/components/proyectos/ProjectCard";
import { useSesion } from "@/components/sesion/SesionProvider";
import SeccionCuenta from "@/components/sesion/SeccionCuenta";
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
    <Container className="pt-12 sm:pt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="titular-2 text-ink-default">Hola, {usuario!.nombre.split(" ")[0]}</h1>
          <p className="mt-2 text-ink-muted">{usuario!.carrera?.nombre}{usuario!.ciclo ? ` · Ciclo ${usuario!.ciclo}` : ""}</p>
        </div>
        <Button href="/dashboard/proyectos/nuevo" size="lg" icon={<Icono nombre="mas" tam={18} />}>Nuevo proyecto</Button>
      </div>

      {conObservaciones.length > 0 && (
        <div className="mt-8 flex gap-3 rounded-md border border-linea bg-surface-raised p-4" role="status">
          <Icono nombre="alerta" className="mt-0.5 text-state-warning" />
          <div>
          <p className="text-sm font-semibold text-ink-default">Tu docente dejó observaciones en {conObservaciones.length === 1 ? "un proyecto" : `${conObservaciones.length} proyectos`}</p>
          <ul className="mt-2 space-y-1">
            {conObservaciones.map((p) => (
              <li key={p.id} className="text-sm text-ink-default">
                <Link href={`/dashboard/proyectos/${p.id}`} className="font-semibold underline-offset-2 hover:underline">{p.nombre}</Link>: <span className="italic">“{p.observaciones}”</span>
              </li>
            ))}
          </ul>
          </div>
        </div>
      )}

      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
        <Stat valor={conteo.todos} label={conteo.todos === 1 ? "proyecto" : "proyectos"} />
        <Stat valor={conteo.PUBLICADO ?? 0} label={(conteo.PUBLICADO ?? 0) === 1 ? "publicado" : "publicados"} />
        <Stat valor={formatoNumero(vistas)} label="vistas acumuladas" />
        <Stat valor={new Set((proyectos ?? []).flatMap((p) => p.tecnologias.map((t) => t.tecnologia.nombre))).size} label="tecnologías usadas" />
      </dl>

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
          <div className="reticula">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
        ) : visibles.length === 0 ? (
          <EmptyState
            icono="carpeta"
            titulo={proyectos.length === 0 ? "Publica tu primer proyecto" : "Nada en esta pestaña"}
            texto={proyectos.length === 0 ? "Solo necesitas una frase, una descripción y una foto para enviarlo a revisión. Lo demás lo completas cuando quieras." : undefined}
            accion={proyectos.length === 0 ? <Button href="/dashboard/proyectos/nuevo">Empezar ahora</Button> : undefined}
          />
        ) : (
          <div className="reticula">
            {visibles.map((p) => (
              <ProjectCard key={p.id} proyecto={p} mostrarEstado href={p.estado === "PUBLICADO" ? `/proyectos/${p.slug}` : `/dashboard/proyectos/${p.id}`} />
            ))}
          </div>
        )}
      </div>

      <SeccionCuenta />
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
    <Container className="pt-12 sm:pt-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="titular-2 text-ink-default">Hola, {usuario!.nombre.split(" ")[0]}</h1>
          <p className="mt-3 max-w-xl text-ink-muted">Los alumnos crean y documentan sus proyectos solos. Tu trabajo es revisar la cola: publicar o devolver con observaciones. Nada más.</p>
        </div>
        <div className="flex gap-2">
          {esAdmin && <Button href="/admin" variant="outline">Administración</Button>}
          <Button href="/dashboard/proyectos/nuevo" variant="outline" icon={<Icono nombre="mas" tam={18} />}>Proyecto propio</Button>
        </div>
      </div>

      <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 lg:grid-cols-4">
        <Stat valor={revision?.length ?? "—"} label="esperan tu revisión" />
        <Stat valor={asesorados?.length ?? "—"} label="proyectos donde participas" />
        <Stat valor={(asesorados ?? []).filter((p) => p.estado === "PUBLICADO").length} label="de ellos, publicados" />
        <Stat valor={formatoNumero((asesorados ?? []).reduce((s, p) => s + p.vistas, 0))} label="vistas acumuladas" />
      </dl>

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
          <div className="reticula">{[1, 2, 3].map((i) => <CardSkeleton key={i} />)}</div>
        ) : lista.length === 0 ? (
          <EmptyState icono="bandeja" titulo={tab === "revision" ? "No hay nada por revisar" : "Nada por aquí"} texto={tab === "revision" ? "Cuando un equipo envíe su proyecto te avisaremos por correo." : "Los alumnos pueden sumarte como docente involucrado al crear o actualizar su proyecto."} />
        ) : tab === "revision" ? (
          <ul className="card divide-y divide-linea">
            {lista.map((p) => {
              const portada = portadaDe(p);
              return (
                <li key={p.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-sm bg-surface-sunken shadow-[0_0_0_1px_var(--c-marco)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {portada && <img src={portada} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-display text-[1.1875rem] font-medium text-ink-default">{p.nombre}</p>
                      {p.carrera && <Chip color={p.carrera.color}>{p.carrera.nombre}</Chip>}
                      {p.docentes.some((d) => d.usuarioId === usuario!.id) && <Chip className="border-linea bg-brand-container text-brand-primary">Te eligió como docente</Chip>}
                      {p.versionActual > 0 && <Chip className="border-linea bg-surface-sunken text-ink-muted">Nueva versión (v{p.versionActual + 1})</Chip>}
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{p.tagline ?? p.descripcion}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-muted">
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
          <div className="reticula">
            {lista.map((p) => (
              <div key={p.id} className="relative">
                <ProjectCard proyecto={p} mostrarEstado href={p.estado === "POR_REVISAR" ? `/dashboard/revision/${p.id}` : p.estado === "PUBLICADO" ? `/proyectos/${p.slug}` : `/dashboard/proyectos/${p.id}`} />
                {tab === "asesorados" && (
                  <div className="absolute right-3 top-3 flex gap-1">
                    <Link href={`/dashboard/revision/${p.id}`} className="rounded-sm bg-surface-raised px-2.5 py-1 text-caption font-semibold text-ink-default shadow-sm hover:bg-surface-sunken">{ESTADO_LABEL[p.estado]} · gestionar</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-8 text-body-small text-ink-muted">¿Un estado no coincide? <EstadoBadge estado="POR_REVISAR" className="align-middle" /> significa que el equipo ya terminó y espera tu decisión.</p>

      <SeccionCuenta />
    </Container>
  );
}
