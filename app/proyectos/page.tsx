"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Badge";
import { CardSkeleton, EmptyState, Pagination } from "@/components/ui/Feedback";
import { Input, Select } from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import ProjectCard from "@/components/proyectos/ProjectCard";
import { listarProyectos, type FiltrosProyectos } from "@/lib/api-proyectos";
import { getCarreras, getCategorias, getTecnologias } from "@/lib/api-catalogos";
import type { Carrera, Categoria, Paginado, Proyecto, Tecnologia } from "@/lib/tipos";

const LIMIT = 24;

function ExplorarContenido() {
  const router = useRouter();
  const sp = useSearchParams();
  const filtros = useMemo<FiltrosProyectos>(
    () => ({
      buscar: sp.get("buscar") ?? undefined,
      carreraId: Number(sp.get("carreraId")) || undefined,
      categoriaId: Number(sp.get("categoriaId")) || undefined,
      tecnologiaId: Number(sp.get("tecnologiaId")) || undefined,
      ciclo: Number(sp.get("ciclo")) || undefined,
      orden: (sp.get("orden") as FiltrosProyectos["orden"]) ?? "recientes",
      offset: Number(sp.get("offset")) || 0,
      limit: LIMIT,
    }),
    [sp],
  );

  const [resultado, setResultado] = useState<{ clave: string; datos: Paginado<Proyecto> } | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [tecnologias, setTecnologias] = useState<Tecnologia[]>([]);
  const [texto, setTexto] = useState(filtros.buscar ?? "");

  useEffect(() => {
    getCarreras().then(setCarreras).catch(() => null);
    getCategorias().then(setCategorias).catch(() => null);
    getTecnologias().then(setTecnologias).catch(() => null);
  }, []);

  const clave = JSON.stringify(filtros);
  useEffect(() => {
    let vigente = true;
    listarProyectos(filtros)
      .then((datos) => vigente && setResultado({ clave, datos }))
      .catch(() => vigente && setResultado({ clave, datos: { items: [], total: 0, limit: LIMIT, offset: 0 } }));
    return () => {
      vigente = false;
    };
  }, [filtros, clave]);
  const datos = resultado?.clave === clave ? resultado.datos : null;

  const setParam = (cambios: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(cambios)) {
      if (v === undefined || v === "" || v === 0) next.delete(k);
      else next.set(k, String(v));
    }
    if (!("offset" in cambios)) next.delete("offset");
    router.push(`/proyectos?${next.toString()}`);
  };

  const hayFiltros = !!(filtros.buscar || filtros.carreraId || filtros.categoriaId || filtros.tecnologiaId || filtros.ciclo);
  const carreraActiva = carreras.find((c) => c.id === filtros.carreraId);
  const tecActiva = tecnologias.find((t) => t.id === filtros.tecnologiaId);

  return (
    <Container className="py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Explorar</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">
            {carreraActiva ? carreraActiva.nombre : tecActiva ? `Proyectos con ${tecActiva.nombre}` : "Todos los proyectos"}
          </h1>
          {datos && <p className="mt-1 text-sm text-ink-500">{datos.total} {datos.total === 1 ? "proyecto publicado" : "proyectos publicados"}</p>}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setParam({ buscar: texto.trim() });
          }}
        >
          <Input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar…" className="sm:w-64" aria-label="Buscar proyectos" />
          <Button type="submit" variant="secondary">Buscar</Button>
        </form>
      </div>

      {/* Categorias como chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        <Chip size="md" active={!filtros.categoriaId} onClick={() => setParam({ categoriaId: undefined })}>Todas</Chip>
        {categorias.map((c) => (
          <Chip key={c.id} size="md" color={filtros.categoriaId === c.id ? undefined : c.color} active={filtros.categoriaId === c.id} onClick={() => setParam({ categoriaId: filtros.categoriaId === c.id ? undefined : c.id })}>
            {c.nombre}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Select value={filtros.carreraId ?? ""} onChange={(e) => setParam({ carreraId: Number(e.target.value) || undefined })} aria-label="Carrera">
          <option value="">Todas las carreras</option>
          {Array.from(new Set(carreras.map((c) => c.area))).map((area) => (
            <optgroup key={area} label={area}>
              {carreras.filter((c) => c.area === area).map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}{c.proyectosPublicados ? ` (${c.proyectosPublicados})` : ""}</option>
              ))}
            </optgroup>
          ))}
        </Select>
        <Select value={filtros.tecnologiaId ?? ""} onChange={(e) => setParam({ tecnologiaId: Number(e.target.value) || undefined })} aria-label="Tecnología">
          <option value="">Cualquier tecnología</option>
          {tecnologias.map((t) => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </Select>
        <Select value={filtros.ciclo ?? ""} onChange={(e) => setParam({ ciclo: Number(e.target.value) || undefined })} aria-label="Ciclo">
          <option value="">Cualquier ciclo</option>
          {[1, 2, 3, 4, 5, 6].map((c) => <option key={c} value={c}>Ciclo {c}</option>)}
        </Select>
        <Select value={filtros.orden} onChange={(e) => setParam({ orden: e.target.value })} aria-label="Orden">
          <option value="recientes">Más recientes</option>
          <option value="vistas">Más vistos</option>
          <option value="destacados">Destacados primero</option>
        </Select>
      </div>

      {hayFiltros && (
        <button type="button" onClick={() => router.push("/proyectos")} className="mt-3 text-sm font-medium text-brand-700 hover:underline">
          Limpiar filtros
        </button>
      )}

      <div className="mt-8">
        {datos === null ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}</div>
        ) : datos.items.length === 0 ? (
          <EmptyState titulo="Sin resultados" texto="Prueba con otra palabra o quita algún filtro." accion={<Button variant="outline" onClick={() => router.push("/proyectos")}>Ver todos</Button>} />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{datos.items.map((p) => <ProjectCard key={p.id} proyecto={p} />)}</div>
            <div className="mt-10">
              <Pagination total={datos.total} limit={LIMIT} offset={filtros.offset ?? 0} onChange={(offset) => setParam({ offset })} />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}

export default function ExplorarPage() {
  return (
    <Suspense fallback={<Container className="py-10"><div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}</div></Container>}>
      <ExplorarContenido />
    </Suspense>
  );
}
