"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import { Chip } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Section";
import { Input, Select } from "@/components/ui/Field";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import { getDirectorio } from "@/lib/api-usuarios";
import { getCarreras } from "@/lib/api-catalogos";
import { slugConId } from "@/lib/utils";
import { SEDES, type Carrera, type PerfilDirectorio } from "@/lib/tipos";

export default function EstudiantesPage() {
  const [datos, setDatos] = useState<{ clave: string; items: PerfilDirectorio[] } | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [q, setQ] = useState("");
  const [carreraId, setCarreraId] = useState<number | "">("");
  const [sede, setSede] = useState("");
  const [soloConProyectos, setSoloConProyectos] = useState(true);

  useEffect(() => {
    getCarreras().then(setCarreras).catch(() => null);
  }, []);
  const clave = `${carreraId}|${sede}`;
  useEffect(() => {
    let vigente = true;
    getDirectorio({ rol: "ALUMNO", carreraId: carreraId || undefined, sede: sede || undefined })
      .then((items) => vigente && setDatos({ clave, items }))
      .catch(() => vigente && setDatos({ clave, items: [] }));
    return () => {
      vigente = false;
    };
  }, [carreraId, sede, clave]);
  const lista = datos?.clave === clave ? datos.items : null;

  const filtrados = useMemo(() => {
    if (!lista) return null;
    const texto = q.trim().toLowerCase();
    return lista
      .filter((e) => !soloConProyectos || e.projectCount > 0)
      .filter((e) => !texto || e.nombre.toLowerCase().includes(texto) || e.technologies.some((t) => t.toLowerCase().includes(texto)))
      .sort((a, b) => b.projectCount - a.projectCount || a.nombre.localeCompare(b.nombre));
  }, [lista, q, soloConProyectos]);

  return (
    <Container className="py-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Directorio</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">Estudiantes</h1>
      <p className="mt-2 max-w-2xl text-ink-600">Perfiles con proyectos publicados, su carrera y las tecnologías que dominan. Para contactarlos necesitas iniciar sesión con tu correo Tecsup.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Nombre o tecnología…" aria-label="Buscar" />
        <Select value={carreraId} onChange={(e) => setCarreraId(Number(e.target.value) || "")} aria-label="Carrera">
          <option value="">Todas las carreras</option>
          {carreras.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
        </Select>
        <Select value={sede} onChange={(e) => setSede(e.target.value)} aria-label="Sede">
          <option value="">Todas las sedes</option>
          {SEDES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
        <label className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-700">
          <input type="checkbox" checked={soloConProyectos} onChange={(e) => setSoloConProyectos(e.target.checked)} className="accent-brand-600" />
          Solo con proyectos publicados
        </label>
      </div>

      <div className="mt-8">
        {filtrados === null ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-44" />)}</div>
        ) : filtrados.length === 0 ? (
          <EmptyState icono="🎓" titulo="Nadie coincide con la búsqueda" texto="Prueba sin filtros o desmarca «solo con proyectos publicados»." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtrados.map((e) => (
              <Link key={e.id} href={`/perfiles/${slugConId(e.nombre, e.id)}`} className="card card-hover p-5">
                <div className="flex items-center gap-3">
                  <Avatar name={e.nombre} src={e.fotoUrl} size="lg" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold text-ink-900">{e.nombre}</p>
                    <p className="truncate text-xs text-ink-500">{e.carrera?.nombre ?? "Carrera sin especificar"}</p>
                    <p className="text-[11px] text-ink-400">{[e.sede, e.ciclo ? `Ciclo ${e.ciclo}` : null].filter(Boolean).join(" · ")}</p>
                  </div>
                </div>
                {e.bio && <p className="mt-3 line-clamp-2 text-sm text-ink-600">{e.bio}</p>}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.technologies.slice(0, 4).map((t) => <Chip key={t}>{t}</Chip>)}
                  {e.technologies.length > 4 && <Chip className="text-ink-400">+{e.technologies.length - 4}</Chip>}
                </div>
                <p className="mt-4 border-t border-ink-100 pt-3 text-xs font-medium text-ink-500">{e.projectCount} {e.projectCount === 1 ? "proyecto publicado" : "proyectos publicados"}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
