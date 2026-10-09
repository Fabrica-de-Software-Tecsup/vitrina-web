"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Section";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { CardSkeleton, EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import ProyectosFiltrables from "@/components/proyectos/ProyectosFiltrables";
import { editarPerfil, getDirectorio, getPerfil, subirCV } from "@/lib/api-usuarios";
import { listarProyectos } from "@/lib/api-proyectos";
import { useSesion } from "@/components/sesion/SesionProvider";
import { extraerIdDeSlug, urlSegura } from "@/lib/utils";
import type { Perfil, Proyecto } from "@/lib/tipos";

export default function PerfilPage() {
  const { slug } = useParams<{ slug: string }>();
  const { usuario, recargar } = useSesion();
  const { avisar } = useToast();
  const [perfil, setPerfil] = useState<Perfil | null | undefined>(undefined);
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null);
  const [acompanados, setAcompanados] = useState<Proyecto[] | null>(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ bio: "", ciudad: "", githubUrl: "", linkedinUrl: "", portfolioUrl: "" });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // El slug termina con los 6 primeros caracteres del id; resolvemos el id completo con el directorio.
    const prefijo = extraerIdDeSlug(slug);
    getDirectorio()
      .then((lista) => lista.find((u) => u.id.startsWith(prefijo)))
      .then((u) => (u ? getPerfil(u.id) : null))
      .then((p) => {
        setPerfil(p);
        if (p) {
          listarProyectos({ miembroId: p.id, limit: 100 }).then((r) => setProyectos(r.items)).catch(() => setProyectos([]));
          if (p.rol === "DOCENTE" || p.rol === "ADMIN") listarProyectos({ docenteId: p.id, limit: 100 }).then((r) => setAcompanados(r.items)).catch(() => setAcompanados([]));
        }
      })
      .catch(() => setPerfil(null));
  }, [slug]);

  const esMio = !!usuario && perfil?.id === usuario.id;
  const esDocentePerfil = perfil?.rol === "DOCENTE" || perfil?.rol === "ADMIN";
  const techs = useMemo(() => {
    const s = new Map<string, number>();
    [...(proyectos ?? []), ...(acompanados ?? [])].forEach((p) => p.tecnologias.forEach((t) => s.set(t.tecnologia.nombre, (s.get(t.tecnologia.nombre) ?? 0) + 1)));
    return [...s.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n);
  }, [proyectos, acompanados]);

  const empezarEdicion = () => {
    if (!perfil) return;
    setForm({ bio: perfil.bio ?? "", ciudad: perfil.ciudad ?? "", githubUrl: perfil.githubUrl ?? "", linkedinUrl: perfil.linkedinUrl ?? "", portfolioUrl: perfil.portfolioUrl ?? "" });
    setEditando(true);
  };
  const guardar = async () => {
    if (!perfil) return;
    setGuardando(true);
    try {
      const actualizado = await editarPerfil(perfil.id, form);
      setPerfil(actualizado);
      setEditando(false);
      avisar("Perfil actualizado");
      void recargar();
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo guardar", "error");
    } finally {
      setGuardando(false);
    }
  };
  const cambiarCV = async (file: File | undefined) => {
    if (!file || !perfil) return;
    try {
      setPerfil(await subirCV(perfil.id, file));
      avisar("CV actualizado");
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo subir el CV", "error");
    }
  };

  if (perfil === undefined) return <Container className="py-10"><Skeleton className="h-40" /><Skeleton className="mt-6 h-6 w-1/3" /></Container>;
  if (perfil === null) return <Container className="py-20"><EmptyState icono="🙈" titulo="Perfil no encontrado" accion={<Button href="/estudiantes" variant="outline">Ver estudiantes</Button>} /></Container>;

  const enlaces = [
    { label: "GitHub", href: urlSegura(perfil.githubUrl) },
    { label: "LinkedIn", href: urlSegura(perfil.linkedinUrl) },
    { label: "Portafolio", href: urlSegura(perfil.portfolioUrl) },
  ].filter((e) => e.href);

  return (
    <>
      <div className="bg-mesh relative -mt-16 h-48 pt-16 sm:h-56" />
      <Container className="-mt-16 pb-16">
        <div className="card relative p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
            <Avatar name={perfil.nombre} src={perfil.fotoUrl} size="xl" className="-mt-20 ring-4 ring-white shadow-lift sm:-mt-24" />
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-2xl font-extrabold text-ink-900 sm:text-3xl">{perfil.nombre}</h1>
              <p className="mt-1 text-sm text-ink-600">
                {[esDocentePerfil ? "Docente" : null, perfil.carrera?.nombre, !esDocentePerfil && perfil.ciclo ? `Ciclo ${perfil.ciclo}` : null, perfil.sede, perfil.ciudad].filter(Boolean).join(" · ") || "Sin datos académicos"}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {enlaces.map((e) => (
                  <a key={e.label} href={e.href!} target="_blank" rel="noopener noreferrer" className="rounded-full border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700">{e.label} ↗</a>
                ))}
                {perfil.correo && <a href={`mailto:${perfil.correo}`} className="rounded-full border border-ink-200 px-3 py-1 text-xs font-semibold text-ink-700 hover:border-brand-400 hover:text-brand-700">Correo</a>}
                {urlSegura(perfil.cvUrl) && <a href={urlSegura(perfil.cvUrl)!} target="_blank" rel="noopener noreferrer" className="rounded-full bg-ink-900 px-3 py-1 text-xs font-semibold text-white hover:bg-ink-800">Ver CV (PDF)</a>}
              </div>
            </div>
            {esMio && !editando && (
              <div className="flex gap-2">
                <label className="inline-flex h-10 cursor-pointer items-center rounded-full border border-ink-200 bg-white px-4 text-sm font-semibold text-ink-800 hover:border-brand-400">
                  {perfil.cvUrl ? "Cambiar CV" : "Subir CV"}
                  <input type="file" accept="application/pdf" className="hidden" onChange={(e) => cambiarCV(e.target.files?.[0])} />
                </label>
                <Button variant="outline" onClick={empezarEdicion}>Editar perfil</Button>
              </div>
            )}
          </div>

          {editando ? (
            <div className="mt-6 grid gap-4 border-t border-ink-100 pt-6 sm:grid-cols-2">
              <Field label="Sobre mí" htmlFor="bio" className="sm:col-span-2" contador={{ actual: form.bio.length, max: 500 }}>
                <Textarea id="bio" value={form.bio} maxLength={500} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Qué te gusta construir, en qué quieres trabajar…" />
              </Field>
              <Field label="Ciudad" htmlFor="ciudad"><Input id="ciudad" value={form.ciudad} onChange={(e) => setForm({ ...form, ciudad: e.target.value })} /></Field>
              <Field label="GitHub" htmlFor="gh" hint="https://github.com/usuario"><Input id="gh" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} /></Field>
              <Field label="LinkedIn" htmlFor="li" hint="https://www.linkedin.com/in/usuario"><Input id="li" value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })} /></Field>
              <Field label="Portafolio o web" htmlFor="pf"><Input id="pf" value={form.portfolioUrl} onChange={(e) => setForm({ ...form, portfolioUrl: e.target.value })} placeholder="https://" /></Field>
              <div className="flex gap-2 sm:col-span-2 sm:justify-end">
                <Button variant="ghost" onClick={() => setEditando(false)}>Cancelar</Button>
                <Button onClick={guardar} loading={guardando}>Guardar cambios</Button>
              </div>
              <p className="text-xs text-ink-500 sm:col-span-2">Carrera, ciclo y sede se cambian en <a href="/onboarding" className="font-semibold text-brand-700">datos académicos</a>.</p>
            </div>
          ) : (
            perfil.bio && <p className="mt-6 max-w-3xl border-t border-ink-100 pt-6 text-ink-700">{perfil.bio}</p>
          )}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="space-y-12">
            {esDocentePerfil && (
              acompanados === null ? (
                <div className="grid gap-6 sm:grid-cols-2">{[1, 2].map((i) => <CardSkeleton key={i} />)}</div>
              ) : (
                <ProyectosFiltrables
                  proyectos={acompanados}
                  titulo="Proyectos que acompaña"
                  mostrarEstado={esMio}
                  hrefDe={(p) => (esMio && p.estado !== "PUBLICADO" ? `/dashboard/revision/${p.id}` : undefined)}
                  vacio={{ titulo: "Todavía no acompaña proyectos", texto: esMio ? "Cuando un equipo te elija como docente involucrado, sus proyectos aparecerán aquí con filtros por carrera, periodo y tecnología." : "Los equipos lo pueden elegir como docente involucrado al crear su proyecto." }}
                />
              )
            )}
            {(proyectos === null || proyectos.length > 0 || !esDocentePerfil) && (
              proyectos === null ? (
                !esDocentePerfil && <div className="grid gap-6 sm:grid-cols-2">{[1, 2].map((i) => <CardSkeleton key={i} />)}</div>
              ) : (
                <ProyectosFiltrables
                  proyectos={proyectos}
                  titulo={esDocentePerfil ? "Proyectos propios" : "Proyectos"}
                  mostrarEstado={esMio}
                  vacio={{ titulo: "Sin proyectos publicados", texto: esMio ? "Publica tu primer proyecto para que aparezca aquí." : "Todavía no ha publicado proyectos.", accion: esMio ? <Button href="/dashboard/proyectos/nuevo">Publicar proyecto</Button> : undefined }}
                />
              )
            )}
          </div>
          <aside className="space-y-4">
            <div className="card p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">Tecnologías</h3>
              {techs.length ? <div className="mt-3 flex flex-wrap gap-1.5">{techs.map((t) => <Chip key={t} size="md">{t}</Chip>)}</div> : <p className="mt-2 text-sm text-ink-500">Aparecen al publicar proyectos.</p>}
            </div>
            {perfil.experiencia && (
              <div className="card p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">Experiencia</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-ink-700">{perfil.experiencia}</p>
              </div>
            )}
          </aside>
        </div>
      </Container>
    </>
  );
}
