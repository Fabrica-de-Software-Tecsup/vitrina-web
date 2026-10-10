"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Chip, EstadoBadge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Section";
import { EmptyState, Modal, Skeleton, useToast } from "@/components/ui/Feedback";
import ProjectCard from "@/components/proyectos/ProjectCard";
import { getProyectoPorSlug, getRelacionados, getVersion, getVersiones, incrementarCompartidos, incrementarVistas } from "@/lib/api-proyectos";
import { obtenerUrlEmbedYoutube } from "@/lib/youtube";
import { fechaCorta, formatoNumero, slugConId, urlSegura } from "@/lib/utils";
import type { Proyecto, VersionCompleta, VersionResumen } from "@/lib/tipos";
import { useSesion } from "@/components/sesion/SesionProvider";

const SECCIONES: { campo: keyof Proyecto; titulo: string; icono: string }[] = [
  { campo: "comoLoConstruyeron", titulo: "Cómo lo construimos", icono: "🛠️" },
  { campo: "retosSuperados", titulo: "Retos que superamos", icono: "🧗" },
  { campo: "leccionAprendida", titulo: "Lo que aprendimos", icono: "💡" },
  { campo: "queHarianDiferente", titulo: "Qué haríamos diferente", icono: "🔁" },
];

export default function ProyectoPage() {
  const { slug } = useParams<{ slug: string }>();
  const { usuario, esDocente } = useSesion();
  const { avisar } = useToast();
  const [proyecto, setProyecto] = useState<Proyecto | null | undefined>(undefined);
  const [relacionados, setRelacionados] = useState<Proyecto[]>([]);
  const [versiones, setVersiones] = useState<VersionResumen[]>([]);
  const [versionAbierta, setVersionAbierta] = useState<VersionCompleta | null>(null);
  const [imagen, setImagen] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    getProyectoPorSlug(slug)
      .then((p) => {
        setProyecto(p);
        getRelacionados(p.id).then(setRelacionados).catch(() => null);
        if (p.versionActual > 0) getVersiones(p.id).then(setVersiones).catch(() => null);
        const key = `vista-${p.id}`;
        if (p.estado === "PUBLICADO" && !sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, "1");
          incrementarVistas(p.id).catch(() => null);
        }
      })
      .catch(() => setProyecto(null));
  }, [slug]);

  if (proyecto === undefined) {
    return (
      <Container className="py-10">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="mt-4 h-12 w-2/3" />
        <Skeleton className="mt-8 aspect-video w-full" />
      </Container>
    );
  }
  if (proyecto === null) {
    return (
      <Container className="py-20">
        <EmptyState icono="🔍" titulo="Proyecto no encontrado" texto="Puede que aún no esté publicado o que el enlace haya cambiado." accion={<Button href="/proyectos" variant="outline">Explorar proyectos</Button>} />
      </Container>
    );
  }

  const imagenes = proyecto.imagenes;
  const video = obtenerUrlEmbedYoutube(proyecto.youtubeUrl);
  const enlaces = [
    { label: "Ver demo", href: urlSegura(proyecto.demoUrl), icono: "🚀", primario: true },
    { label: "Código en GitHub", href: urlSegura(proyecto.githubUrl), icono: "💻" },
    { label: "Diseño en Figma", href: urlSegura(proyecto.figmaUrl), icono: "🎨" },
    { label: "Descargar build", href: urlSegura(proyecto.buildUrl), icono: "📦" },
  ].filter((e) => e.href);
  const puedeEditar = !!usuario && (esDocente || proyecto.creadorId === usuario.id || proyecto.miembros.some((m) => m.usuarioId === usuario.id));
  const url = typeof window !== "undefined" ? window.location.href : "";

  const compartir = async (destino: "copiar" | "linkedin" | "whatsapp") => {
    if (destino === "copiar") {
      await navigator.clipboard.writeText(url);
      avisar("Enlace copiado");
    } else if (destino === "linkedin") {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank", "noopener");
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(`${proyecto.nombre} — ${url}`)}`, "_blank", "noopener");
    }
    if (proyecto.estado === "PUBLICADO") incrementarCompartidos(proyecto.id).catch(() => null);
  };

  return (
    <>
      <Container className="py-8">
        {/* Migas + estado */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav className="flex items-center gap-1.5 text-xs text-ink-500" aria-label="Migas">
            <Link href="/proyectos" className="hover:text-brand-700">Proyectos</Link>
            {proyecto.carrera && (
              <>
                <span>/</span>
                <Link href={`/proyectos?carreraId=${proyecto.carrera.id}`} className="hover:text-brand-700">{proyecto.carrera.nombre}</Link>
              </>
            )}
          </nav>
          <div className="flex items-center gap-2">
            {proyecto.estado !== "PUBLICADO" && <EstadoBadge estado={proyecto.estado} />}
            {puedeEditar && (
              <Button href={esDocente && proyecto.estado === "POR_REVISAR" ? `/dashboard/revision/${proyecto.id}` : `/dashboard/proyectos/${proyecto.id}`} size="sm" variant="outline">
                {esDocente && proyecto.estado === "POR_REVISAR" ? "Revisar" : "Editar"}
              </Button>
            )}
          </div>
        </div>

        {/* Titulo */}
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {proyecto.categorias.map((c) => (
                <Link key={c.categoria.id} href={`/proyectos?categoriaId=${c.categoria.id}`}><Chip color={c.categoria.color} size="md">{c.categoria.nombre}</Chip></Link>
              ))}
              {proyecto.destacado && <Chip size="md" className="border-amber-200 bg-amber-50 text-amber-800">★ Destacado por docentes</Chip>}
            </div>
            <h1 className="mt-3 font-display text-3xl font-extrabold text-ink-900 sm:text-5xl">{proyecto.nombre}</h1>
            {proyecto.tagline && <p className="mt-3 text-lg text-ink-600 sm:text-xl">{proyecto.tagline}</p>}
            <p className="mt-3 text-sm text-ink-500">
              {[proyecto.ciclo ? `Ciclo ${proyecto.ciclo}` : null, proyecto.periodo, proyecto.publicadoEn ? `Publicado el ${fechaCorta(proyecto.publicadoEn)}` : null, proyecto.versionActual > 1 ? `Versión ${proyecto.versionActual}` : null].filter(Boolean).join(" · ")}
            </p>
            {proyecto.enNuevaVersion && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> El equipo está preparando una nueva versión; ves la última publicada.
              </p>
            )}
            {!proyecto.enNuevaVersion && proyecto.estado !== "PUBLICADO" && proyecto.versionActual > 0 && (
              <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-800 ring-1 ring-brand-200">
                Estás viendo el borrador de la próxima versión. El público sigue viendo la versión {proyecto.versionActual}.
              </p>
            )}

            {/* Galeria */}
            <div className="mt-8 overflow-hidden rounded-3xl bg-ink-100">
              {imagenes.length > 0 ? (
                <button type="button" onClick={() => setLightbox(true)} className="block aspect-video w-full cursor-zoom-in">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagenes[imagen]?.url} alt={`${proyecto.nombre} — imagen ${imagen + 1}`} className="h-full w-full object-cover" />
                </button>
              ) : (
                <div className="flex aspect-video items-center justify-center text-sm text-ink-400">Este proyecto aún no tiene imágenes</div>
              )}
            </div>
            {imagenes.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {imagenes.map((img, i) => (
                  <button key={img.id} type="button" onClick={() => setImagen(i)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${i === imagen ? "border-brand-500" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Descripcion */}
            {proyecto.descripcion && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-bold text-ink-900">Sobre el proyecto</h2>
                <div className="prose-vitrina mt-3 text-ink-700">
                  {proyecto.descripcion.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </section>
            )}

            {video && (
              <section className="mt-10">
                <h2 className="font-display text-xl font-bold text-ink-900">Video demo</h2>
                <div className="mt-3 aspect-video overflow-hidden rounded-3xl bg-ink-900">
                  <iframe src={video} title={`Video de ${proyecto.nombre}`} className="h-full w-full" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
                </div>
              </section>
            )}

            {SECCIONES.some((s) => proyecto[s.campo]) && (
              <section className="mt-10 grid gap-4 sm:grid-cols-2">
                {SECCIONES.filter((s) => proyecto[s.campo]).map((s) => (
                  <div key={s.campo} className="card p-5">
                    <h3 className="flex items-center gap-2 font-display text-base font-bold text-ink-900"><span aria-hidden>{s.icono}</span>{s.titulo}</h3>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-700">{String(proyecto[s.campo])}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          {/* Lateral */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {enlaces.length > 0 && (
              <div className="card p-5">
                <div className="flex flex-col gap-2">
                  {enlaces.map((e) => (
                    <a key={e.label} href={e.href!} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${e.primario ? "bg-brand-600 text-white hover:bg-brand-700" : "bg-ink-50 text-ink-800 hover:bg-ink-100"}`}>
                      <span aria-hidden>{e.icono}</span>{e.label}<span className="ml-auto text-xs opacity-60">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="card p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">Equipo</h3>
              <ul className="mt-3 space-y-3">
                {proyecto.miembros.map((m) => (
                  <li key={m.usuarioId}>
                    <Link href={`/perfiles/${slugConId(m.usuario.nombre, m.usuarioId)}`} className="flex items-center gap-3 rounded-xl p-1 hover:bg-ink-50">
                      <Avatar name={m.usuario.nombre} src={m.usuario.fotoUrl} size="md" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink-900">{m.usuario.nombre}</span>
                        <span className="block truncate text-xs text-ink-500">{m.rol}{m.esLider ? " · líder" : ""}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {proyecto.docentes.length > 0 && (
                <div className="mt-4 border-t border-ink-100 pt-3">
                  <p className="text-xs text-ink-500">{proyecto.docentes.length === 1 ? "Docente involucrado" : "Docentes involucrados"}</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {proyecto.docentes.map((d) => (
                      <li key={d.usuarioId} className="flex items-center gap-2 text-sm font-medium text-ink-800">
                        <Avatar name={d.usuario.nombre} src={d.usuario.fotoUrl} size="xs" />{d.usuario.nombre}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {proyecto.tecnologias.length > 0 && (
              <div className="card p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-ink-400">Tecnologías</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {proyecto.tecnologias.map((t) => (
                    <Link key={t.tecnologia.id} href={`/proyectos?tecnologiaId=${t.tecnologia.id}`}><Chip size="md">{t.tecnologia.nombre}</Chip></Link>
                  ))}
                </div>
              </div>
            )}

            <div className="card p-5">
              <div className="flex items-center justify-between text-sm text-ink-600">
                <span>👁 {formatoNumero(proyecto.vistas)} vistas</span>
                <span>🔗 {formatoNumero(proyecto.compartidos)} compartidos</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Button size="sm" variant="outline" onClick={() => compartir("copiar")}>Copiar</Button>
                <Button size="sm" variant="outline" onClick={() => compartir("linkedin")}>LinkedIn</Button>
                <Button size="sm" variant="outline" onClick={() => compartir("whatsapp")}>WhatsApp</Button>
              </div>
            </div>
          </aside>
        </div>

        {versiones.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-ink-900">Evolución del proyecto</h2>
            <p className="mt-1 text-sm text-ink-500">Cada publicación queda guardada: así se ve cómo creció semestre a semestre.</p>
            <ol className="mt-6 space-y-4 border-l-2 border-brand-200 pl-6">
              {versiones.map((v) => (
                <li key={v.id} className="relative">
                  <span className="absolute -left-[33px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[9px] font-bold text-white ring-4 ring-white">{v.numero}</span>
                  <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-start">
                    {v.imagenes[0] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={v.imagenes[0]} alt="" className="h-20 w-32 shrink-0 rounded-xl object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Versión {v.numero}{v.periodo ? ` · ${v.periodo}` : ""}{v.ciclo ? ` · ciclo ${v.ciclo}` : ""} · {fechaCorta(v.publicadoEn)}</p>
                      <p className="mt-1 font-display text-base font-bold text-ink-900">{v.tagline ?? v.nombre}</p>
                      {v.resumenCambios ? <p className="mt-1 text-sm text-ink-700"><span className="font-semibold">Qué cambió:</span> {v.resumenCambios}</p> : v.numero === 1 ? <p className="mt-1 text-sm text-ink-500">Primera publicación.</p> : null}
                      <div className="mt-2 flex flex-wrap gap-1.5">{v.tecnologias.slice(0, 6).map((t) => <Chip key={t}>{t}</Chip>)}</div>
                      <p className="mt-2 text-xs text-ink-500">{v.miembros.map((m) => m.nombre).join(", ")}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => getVersion(proyecto.id, v.numero).then(setVersionAbierta).catch(() => avisar("No se pudo abrir la versión", "error"))}>Ver versión</Button>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {relacionados.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-2xl font-bold text-ink-900">Proyectos relacionados</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{relacionados.map((p) => <ProjectCard key={p.id} proyecto={p} />)}</div>
          </section>
        )}
      </Container>

      <Modal abierto={!!versionAbierta} onCerrar={() => setVersionAbierta(null)} titulo={versionAbierta ? `Versión ${versionAbierta.numero} · ${versionAbierta.nombre}` : ""} descripcion={versionAbierta ? [versionAbierta.periodo, versionAbierta.ciclo ? `ciclo ${versionAbierta.ciclo}` : null, `publicada el ${fechaCorta(versionAbierta.publicadoEn)}`].filter(Boolean).join(" · ") : undefined} ancho="lg">
        {versionAbierta && (
          <div className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
            {versionAbierta.imagenes.length > 0 && (
              <div className="flex gap-2 overflow-x-auto">
                {versionAbierta.imagenes.map((u) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={u} src={u} alt="" className="h-36 w-56 shrink-0 rounded-xl object-cover" />
                ))}
              </div>
            )}
            {versionAbierta.tagline && <p className="text-base font-semibold text-ink-900">{versionAbierta.tagline}</p>}
            {versionAbierta.resumenCambios && <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-900"><span className="font-semibold">Qué cambió:</span> {versionAbierta.resumenCambios}</p>}
            {versionAbierta.descripcion && <div className="prose-vitrina text-sm text-ink-700">{versionAbierta.descripcion.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}</div>}
            {([["comoLoConstruyeron", "Cómo lo construimos"], ["retosSuperados", "Retos"], ["leccionAprendida", "Lo que aprendimos"], ["queHarianDiferente", "Qué haríamos diferente"]] as const).filter(([c]) => versionAbierta[c]).map(([c, t]) => (
              <div key={c}><p className="text-xs font-bold uppercase tracking-wider text-ink-400">{t}</p><p className="mt-1 whitespace-pre-line text-sm text-ink-700">{versionAbierta[c]}</p></div>
            ))}
            <div className="flex flex-wrap gap-1.5">{versionAbierta.tecnologias.map((t) => <Chip key={t}>{t}</Chip>)}</div>
            <p className="text-xs text-ink-500">Equipo: {versionAbierta.miembros.map((m) => `${m.nombre} (${m.rol})`).join(", ") || "—"}{versionAbierta.docentes.length ? ` · Docentes: ${versionAbierta.docentes.join(", ")}` : ""}</p>
          </div>
        )}
      </Modal>

      <Modal abierto={lightbox} onCerrar={() => setLightbox(false)} titulo={proyecto.nombre} ancho="lg">
        {imagenes[imagen] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imagenes[imagen].url} alt="" className="max-h-[70vh] w-full rounded-2xl object-contain" />
        )}
        {imagenes.length > 1 && (
          <div className="mt-3 flex justify-between">
            <Button size="sm" variant="ghost" onClick={() => setImagen((i) => (i - 1 + imagenes.length) % imagenes.length)}>← Anterior</Button>
            <span className="text-xs text-ink-500">{imagen + 1} / {imagenes.length}</span>
            <Button size="sm" variant="ghost" onClick={() => setImagen((i) => (i + 1) % imagenes.length)}>Siguiente →</Button>
          </div>
        )}
      </Modal>
    </>
  );
}
