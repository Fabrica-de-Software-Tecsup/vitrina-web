"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Icono, { type NombreIcono } from "@/components/ui/Icono";
import { EmptyState, Modal, Skeleton } from "@/components/ui/Feedback";
import PortadaEnvio from "@/components/jams/PortadaEnvio";
import CompartirEnlace from "@/components/jams/CompartirEnlace";
import { Reconocimiento } from "@/components/jams/TarjetaEnvio";
import { imagenesOrdenadas, rutaEnvio, rutaJam, type Envio, type IntegranteEnvio, type Jam } from "@/lib/api-jams";
import { cargadorDe, placeholderDe } from "@/lib/imagenes";
import { useDatoPublico } from "@/lib/usar-dato-publico";
import { obtenerUrlEmbedYoutube } from "@/lib/youtube";
import { urlSegura } from "@/lib/utils";

const SIZES_COLUMNA = "(min-width: 1120px) 1040px, 100vw";

const parrafos = (t: string | null | undefined) =>
  (t ?? "")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);

/** «LinkedIn», «GitHub» o el dominio, para el enlace de cada integrante. */
function etiquetaEnlace(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    if (host.endsWith("linkedin.com")) return "LinkedIn";
    if (host.endsWith("github.com")) return "GitHub";
    if (host.endsWith("gitlab.com")) return "GitLab";
    if (host.endsWith("behance.net")) return "Behance";
    return host;
  } catch {
    return "Perfil";
  }
}

interface Props {
  slug: string;
  envioSlug: string;
  envioInicial: Envio | null;
  jamInicial: Jam | null;
}

/** Página pública de un envío: la lámina a sangre de la columna, el nombre y la frase, los enlaces, el equipo y la descripción. */
export default function DetalleEnvio({ slug, envioSlug, envioInicial, jamInicial }: Props) {
  const pedido = useDatoPublico<Envio>(rutaEnvio(slug, envioSlug), envioInicial);
  const jam = useDatoPublico<Jam>(rutaJam(slug), jamInicial, { silencioso: true }).datos;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const envio = pedido.datos;

  const volver = (
    <Link href={`/jams/${slug}`} transitionTypes={["volver"]} className="-ml-1.5 inline-flex h-11 items-center gap-1 pr-2 text-[0.9375rem] font-medium text-ink-default hover:underline">
      <Icono nombre="chevron-izq" tam={18} />
      {jam?.nombre ?? "Volver a la jam"}
    </Link>
  );

  if (!envio) {
    return (
      <div className="mx-auto max-w-[65rem] px-4 pt-2 sm:px-8 lg:px-0">
        <div className="flex min-h-16 items-center">{volver}</div>
        {pedido.fallo ? (
          <EmptyState icono="buscar" titulo="Proyecto no encontrado" texto="Puede que el enlace haya cambiado o que la organización lo haya retirado." accion={<Button href={`/jams/${slug}`} variant="outline">Ver todos los proyectos</Button>} />
        ) : (
          <>
            <Skeleton className="aspect-[4/3] w-full rounded-lamina" />
            <Skeleton className="mt-10 h-14 w-2/3" />
          </>
        )}
      </div>
    );
  }

  const galeria = imagenesOrdenadas(envio);
  const portada = galeria[0] ?? null;
  const resto = galeria.slice(1);
  const video = obtenerUrlEmbedYoutube(envio.enlaces?.video);
  type Accion = { label: string; href: string; icono: NombreIcono; interno: boolean };
  const acciones = (
    [
      { label: "Ver demo", href: urlSegura(envio.enlaces?.demo), icono: "demo", interno: false },
      { label: "Ver video", href: video ? "#video" : urlSegura(envio.enlaces?.video), icono: "video", interno: !!video },
      { label: "Código", href: urlSegura(envio.enlaces?.repositorio), icono: "codigo", interno: false },
      { label: "Presentación", href: urlSegura(envio.enlaces?.presentacion), icono: "documento", interno: false },
    ] as { label: string; href: string | null; icono: NombreIcono; interno: boolean }[]
  ).filter((a): a is Accion => !!a.href);

  return (
    <>
      <article className="mx-auto max-w-[65rem] px-4 sm:px-8 lg:px-0">
        <div className="flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2">
          {volver}
          {envio.categoria && <span className="text-[0.9375rem] text-ink-muted">{envio.categoria}</span>}
        </div>

        <header>
          <div className="relative isolate" style={{ "--dominante": portada?.colorDominante ?? undefined } as React.CSSProperties}>
            <div className="lavado" aria-hidden />
            <PortadaEnvio envio={envio} sizes={SIZES_COLUMNA} preload alt={`Portada de ${envio.nombre}`} className="sm:rounded-cabecera" />
            {portada && (
              <button type="button" onClick={() => setLightbox(0)} className="absolute inset-0 cursor-zoom-in rounded-lamina sm:rounded-cabecera" aria-label={`Ampliar la portada de ${envio.nombre}`} />
            )}
            {envio.reconocimiento && <Reconocimiento texto={envio.reconocimiento} className="pointer-events-none absolute left-3 top-3 z-[1] h-8 px-3 text-label sm:left-4 sm:top-4" />}
          </div>

          <div className="grid gap-8 border-b border-linea pb-10 pt-8 sm:pt-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12 lg:pb-12">
            <div>
              <h1 className="titular max-w-[17ch] text-ink-default">{envio.nombre}</h1>
              {envio.frase && <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ink-muted sm:text-xl">{envio.frase}</p>}
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end lg:pb-2">
              {acciones.map((a, i) => (
                <Button key={a.label} href={a.href} externo={!a.interno} size="lg" variant={i === 0 ? "primary" : "outline"} icon={<Icono nombre={a.icono} tam={18} />}>
                  {a.label}
                </Button>
              ))}
              <CompartirEnlace titulo={envio.nombre} texto={envio.frase} />
            </div>
          </div>
        </header>

        <section aria-labelledby="equipo" className="grid gap-5 border-b border-linea py-8 md:grid-cols-[17.5rem_1fr] md:items-start">
          <div>
            <h2 id="equipo" className="seccion-t text-ink-default">
              {envio.equipoNombre}
            </h2>
            <p className="mt-1 text-body-small text-ink-muted">{envio.integrantes.length === 1 ? "Equipo de una persona" : `Equipo de ${envio.integrantes.length} personas`}</p>
          </div>
          <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {envio.integrantes.map((p: IntegranteEnvio, i) => {
              const enlace = urlSegura(p.enlace);
              return (
                <li key={`${p.nombre}-${i}`} className="min-w-0">
                  <p className="font-semibold text-ink-default">{p.nombre}</p>
                  <p className="text-body-small text-ink-muted">
                    {p.rol}
                    {p.rol && enlace && " · "}
                    {enlace && (
                      <a href={enlace} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex min-h-8 items-center gap-0.5 font-medium text-brand-primary hover:underline">
                        {etiquetaEnlace(enlace)}
                        <Icono nombre="externo" tam={14} />
                      </a>
                    )}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>

        <div className="lectura min-w-0 max-w-[40rem] py-14 lg:py-16">
          <section aria-labelledby="el-proyecto">
            <h2 id="el-proyecto" className="seccion-t mb-4 text-ink-default">
              El proyecto
            </h2>
            {parrafos(envio.descripcion).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          {resto.map((img, i) => {
            const loader = cargadorDe(img);
            const lqip = placeholderDe(img.placeholder);
            return (
              <figure key={img.id} className="my-12">
                <button type="button" onClick={() => setLightbox(i + 1)} className="block w-full cursor-zoom-in rounded-lamina" aria-label={`Ampliar imagen ${i + 2} de ${galeria.length}`}>
                  <span className="lamina" style={{ backgroundColor: img.colorDominante ?? undefined, backgroundImage: lqip ? `url(${lqip})` : undefined, "--dominante": img.colorDominante ?? undefined } as React.CSSProperties}>
                    <Image src={img.url} alt="" fill sizes="(min-width: 1024px) 640px, 100vw" loading="lazy" {...(loader ? { loader } : { unoptimized: true })} style={{ objectFit: "cover" }} />
                  </span>
                </button>
                <figcaption className="mt-3 text-body-small text-ink-muted">
                  Imagen {i + 2} de {galeria.length}
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
                  title={`Video de ${envio.nombre}`}
                  className="h-full w-full"
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </section>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 border-t border-ink-default pb-6 pt-12 text-center">
          <p className="font-display text-[1.375rem] italic text-ink-default">{jam?.nombre ?? "La jam"}</p>
          <Button href={`/jams/${slug}`} variant="outline" icon={<Icono nombre="chevron-izq" tam={18} />}>
            Ver todos los proyectos
          </Button>
        </div>
      </article>

      <Modal abierto={lightbox !== null} onCerrar={() => setLightbox(null)} titulo={envio.nombre} descripcion={lightbox !== null ? `Imagen ${lightbox + 1} de ${galeria.length}` : undefined} ancho="lg">
        {lightbox !== null && galeria[lightbox] && (
          // eslint-disable-next-line @next/next/no-img-element -- imagen a tamaño completo
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
