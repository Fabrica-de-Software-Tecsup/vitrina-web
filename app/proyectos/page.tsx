"use client";

import { Suspense, ViewTransition, startTransition, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { CardSkeleton, EmptyState, Pagination, useToast } from "@/components/ui/Feedback";
import { Select } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import ProjectCard from "@/components/proyectos/ProjectCard";
import EsperaHistorial from "@/components/proyectos/EsperaHistorial";
import { getEstadisticas, getProyectoAleatorio, listarProyectos, type FiltrosProyectos } from "@/lib/api-proyectos";
import { getCarreras, getCategorias, getTecnologias } from "@/lib/api-catalogos";
import { listaEnCache, recordarExplorar, recordarLista, recordarProyectos } from "@/lib/cache-proyectos";
import type { Carrera, Categoria, Estadisticas, Paginado, Proyecto, Tecnologia } from "@/lib/tipos";
import { cn, pluralizar } from "@/lib/utils";

const LIMIT = 24;
/** En teléfono, una lámina de cada siete ocupa las dos columnas. */
const CADA = 7;
const SIZES_NORMAL = "(min-width: 1440px) 320px, (min-width: 1024px) 30vw, 50vw";
const SIZES_DESTACADA = "(min-width: 1440px) 320px, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw";

/** Periodos académicos recientes (AAAA-1 / AAAA-2), del actual hacia atrás. */
function periodosRecientes(): string[] {
  const hoy = new Date();
  const lista: string[] = [];
  let anio = hoy.getFullYear();
  let semestre = hoy.getMonth() < 7 ? 1 : 2;
  for (let i = 0; i < 6; i++) {
    lista.push(`${anio}-${semestre}`);
    if (semestre === 2) semestre = 1;
    else {
      semestre = 2;
      anio -= 1;
    }
  }
  return lista;
}

function ExplorarContenido() {
  const router = useRouter();
  const sp = useSearchParams();
  const { avisar } = useToast();
  const filtros = useMemo<FiltrosProyectos>(
    () => ({
      buscar: sp.get("buscar") ?? undefined,
      carreraId: Number(sp.get("carreraId")) || undefined,
      categoriaId: Number(sp.get("categoriaId")) || undefined,
      tecnologiaId: Number(sp.get("tecnologiaId")) || undefined,
      periodo: sp.get("periodo") ?? undefined,
      ciclo: Number(sp.get("ciclo")) || undefined,
      orden: (sp.get("orden") as FiltrosProyectos["orden"]) ?? "recientes",
      offset: Number(sp.get("offset")) || 0,
      limit: LIMIT,
    }),
    [sp],
  );
  const clave = JSON.stringify(filtros);

  const [resultado, setResultado] = useState<{ clave: string; datos: Paginado<Proyecto> } | null>(() => {
    const enCache = listaEnCache(clave);
    return enCache ? { clave, datos: enCache } : null;
  });
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tecnologias, setTecnologias] = useState<Tecnologia[]>([]);
  const [stats, setStats] = useState<Estadisticas | null>(null);
  const [abiertos, setAbiertos] = useState(false);
  const [sorteando, setSorteando] = useState(false);
  const periodos = useMemo(() => periodosRecientes(), []);

  useEffect(() => {
    getCarreras().then(setCarreras).catch(() => null);
    getCategorias().then(setCategorias).catch(() => null);
    getTecnologias().then(setTecnologias).catch(() => null);
    getEstadisticas().then(setStats).catch(() => null);
  }, []);

  useEffect(() => {
    const qs = sp.toString();
    recordarExplorar(`/proyectos${qs ? `?${qs}` : ""}`);
  }, [sp]);

  useEffect(() => {
    let vigente = true;
    listarProyectos(filtros)
      .then((datos) => {
        if (!vigente) return;
        recordarLista(clave, datos);
        // En una transición: la retícula vieja se funde con la nueva (<ViewTransition> con key).
        startTransition(() => setResultado({ clave, datos }));
      })
      .catch(() => vigente && startTransition(() => setResultado({ clave, datos: { items: [], total: 0, limit: LIMIT, offset: 0 } })));
    return () => {
      vigente = false;
    };
  }, [filtros, clave]);

  const actualizado = resultado?.clave === clave;
  const datos = resultado?.datos ?? null;

  const urlCon = (cambios: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(cambios)) {
      if (v === undefined || v === "" || v === 0) next.delete(k);
      else next.set(k, String(v));
    }
    if (!("offset" in cambios)) next.delete("offset");
    const qs = next.toString();
    return `/proyectos${qs ? `?${qs}` : ""}`;
  };
  const setParam = (cambios: Record<string, string | number | undefined>) => router.push(urlCon(cambios), { scroll: false });

  const carreraActiva = carreras.find((c) => c.id === filtros.carreraId);
  const tecActiva = tecnologias.find((t) => t.id === filtros.tecnologiaId);
  const catActiva = categorias.find((c) => c.id === filtros.categoriaId);
  const activos = [carreraActiva?.nombre, filtros.periodo, catActiva?.nombre, tecActiva?.nombre, filtros.buscar ? `«${filtros.buscar}»` : undefined].filter(Boolean) as string[];
  const resumen = activos.length ? activos.join(" · ") : "Todas las carreras, todos los periodos";

  const sorprender = async () => {
    setSorteando(true);
    try {
      const p = await getProyectoAleatorio();
      if (p.id && p.imagenes) recordarProyectos([p as Proyecto]);
      router.push(`/proyectos/${p.slug}`, { transitionTypes: ["abrir"] });
    } catch {
      avisar("No pudimos elegir un proyecto ahora. Inténtalo otra vez.", "error");
      setSorteando(false);
    }
  };

  return (
    <Container>
      <div className="grid gap-6 pb-10 pt-12 sm:pt-16 lg:grid-cols-[1fr_24rem] lg:items-end lg:gap-20 lg:pb-12 lg:pt-20">
        <h1 className="titular max-w-[13ch] text-ink-default">Proyectos hechos por estudiantes</h1>
        <p className="text-lg leading-relaxed text-ink-muted lg:pb-2">
          Trabajo real, revisado y publicado por un docente.
          {stats && stats.proyectosPublicados > 0 && (
            <>
              {" "}
              {pluralizar(stats.proyectosPublicados, "proyecto", "proyectos")} de {pluralizar(stats.carrerasConProyectos, "carrera", "carreras")}.
            </>
          )}
        </p>
      </div>

      {/* Barra de filtros: plegada por defecto; el estado vive en la URL. */}
      <search id="buscar" className="border-y border-linea">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
          <Button
            variant="outline"
            onClick={() => setAbiertos((a) => !a)}
            icon={<Icono nombre="filtros" tam={18} />}
            aria-label={abiertos ? "Ocultar filtros" : "Mostrar filtros"}
          >
            Filtros
            {activos.length > 0 && <span className="num ml-0.5 text-ink-muted">{activos.length}</span>}
          </Button>
          <p className="hidden min-w-0 flex-1 truncate text-[0.9375rem] text-ink-muted sm:block">{resumen}</p>
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <label htmlFor="orden" className="sr-only text-[0.9375rem] text-ink-muted md:not-sr-only">
              Ordenar por
            </label>
            <Select id="orden" value={filtros.orden} onChange={(e) => setParam({ orden: e.target.value === "recientes" ? undefined : e.target.value })} className="w-auto">
              <option value="recientes">Más recientes</option>
              <option value="vistas">Más vistos</option>
              <option value="destacados">Destacados primero</option>
            </Select>
            <span className="hidden sm:block">
              <Button variant="ghost" onClick={sorprender} loading={sorteando} icon={<Icono nombre="azar" tam={18} />}>
                Sorpréndeme
              </Button>
            </span>
          </div>
        </div>

        {abiertos && (
          <form
            className="panel-filtros aparece grid gap-5 border-t border-linea py-5 sm:grid-cols-2 lg:grid-cols-4"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Filtros de proyectos"
          >
            <fieldset>
              <legend className="mb-1.5 text-label text-ink-default">Carrera</legend>
              <Select value={filtros.carreraId ?? ""} onChange={(e) => setParam({ carreraId: Number(e.target.value) || undefined })} aria-label="Carrera">
                <option value="">Todas las carreras</option>
                {Array.from(new Set(carreras.map((c) => c.area))).map((area) => (
                  <optgroup key={area} label={area}>
                    {carreras
                      .filter((c) => c.area === area)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nombre}
                          {c.proyectosPublicados ? ` (${c.proyectosPublicados})` : ""}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </Select>
            </fieldset>
            <fieldset>
              <legend className="mb-1.5 text-label text-ink-default">Periodo</legend>
              <Select value={filtros.periodo ?? ""} onChange={(e) => setParam({ periodo: e.target.value || undefined })} aria-label="Periodo">
                <option value="">Todos los periodos</option>
                {periodos.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </Select>
            </fieldset>
            <fieldset>
              <legend className="mb-1.5 text-label text-ink-default">Categoría</legend>
              <Select value={filtros.categoriaId ?? ""} onChange={(e) => setParam({ categoriaId: Number(e.target.value) || undefined })} aria-label="Categoría">
                <option value="">Todas las categorías</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </Select>
            </fieldset>
            <fieldset>
              <legend className="mb-1.5 text-label text-ink-default">Tecnología</legend>
              <Select value={filtros.tecnologiaId ?? ""} onChange={(e) => setParam({ tecnologiaId: Number(e.target.value) || undefined })} aria-label="Tecnología">
                <option value="">Cualquier tecnología</option>
                {tecnologias.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre}
                  </option>
                ))}
              </Select>
            </fieldset>
            {activos.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-4">
                <Button variant="ghost" size="sm" href="/proyectos" className="-ml-3">
                  Quitar filtros
                </Button>
              </div>
            )}
          </form>
        )}
      </search>

      <div className="flex items-center justify-between gap-4 pt-6 sm:hidden">
        <p className="min-w-0 truncate text-body-small text-ink-muted">{resumen}</p>
        <Button variant="ghost" size="sm" onClick={sorprender} loading={sorteando} icon={<Icono nombre="azar" tam={18} />}>
          Sorpréndeme
        </Button>
      </div>

      <h2 className="sr-only" id="resultados">
        Resultados
      </h2>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {actualizado && datos ? pluralizar(datos.total, "proyecto", "proyectos") : ""}
      </p>

      <div className="mt-8 sm:mt-12" aria-busy={!actualizado}>
        {datos === null ? (
          <div className="reticula">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} className={i % CADA === 0 ? "destacada" : undefined} />
            ))}
          </div>
        ) : (
          <ViewTransition key={resultado?.clave} enter="resultados" exit="resultados" default="none">
            <div className={cn("transition-opacity duration-200", !actualizado && "opacity-60")}>
              {datos.items.length === 0 ? (
                <EmptyState
                  icono="buscar"
                  titulo="Ningún proyecto coincide"
                  texto="Prueba con otra palabra o quita algún filtro."
                  accion={
                    <Button variant="outline" href="/proyectos">
                      Ver todos los proyectos
                    </Button>
                  }
                />
              ) : (
                <>
                  <div className="reticula">
                    {datos.items.map((p, i) => (
                      <ProjectCard
                        key={p.id}
                        proyecto={p}
                        preload={i < 2}
                        className={i % CADA === 0 ? "destacada" : undefined}
                        sizes={i % CADA === 0 ? SIZES_DESTACADA : SIZES_NORMAL}
                      />
                    ))}
                  </div>
                  <div className="mt-16">
                    <Pagination total={datos.total} limit={LIMIT} offset={filtros.offset ?? 0} hrefDe={(offset) => urlCon({ offset })} />
                  </div>
                </>
              )}
            </div>
          </ViewTransition>
        )}
      </div>
    </Container>
  );
}

export default function ExplorarPage() {
  // EsperaHistorial va fuera del Suspense: si suspendiera dentro de un límite recién montado, React mostraría el fallback.
  return (
    <>
      <EsperaHistorial />
      <Suspense
        fallback={
          <Container className="pt-20">
            <div className="reticula">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </Container>
        }
      >
        <ExplorarContenido />
      </Suspense>
    </>
  );
}
