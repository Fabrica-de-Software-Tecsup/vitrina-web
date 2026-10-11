"use client";

import { ViewTransition, useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { CardSkeleton, EmptyState, Pagination, useToast } from "@/components/ui/Feedback";
import { Select } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import ProjectCard from "@/components/proyectos/ProjectCard";
import { LIMITE_EXPLORAR, RUTA_ESTADISTICAS, filtrosDeUrl, getProyectoAleatorio, rutaProyectos, soloPublicados } from "@/lib/api-proyectos";
import { RUTA_CARRERAS, RUTA_CATEGORIAS, RUTA_TECNOLOGIAS } from "@/lib/api-catalogos";
import type { DatoInicial } from "@/lib/api-servidor";
import { recordarExplorar, recordarProyectos } from "@/lib/cache-swr";
import { useDatoPublico } from "@/lib/usar-dato-publico";
import type { Carrera, Categoria, Estadisticas, Paginado, Proyecto, Tecnologia } from "@/lib/tipos";
import { cn, pluralizar } from "@/lib/utils";

const LIMIT = LIMITE_EXPLORAR;
const SIN_CARRERAS: Carrera[] = [];
const SIN_CATEGORIAS: Categoria[] = [];
const SIN_TECNOLOGIAS: Tecnologia[] = [];

/** Lo que el servidor ya resolvió (caché de 5 minutos). Cada pieza es null si el API no respondió a tiempo. */
export interface InicialExplorar {
  lista: DatoInicial<Paginado<Proyecto>> | null;
  carreras: Carrera[] | null;
  categorias: Categoria[] | null;
  tecnologias: Tecnologia[] | null;
  estadisticas: Estadisticas | null;
}
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

/**
 * Explorar. Pinta de inmediato con lo que trae el HTML (`inicial`), o con la caché del navegador si el servidor
 * no llegó, y revalida por detrás. El estado de los filtros vive en la URL.
 */
export default function ExplorarCliente({ inicial }: { inicial: InicialExplorar }) {
  const router = useRouter();
  const sp = useSearchParams();
  const { avisar } = useToast();
  const filtros = useMemo(() => filtrosDeUrl((clave) => sp.get(clave)), [sp]);
  const ruta = rutaProyectos(filtros);

  const lista = useDatoPublico<Paginado<Proyecto>>(ruta, inicial.lista?.ruta === ruta ? inicial.lista.datos : null, { persistir: soloPublicados });
  const carreras = useDatoPublico<Carrera[]>(RUTA_CARRERAS, inicial.carreras, { silencioso: true }).datos ?? SIN_CARRERAS;
  const categorias = useDatoPublico<Categoria[]>(RUTA_CATEGORIAS, inicial.categorias, { silencioso: true }).datos ?? SIN_CATEGORIAS;
  const tecnologias = useDatoPublico<Tecnologia[]>(RUTA_TECNOLOGIAS, inicial.tecnologias, { silencioso: true }).datos ?? SIN_TECNOLOGIAS;
  const stats = useDatoPublico<Estadisticas>(RUTA_ESTADISTICAS, inicial.estadisticas, { silencioso: true }).datos;
  const [abiertos, setAbiertos] = useState(false);
  const [sorteando, setSorteando] = useState(false);
  // Cambiar un filtro navega (el servidor resuelve la consulta nueva); mientras tanto la retícula se atenúa.
  const [navegando, navegar] = useTransition();
  const periodos = useMemo(() => periodosRecientes(), []);

  useEffect(() => {
    const qs = sp.toString();
    recordarExplorar(`/proyectos${qs ? `?${qs}` : ""}`);
  }, [sp]);

  const actualizado = lista.actualizado && !navegando;
  const datos = lista.datos;

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
  const setParam = (cambios: Record<string, string | number | undefined>) => navegar(() => router.push(urlCon(cambios), { scroll: false }));

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
        {lista.fallo ? (
          <EmptyState
            icono="buscar"
            titulo="No pudimos cargar los proyectos"
            texto="El servidor no respondió. Suele bastar con intentarlo otra vez en un momento."
            accion={
              <Button variant="outline" onClick={lista.reintentar}>
                Reintentar
              </Button>
            }
          />
        ) : datos === null ? (
          <div className="reticula">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} className={i % CADA === 0 ? "destacada" : undefined} />
            ))}
          </div>
        ) : (
          <ViewTransition key={lista.rutaDeDatos} enter="resultados" exit="resultados" default="none">
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
