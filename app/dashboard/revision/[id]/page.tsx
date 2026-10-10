"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Chip, EstadoBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Section";
import { Field, Textarea } from "@/components/ui/Field";
import { Modal, Skeleton, useToast } from "@/components/ui/Feedback";
import { useSesion } from "@/components/sesion/SesionProvider";
import { actualizarProyecto, getHistorial, getProyectoPorId } from "@/lib/api-proyectos";
import { obtenerUrlEmbedYoutube } from "@/lib/youtube";
import { ESTADO_LABEL, type HistorialItem, type Proyecto } from "@/lib/tipos";
import { cn, fechaCorta, urlSegura } from "@/lib/utils";

/** Pantalla del docente: ve el proyecto tal como quedaria publicado y decide con un clic. */
export default function RevisionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { esDocente, cargando } = useSesion();
  const { avisar } = useToast();
  const [proyecto, setProyecto] = useState<Proyecto | null | undefined>(undefined);
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [observaciones, setObservaciones] = useState("");
  const [modal, setModal] = useState<"publicar" | "cambios" | null>(null);
  const [trabajando, setTrabajando] = useState(false);
  const [imagen, setImagen] = useState(0);

  useEffect(() => {
    if (!cargando && !esDocente) router.replace("/dashboard");
  }, [cargando, esDocente, router]);
  useEffect(() => {
    getProyectoPorId(id).then(setProyecto).catch(() => setProyecto(null));
    getHistorial(id).then(setHistorial).catch(() => null);
  }, [id]);

  const decidir = async (estado: "PUBLICADO" | "EN_DESARROLLO", destacado?: boolean) => {
    if (!proyecto) return;
    setTrabajando(true);
    try {
      const p = await actualizarProyecto(proyecto.id, { estado, ...(estado === "EN_DESARROLLO" ? { observaciones: observaciones.trim() } : {}), ...(destacado !== undefined ? { destacado } : {}) });
      setProyecto(p);
      setModal(null);
      avisar(estado === "PUBLICADO" ? "Publicado. El equipo recibirá un correo." : "Observaciones enviadas al equipo.");
      getHistorial(id).then(setHistorial).catch(() => null);
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo guardar", "error");
    } finally {
      setTrabajando(false);
    }
  };

  const alternarDestacado = async () => {
    if (!proyecto) return;
    try {
      setProyecto(await actualizarProyecto(proyecto.id, { destacado: !proyecto.destacado }));
      avisar(proyecto.destacado ? "Ya no está destacado" : "Marcado como destacado");
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo cambiar", "error");
    }
  };

  if (proyecto === undefined) return <Container className="py-10"><Skeleton className="h-8 w-1/2" /><Skeleton className="mt-6 aspect-video" /></Container>;
  if (proyecto === null) return <Container className="py-20 text-center"><p className="text-ink-muted">No encontramos este proyecto o no tienes acceso.</p><Button href="/dashboard" variant="outline" className="mt-4">Volver al panel</Button></Container>;

  const video = obtenerUrlEmbedYoutube(proyecto.youtubeUrl);
  const enlaces = [
    ["Demo", urlSegura(proyecto.demoUrl)],
    ["Repositorio", urlSegura(proyecto.githubUrl)],
    ["Figma", urlSegura(proyecto.figmaUrl)],
    ["Build", urlSegura(proyecto.buildUrl)],
  ].filter(([, h]) => h) as [string, string][];
  const checklist = [
    { ok: !!proyecto.tagline, label: "Tiene frase corta" },
    { ok: (proyecto.descripcion ?? "").length >= 80, label: "Descripción suficiente" },
    { ok: proyecto.imagenes.length > 0, label: `${proyecto.imagenes.length} imagen(es)` },
    { ok: proyecto.tecnologias.length > 0, label: "Tecnologías indicadas" },
    { ok: enlaces.length > 0, label: "Al menos un enlace (demo, repo, video)" },
    { ok: !!proyecto.leccionAprendida, label: "Cuenta qué aprendieron" },
    { ok: proyecto.miembros.length > 0, label: `${proyecto.miembros.length} integrante(s)` },
    { ok: proyecto.docentes.length > 0, label: proyecto.docentes.length ? `Docentes: ${proyecto.docentes.map((d) => d.usuario.nombre.split(" ")[0]).join(", ")}` : "Sin docente asignado" },
  ];

  return (
    <Container className="py-8">
      <nav className="text-xs text-ink-muted"><Link href="/dashboard" className="hover:text-ink-default">Panel docente</Link> / Revisión</nav>
      <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="titular-2 text-ink-default">{proyecto.nombre}</h1>
            <EstadoBadge estado={proyecto.estado} />
            {proyecto.destacado && <Chip><Icono nombre="estrella" tam={14} />Destacado</Chip>}
          </div>
          {proyecto.tagline && <p className="mt-1 text-ink-muted">{proyecto.tagline}</p>}
          {proyecto.versionActual > 0 && proyecto.estado !== "PUBLICADO" && (
            <div className="mt-3 rounded-md border border-linea bg-surface-sunken p-3 text-sm">
              <p className="font-semibold text-ink-muted">Nueva versión (v{proyecto.versionActual + 1}) de un proyecto ya publicado</p>
              <p className="mt-1 text-ink-default"><span className="font-semibold">Qué cambió según el equipo:</span> {proyecto.resumenCambios ?? "—"}</p>
              <Link href={`/proyectos/${proyecto.slug}`} className="mt-1 inline-block text-xs text-brand-primary hover:underline">Ver la versión {proyecto.versionActual} que hoy es pública</Link>
            </div>
          )}
          <p className="mt-1 text-xs text-ink-muted">{[proyecto.carrera?.nombre, proyecto.ciclo ? `Ciclo ${proyecto.ciclo}` : null, proyecto.periodo].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href={`/dashboard/proyectos/${proyecto.id}`} variant="ghost">Editar contenido</Button>
          {proyecto.estado === "PUBLICADO" && <Button variant="outline" onClick={alternarDestacado}>{proyecto.destacado ? "Quitar destacado" : "Destacar"}</Button>}
          {proyecto.estado === "PUBLICADO" && <Button href={`/proyectos/${proyecto.slug}`} variant="outline">Ver público</Button>}
          {proyecto.estado !== "PUBLICADO" && <Button variant="outline" onClick={() => setModal("cambios")}>Solicitar cambios</Button>}
          {proyecto.estado !== "PUBLICADO" && <Button onClick={() => setModal("publicar")}>Publicar</Button>}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-md bg-surface-sunken">
            {proyecto.imagenes.length ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={proyecto.imagenes[imagen]?.url} alt="" className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center text-sm text-ink-subtle">Sin imágenes</div>
            )}
          </div>
          {proyecto.imagenes.length > 1 && (
            <div className="-mt-5 flex gap-2 overflow-x-auto">
              {proyecto.imagenes.map((img, i) => (
                <button key={img.id} type="button" onClick={() => setImagen(i)} className={cn("h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2", i === imagen ? "border-brand-primary" : "border-transparent opacity-70")}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <section className="card p-6">
            <h2 className="font-display text-title font-medium text-ink-default">Descripción</h2>
            <div className="prose-vitrina mt-3 text-ink-default">{(proyecto.descripcion ?? "—").split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>
          </section>

          {video && <div className="aspect-video overflow-hidden rounded-md bg-ink-default"><iframe src={video} title="Video" className="h-full w-full" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /></div>}

          <section className="grid gap-4 sm:grid-cols-2">
            {([["comoLoConstruyeron", "Cómo lo construyeron"], ["retosSuperados", "Retos"], ["leccionAprendida", "Aprendizajes"], ["queHarianDiferente", "Qué harían diferente"]] as const).map(([campo, titulo]) => (
              <div key={campo} className="card p-5">
                <h3 className="font-display text-title font-medium text-ink-default">{titulo}</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-ink-default">{proyecto[campo] || <span className="text-ink-subtle">No completado</span>}</p>
              </div>
            ))}
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-5">
            <h3 className="font-display text-title font-medium text-ink-default">Checklist de calidad</h3>
            <ul className="mt-3 space-y-2">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-start gap-2 text-sm">
                  <span className={cn("mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-caption", c.ok ? "bg-state-success text-state-on-success" : "bg-surface-sunken text-ink-default")}><Icono nombre={c.ok ? "check" : "alerta"} tam={12} /></span>
                  <span className={c.ok ? "text-ink-muted" : "text-ink-default"}>{c.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="font-display text-title font-medium text-ink-default">Equipo</h3>
            <ul className="mt-3 space-y-2">
              {proyecto.miembros.map((m) => (
                <li key={m.usuarioId} className="flex items-center gap-2 text-sm"><Avatar name={m.usuario.nombre} src={m.usuario.fotoUrl} size="sm" /><span className="min-w-0"><span className="block truncate font-medium text-ink-default">{m.usuario.nombre}</span><span className="block truncate text-xs text-ink-muted">{m.rol}</span></span></li>
              ))}
            </ul>
            {proyecto.docentes.length > 0 && <p className="mt-3 border-t border-linea pt-2 text-xs text-ink-muted">Docentes: {proyecto.docentes.map((d) => d.usuario.nombre).join(", ")}</p>}
          </div>
          {enlaces.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-title font-medium text-ink-default">Enlaces</h3>
              <ul className="mt-2 space-y-1">{enlaces.map(([l, h]) => <li key={l}><a href={h} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-primary hover:underline">{l}</a></li>)}</ul>
            </div>
          )}
          {proyecto.tecnologias.length > 0 && <div className="card p-5"><h3 className="font-display text-title font-medium text-ink-default">Tecnologías</h3><div className="mt-2 flex flex-wrap gap-1.5">{proyecto.tecnologias.map((t) => <Chip key={t.tecnologia.id}>{t.tecnologia.nombre}</Chip>)}</div></div>}
          {historial.length > 0 && (
            <div className="card p-5">
              <h3 className="font-display text-title font-medium text-ink-default">Historial</h3>
              <ol className="mt-3 space-y-3 border-l border-linea pl-4">
                {historial.map((h) => (
                  <li key={h.id} className="relative text-xs"><span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand-primary" /><p className="font-semibold text-ink-default">{ESTADO_LABEL[h.aEstado]}</p><p className="text-ink-muted">{h.actor?.nombre ?? "Sistema"} · {fechaCorta(h.createdAt)}</p>{h.observaciones && <p className="mt-1 rounded-lg bg-surface-sunken p-2 text-ink-default">{h.observaciones}</p>}</li>
                ))}
              </ol>
            </div>
          )}
        </aside>
      </div>

      <Modal
        abierto={modal === "publicar"}
        onCerrar={() => setModal(null)}
        titulo="Publicar este proyecto"
        descripcion="Quedará visible para todos con su URL propia y el equipo recibirá un correo. Puedes destacarlo para que aparezca primero en la portada."
        acciones={<><Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button variant="outline" loading={trabajando} onClick={() => decidir("PUBLICADO", true)}>Publicar y destacar</Button><Button loading={trabajando} onClick={() => decidir("PUBLICADO")}>Publicar</Button></>}
      />
      <Modal
        abierto={modal === "cambios"}
        onCerrar={() => setModal(null)}
        titulo="Solicitar cambios"
        descripcion="El proyecto vuelve a borrador y el equipo recibe tus observaciones por correo. Sé concreto: qué falta y cómo mejorarlo."
        acciones={<><Button variant="ghost" onClick={() => setModal(null)}>Cancelar</Button><Button loading={trabajando} disabled={observaciones.trim().length < 10} onClick={() => decidir("EN_DESARROLLO")}>Enviar observaciones</Button></>}
      >
        <Field label="Observaciones" htmlFor="obs" contador={{ actual: observaciones.length, max: 2000 }}>
          <Textarea id="obs" rows={5} maxLength={2000} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Ej. Falta el enlace al repositorio y una captura del panel de administración. La descripción explica el qué pero no el para quién." autoFocus />
        </Field>
      </Modal>
    </Container>
  );
}
