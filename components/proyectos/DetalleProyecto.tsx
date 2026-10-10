"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Icono, { type NombreIcono } from "@/components/ui/Icono";
import { EstadoBadge } from "@/components/ui/Badge";
import { EmptyState, Modal, Skeleton, useToast } from "@/components/ui/Feedback";
import Portada from "@/components/proyectos/Portada";
import ProjectCard from "@/components/proyectos/ProjectCard";
import Compartir from "@/components/proyectos/Compartir";
import EsperaHistorial from "@/components/proyectos/EsperaHistorial";
import { useSesion } from "@/components/sesion/SesionProvider";
import { getProyectoPorSlug, getRelacionados, getVersion, getVersiones, incrementarVistas } from "@/lib/api-proyectos";
import { proyectoEnCache, recordarProyectos, urlExplorar } from "@/lib/cache-proyectos";
import { cargadorDe, placeholderDe } from "@/lib/imagenes";
import { CORREO_CONTACTO } from "@/lib/contacto";
import { obtenerUrlEmbedYoutube } from "@/lib/youtube";
import { fechaCorta, slugConId, urlSegura } from "@/lib/utils";
import { imagenPortada, type Proyecto, type VersionCompleta, type VersionResumen } from "@/lib/tipos";

const CASO: { campo: "comoLoConstruyeron" | "retosSuperados" | "leccionAprendida" | "queHarianDiferente"; titulo: string }[] = [
  { campo: "comoLoConstruyeron", titulo: "Cómo lo construyeron" },
  { campo: "retosSuperados", titulo: "Retos superados" },
  { campo: "leccionAprendida", titulo: "Lo que aprendieron" },
  { campo: "queHarianDiferente", titulo: "Qué harían diferente" },
];

/** Párrafos de un texto largo: separa por línea en blanco y une los saltos simples del copiado. */
function parrafos(texto: string | null | undefined): string[] {
  if (!texto) return [];
  return texto
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

const SIZES_COLUMNA = "(min-width: 1120px) 1040px, 100vw";

interface Props {
  slug: string;
  /** Proyecto ya resuelto en el servidor (solo publicados); null si hay que pedirlo con la sesión. */
  inicial: Proyecto | null;
}

/**
 * Detalle del proyecto en tres capas: la lámina a sangre de la columna con el título como pie,
 * autor y equipo, y el caso de estudio como columna de lectura; los créditos cierran como colofón.
 * La cabecera se pinta en el mismo commit de la navegación (datos del servidor o de la caché del navegador)
 * para que la lámina de Explorar se transforme en esta portada.
 */
export default function DetalleProyecto({ slug, inicial }: Props) {
  const { usuario, esDocente } = useSesion();
  const { avisar } = useToast();
  const [proyecto, setProyecto] = useState<Proyecto | null | undefined>(() => inicial ?? proyectoEnCache(slug));
  const [relacionados, setRelacionados] = useState<Proyecto[]>([]);
  const [versiones, setVersiones] = useState<VersionResumen[]>([]);
  const [versionAbierta, setVersionAbierta] = useState<VersionCompleta | null>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  // En una carga directa vale "/proyectos" en servidor y cliente; tras navegar, la última retícula de Explorar.
  const [volver] = useState(urlExplorar);

  useEffect(() => {
    let vigente = true;
    getProyectoPorSlug(slug)
      .then((p) => {
        if (!vigente) return;
        setProyecto(p);
        recordarProyectos([p]);
        getRelacionados(p.id)
          .then((r) => {
            recordarProyectos(r);
            if (vigente) setRelacionados(r);
          })
          .catch(() => null);
        if (p.versionActual > 0) getVersiones(p.id).then((v) => vigente && setVersiones(v)).catch(() => null);
        const clave = `vista-${p.id}`;
        if (p.estado === "PUBLICADO" && !sessionStorage.getItem(clave)) {
          sessionStorage.setItem(clave, "1");
          incrementarVistas(p.id).catch(() => null);
        }
      })
      .catch(() => vigente && setProyecto((actual) => actual ?? null));
    return () => {
      vigente = false;
    };
  }, [slug]);

  if (proyecto === undefined) {
    return (
      <div className="mx-auto max-w-[65rem] px-4 pt-6 sm:px-8">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-6 aspect-[4/3] w-full rounded-none" />
        <Skeleton className="mt-10 h-14 w-2/3" />
        <Skeleton className="mt-4 h-5 w-1/2" />
      </div>
    );
  }
  if (proyecto === null) {
    return (
      <div className="mx-auto max-w-[65rem] px-4 py-20 sm:px-8">
        <EmptyState
          icono="buscar"
          titulo="Proyecto no encontrado"
          texto="Puede que aún no esté publicado o que el enlace haya cambiado."
          accion={
            <Button href="/proyectos" variant="outline">
              Explorar proyectos
            </Button>
          }
        />
      </div>
    );
  }

  const portada = imagenPortada(proyecto);
  const resto = proyecto.imagenes.filter((i) => i.id !== portada?.id);
  const galeria = portada ? [portada, ...resto] : resto;
  const video = obtenerUrlEmbedYoutube(proyecto.youtubeUrl);
  type Accion = { label: string; href: string; icono: NombreIcono; interno: boolean };
  const acciones = (
    [
      { label: "Ver demo", href: urlSegura(proyecto.demoUrl), icono: "demo", interno: false },
      { label: "Ver video", href: video ? "#video" : urlSegura(proyecto.youtubeUrl), icono: "video", interno: !!video },
      { label: "Código", href: urlSegura(proyecto.githubUrl), icono: "codigo", interno: false },
      { label: "Diseño", href: urlSegura(proyecto.figmaUrl), icono: "diseno", interno: false },
      { label: "Descargar build", href: urlSegura(proyecto.buildUrl), icono: "paquete", interno: false },
    ] as { label: string; href: string | null; icono: NombreIcono; interno: boolean }[]
  ).filter((a): a is Accion => !!a.href);
  const puedeEditar = !!usuario && (esDocente || proyecto.creadorId === usuario.id || proyecto.miembros.some((m) => m.usuarioId === usuario.id));
  const revisar = esDocente && proyecto.estado === "POR_REVISAR";
  const caso = CASO.filter((s) => proyecto[s.campo]);
  const descripcion = parrafos(proyecto.descripcion);
  const dominante = portada?.colorDominante ?? undefined;
  const lider = proyecto.miembros.find((m) => m.esLider) ?? proyecto.miembros[0];

  const creditos: { dt: string; dd: string }[] = [
    proyecto.docentes.length ? { dt: proyecto.docentes.length === 1 ? "Docente asesor" : "Docentes asesores", dd: proyecto.docentes.map((d) => d.usuario.nombre).join(", ") } : null,
    proyecto.miembros.length ? { dt: "Equipo", dd: proyecto.miembros.map((m) => (m.rol ? `${m.usuario.nombre} (${m.rol.toLowerCase()})` : m.usuario.nombre)).join(", ") } : null,
    proyecto.carrera ? { dt: "Carrera", dd: proyecto.carrera.nombre } : null,
    proyecto.ciclo || proyecto.periodo ? { dt: "Ciclo y periodo", dd: [proyecto.ciclo ? `${proyecto.ciclo}.º ciclo` : null, proyecto.periodo].filter(Boolean).join(", ") } : null,
    proyecto.cursos?.length ? { dt: proyecto.cursos.length === 1 ? "Curso" : "Cursos", dd: proyecto.cursos.map((c) => c.curso.nombre).join(", ") } : null,
    proyecto.categorias.length ? { dt: proyecto.categorias.length === 1 ? "Categoría" : "Categorías", dd: proyecto.categorias.map((c) => c.categoria.nombre).join(", ") } : null,
    proyecto.publicadoEn
      ? { dt: proyecto.versionActual > 1 ? "Versión" : "Publicado", dd: proyecto.versionActual > 1 ? `${proyecto.versionActual}, publicada el ${fechaCorta(proyecto.publicadoEn)}` : `el ${fechaCorta(proyecto.publicadoEn)}` }
      : null,
  ].filter((c): c is { dt: string; dd: string } => !!c);

  const asunto = encodeURIComponent(`Reporte del proyecto «${proyecto.nombre}»`);
  const cuerpo = (enlace: string) => encodeURIComponent(`Proyecto: ${proyecto.nombre}\nEnlace: ${enlace}\n\nQué ocurre:\n`);

  return (
    <>
      <EsperaHistorial />
      <article className="mx-auto max-w-[65rem] px-4 sm:px-8 lg:px-0">
        {/* Barra: volver y contexto */}
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2">
          <Link href={volver} transitionTypes={["volver"]} className="-ml-1.5 inline-flex h-11 items-center gap-1 pr-2 text-[0.9375rem] font-medium text-ink-default hover:underline">
            <Icono nombre="chevron-izq" tam={18} />
            Explorar
          </Link>
          <div className="flex items-center gap-3">
            {proyecto.estado !== "PUBLICADO" && <EstadoBadge estado={proyecto.estado} />}
            {puedeEditar && (
              <Button href={revisar ? `/dashboard/revision/${proyecto.id}` : `/dashboard/proyectos/${proyecto.id}`} size="sm" variant="outline" icon={<Icono nombre="editar" tam={16} />}>
                {revisar ? "Revisar" : "Editar"}
              </Button>
            )}
            {proyecto.carrera && (
              <Link href={`/proyectos?carreraId=${proyecto.carrera.id}`} className="hidden text-[0.9375rem] text-ink-muted hover:text-ink-default hover:underline sm:inline">
                {proyecto.carrera.nombre}
              </Link>
            )}
          </div>
        </div>

        {/* Capa 1: la lámina a sangre de la columna y el título como pie */}
        <header>
          <div className="relative isolate" style={{ "--dominante": dominante } as React.CSSProperties}>
            <div className="lavado" aria-hidden />
            <Portada id={proyecto.id} nombre={proyecto.nombre} imagen={portada} sizes={SIZES_COLUMNA} preload alt={`Portada de ${proyecto.nombre}`} className="sm:rounded-cabecera" />
            {galeria.length > 0 && (
              <button
                type="button"
                onClick={() => setLightbox(0)}
                className="absolute inset-0 cursor-zoom-in rounded-lamina sm:rounded-cabecera"
                aria-label={`Ampliar la portada de ${proyecto.nombre}`}
              />
            )}
          </div>

          <div className="grid gap-8 border-b border-linea pb-10 pt-8 sm:pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:pb-12">
            <div>
              <h1 className="titular max-w-[17ch] text-ink-default">{proyecto.nombre}</h1>
              {proyecto.tagline && <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ink-muted sm:text-xl">{proyecto.tagline}</p>}
              {proyecto.enNuevaVersion && (
                <p className="mt-5 flex items-start gap-2 text-body-small text-ink-muted">
                  <Icono nombre="reloj" tam={18} className="mt-px" />
                  El equipo prepara una nueva versión; ves la última publicada.
                </p>
              )}
              {!proyecto.enNuevaVersion && proyecto.estado !== "PUBLICADO" && proyecto.versionActual > 0 && (
                <p className="mt-5 flex items-start gap-2 text-body-small text-ink-muted">
                  <Icono nombre="info" tam={18} className="mt-px" />
                  Ves el borrador de la próxima versión. El público sigue viendo la versión {proyecto.versionActual}.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end lg:pb-2">
              {acciones.map((a, i) =>
                a.interno ? (
                  <Button key={a.label} href={a.href} size="lg" variant={i === 0 ? "primary" : "outline"} icon={<Icono nombre={a.icono} tam={18} />}>
                    {a.label}
                  </Button>
                ) : (
                  <Button key={a.label} href={a.href} externo size="lg" variant={i === 0 ? "primary" : "outline"} icon={<Icono nombre={a.icono} tam={18} />}>
                    {a.label}
                  </Button>
                ),
              )}
              <Compartir proyecto={proyecto} />
            </div>
          </div>
        </header>

        {/* Capa 2: autor y equipo */}
        {proyecto.miembros.length > 0 && (
          <section aria-labelledby="equipo" className="grid gap-5 border-b border-linea py-8 md:grid-cols-[17.5rem_1fr] md:items-center">
            <h2 id="equipo" className="seccion-t text-ink-default">
              {proyecto.miembros.length === 1 ? "Autor" : "Autor y equipo"}
            </h2>
            <ul className="flex flex-wrap gap-x-12 gap-y-5">
              {[lider, ...proyecto.miembros.filter((m) => m !== lider)].map((m) => (
                <li key={m.usuarioId}>
                  <Link href={`/perfiles/${slugConId(m.usuario.nombre, m.usuarioId)}`} className="group flex items-center gap-4">
                    <Avatar name={m.usuario.nombre} src={m.usuario.fotoUrl} size="lg" />
                    <span>
                      <span className="block font-semibold text-ink-default group-hover:underline">{m.usuario.nombre}</span>
                      <span className="block text-body-small text-ink-muted">{m.rol || (m.esLider ? "Líder del equipo" : "Equipo")}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Capa 3: el caso de estudio como columna de lectura */}
        <div className="grid gap-14 py-14 lg:grid-cols-[40rem_1fr] lg:gap-24 lg:py-16">
          <div className="lectura min-w-0">
            {descripcion.length > 0 && (
              <section aria-labelledby="el-proyecto">
                <h2 id="el-proyecto" className="seccion-t mb-4 text-ink-default">
                  El proyecto
                </h2>
                {descripcion.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            )}

            {resto.map((img, i) => {
              const loader = cargadorDe(img);
              const lqip = placeholderDe(img.placeholder);
              return (
                <figure key={img.id} className="my-12">
                  <button type="button" onClick={() => setLightbox(i + (portada ? 1 : 0))} className="block w-full cursor-zoom-in rounded-lamina" aria-label={`Ampliar imagen ${i + 2} de ${galeria.length}`}>
                    <span
                      className="lamina"
                      style={{ backgroundColor: img.colorDominante ?? undefined, backgroundImage: lqip ? `url(${lqip})` : undefined, "--dominante": img.colorDominante ?? undefined } as React.CSSProperties}
                    >
                      <Image src={img.url} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" loading="lazy" {...(loader ? { loader } : { unoptimized: true })} style={{ objectFit: "cover" }} />
                    </span>
                  </button>
                  <figcaption className="mt-3 text-body-small text-ink-muted">
                    Imagen {i + (portada ? 2 : 1)} de {galeria.length}
                  </figcaption>
                </figure>
              );
            })}

            {video && (
              <section id="video" aria-labelledby="titulo-video" className="my-12 scroll-mt-24">
                <h2 id="titulo-video" className="seccion-t mb-4 text-ink-default">
                  Video
                </h2>
                <div className="aspect-video overflow-hidden rounded-lamina bg-surface-sunken">
                  <iframe
                    src={video}
                    title={`Video de ${proyecto.nombre}`}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {caso.map((s) => (
              <section key={s.campo} aria-labelledby={s.campo} className="mt-14 first:mt-0">
                <h2 id={s.campo} className="seccion-t mb-4 text-ink-default">
                  {s.titulo}
                </h2>
                {parrafos(proyecto[s.campo]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </section>
            ))}

            {versiones.length > 0 && (
              <section aria-labelledby="versiones" className="mt-16">
                <h2 id="versiones" className="seccion-t mb-2 text-ink-default">
                  Versiones
                </h2>
                <p className="text-base text-ink-muted">Cada publicación queda guardada: así se ve cómo creció el proyecto.</p>
                <ol className="mt-6 border-t border-linea">
                  {versiones.map((v) => (
                    <li key={v.id} className="flex flex-col gap-3 border-b border-linea py-5 sm:flex-row sm:items-start sm:gap-6">
                      <span className="num w-24 shrink-0 font-display text-title font-medium text-ink-default">v{v.numero}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-base font-semibold text-ink-default">{v.tagline ?? v.nombre}</p>
                        <p className="mt-1 text-body-small text-ink-muted">
                          {[v.periodo, v.ciclo ? `${v.ciclo}.º ciclo` : null, `publicada el ${fechaCorta(v.publicadoEn)}`].filter(Boolean).join(" · ")}
                        </p>
                        {v.resumenCambios ? (
                          <p className="mt-2 text-base text-ink-default">{v.resumenCambios}</p>
                        ) : v.numero === 1 ? (
                          <p className="mt-2 text-base text-ink-muted">Primera publicación.</p>
                        ) : null}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          getVersion(proyecto.id, v.numero)
                            .then(setVersionAbierta)
                            .catch(() => avisar("No se pudo abrir la versión", "error"))
                        }
                      >
                        Ver versión
                      </Button>
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          <aside className="space-y-12 lg:pt-1">
            {proyecto.tecnologias.length > 0 && (
              <section aria-labelledby="tecnologias">
                <h2 id="tecnologias" className="font-display text-title font-medium text-ink-default">
                  Tecnologías
                </h2>
                <ul className="mt-3 border-t border-linea">
                  {proyecto.tecnologias.map((t) => (
                    <li key={t.tecnologia.id} className="border-b border-linea">
                      <Link href={`/proyectos?tecnologiaId=${t.tecnologia.id}`} className="flex min-h-11 items-center py-2 text-ink-default hover:underline">
                        {t.tecnologia.nombre}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {acciones.length > 0 && (
              <section aria-labelledby="enlaces">
                <h2 id="enlaces" className="font-display text-title font-medium text-ink-default">
                  Enlaces
                </h2>
                <ul className="mt-3 border-t border-linea">
                  {acciones.map((a) => (
                    <li key={a.label} className="border-b border-linea">
                      <a
                        href={a.href}
                        {...(a.interno ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                        className="flex min-h-11 items-center justify-between gap-3 py-2 font-medium text-brand-primary hover:underline"
                      >
                        {a.label}
                        <Icono nombre={a.interno ? "chevron-abajo" : "externo"} tam={18} />
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </article>

      {relacionados.length > 0 && (
        <section aria-labelledby="relacionados" className="mx-auto max-w-[90rem] border-t border-linea px-4 pt-14 sm:px-8 xl:px-20">
          <h2 id="relacionados" className="seccion-t text-ink-default">
            Proyectos relacionados
          </h2>
          <div className="reticula mt-8">
            {relacionados.slice(0, 4).map((p) => (
              <ProjectCard key={p.id} proyecto={p} />
            ))}
          </div>
        </section>
      )}

      {/* Colofón: los créditos académicos cierran la página */}
      <section aria-labelledby="creditos" className="mx-auto mt-20 max-w-[65rem] px-4 sm:px-8 lg:px-0">
        <div className="border-t border-ink-default pb-6 pt-14 text-center">
          <h2 id="creditos" className="font-display text-[1.75rem] font-normal italic text-ink-default">
            Créditos
          </h2>
          <dl className="mx-auto mt-10 grid max-w-[57.5rem] gap-x-12 gap-y-8 sm:grid-cols-2 md:grid-cols-3">
            {creditos.map((c) => (
              <div key={c.dt}>
                <dt className="text-body-small text-ink-muted">{c.dt}</dt>
                <dd className="mt-1 font-display text-[1.1875rem] leading-snug text-ink-default">{c.dd}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-14">
            <a
              href={`mailto:${CORREO_CONTACTO}?subject=${asunto}&body=${cuerpo(`/proyectos/${proyecto.slug}`)}`}
              onClick={(e) => {
                e.currentTarget.href = `mailto:${CORREO_CONTACTO}?subject=${asunto}&body=${cuerpo(window.location.href)}`;
              }}
              className="inline-flex min-h-11 items-center gap-2 text-body-small text-ink-muted hover:text-ink-default hover:underline"
            >
              <Icono nombre="bandera" tam={16} />
              Reportar este proyecto
            </a>
          </p>
        </div>
      </section>

      <Modal
        abierto={!!versionAbierta}
        onCerrar={() => setVersionAbierta(null)}
        titulo={versionAbierta ? `Versión ${versionAbierta.numero} · ${versionAbierta.nombre}` : ""}
        descripcion={
          versionAbierta
            ? [versionAbierta.periodo, versionAbierta.ciclo ? `${versionAbierta.ciclo}.º ciclo` : null, `publicada el ${fechaCorta(versionAbierta.publicadoEn)}`].filter(Boolean).join(" · ")
            : undefined
        }
        ancho="lg"
      >
        {versionAbierta && (
          <div className="lectura max-h-[70vh] space-y-5 overflow-y-auto pr-1">
            {versionAbierta.imagenes.length > 0 && (
              <div className="carril flex gap-3 overflow-x-auto">
                {versionAbierta.imagenes.map((u) => (
                  // eslint-disable-next-line @next/next/no-img-element -- versiones antiguas, sin variantes
                  <img key={u} src={u} alt="" className="aspect-[4/3] h-40 shrink-0 rounded-lamina object-cover" />
                ))}
              </div>
            )}
            {versionAbierta.tagline && <p className="font-semibold">{versionAbierta.tagline}</p>}
            {versionAbierta.resumenCambios && (
              <p>
                <span className="font-semibold">Qué cambió:</span> {versionAbierta.resumenCambios}
              </p>
            )}
            {parrafos(versionAbierta.descripcion).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {CASO.filter((s) => versionAbierta[s.campo]).map((s) => (
              <div key={s.campo}>
                <h3 className="font-display text-title font-medium">{s.titulo}</h3>
                {parrafos(versionAbierta[s.campo]).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ))}
            <p className="text-body-small text-ink-muted">
              Equipo: {versionAbierta.miembros.map((m) => `${m.nombre} (${m.rol})`).join(", ") || "sin registrar"}
              {versionAbierta.docentes.length ? ` · Docentes: ${versionAbierta.docentes.join(", ")}` : ""}
              {versionAbierta.tecnologias.length ? ` · Tecnologías: ${versionAbierta.tecnologias.join(", ")}` : ""}
            </p>
          </div>
        )}
      </Modal>

      <Modal abierto={lightbox !== null} onCerrar={() => setLightbox(null)} titulo={proyecto.nombre} descripcion={lightbox !== null ? `Imagen ${lightbox + 1} de ${galeria.length}` : undefined} ancho="lg">
        {lightbox !== null && galeria[lightbox] && (
          // eslint-disable-next-line @next/next/no-img-element -- original a tamaño completo
          <img src={galeria[lightbox].variantes?.l?.webp ?? galeria[lightbox].url} alt="" className="max-h-[70vh] w-full rounded-lg bg-surface-sunken object-contain" />
        )}
        {galeria.length > 1 && lightbox !== null && (
          <div className="mt-4 flex justify-between">
            <Button size="sm" variant="ghost" onClick={() => setLightbox((i) => ((i ?? 0) - 1 + galeria.length) % galeria.length)} icon={<Icono nombre="chevron-izq" tam={18} />}>
              Anterior
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setLightbox((i) => ((i ?? 0) + 1) % galeria.length)}>
              Siguiente
              <Icono nombre="chevron-der" tam={18} />
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
