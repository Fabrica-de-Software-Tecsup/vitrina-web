"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { Chip } from "@/components/ui/Badge";
import { Container, Stat } from "@/components/ui/Section";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { EmptyState, Pagination, Skeleton, Tabs, useToast } from "@/components/ui/Feedback";
import { useSesion } from "@/components/sesion/SesionProvider";
import { cambiarRol, getPreasignados, getResumenAdmin, getUsuariosAdmin, preasignarRoles, quitarPreasignado, type ResumenAdmin, type RolPreasignado, type UsuarioAdmin } from "@/lib/api-admin";
import { actualizarCarrera, crearCarrera, crearCategoria, eliminarCategoria, getCarreras, getCategorias } from "@/lib/api-catalogos";
import { editarPerfil } from "@/lib/api-usuarios";
import { ESTADO_LABEL, SEDES, type Carrera, type Categoria, type EstadoProyecto, type Rol } from "@/lib/tipos";
import { fechaCorta } from "@/lib/utils";

type Pestana = "resumen" | "usuarios" | "docentes" | "carreras" | "catalogos";

export default function AdminPage() {
  const router = useRouter();
  const { esAdmin, cargando } = useSesion();
  const [tab, setTab] = useState<Pestana>("resumen");

  useEffect(() => {
    if (!cargando && !esAdmin) router.replace("/dashboard");
  }, [cargando, esAdmin, router]);
  if (cargando || !esAdmin) return <Container className="py-10"><Skeleton className="h-8 w-1/3" /></Container>;

  return (
    <Container className="py-10">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Administración</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink-900">Vitrina</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-500">Lo único que necesita un admin: dar de alta docentes por correo, corregir roles y mantener carreras y catálogos. Los alumnos se registran solos al entrar con Google.</p>
      <div className="mt-6">
        <Tabs valor={tab} onChange={setTab} opciones={[{ id: "resumen", label: "Resumen" }, { id: "usuarios", label: "Usuarios" }, { id: "docentes", label: "Alta de docentes" }, { id: "carreras", label: "Carreras" }, { id: "catalogos", label: "Categorías" }]} />
      </div>
      <div className="mt-6">
        {tab === "resumen" && <Resumen />}
        {tab === "usuarios" && <Usuarios />}
        {tab === "docentes" && <AltaDocentes />}
        {tab === "carreras" && <Carreras />}
        {tab === "catalogos" && <Catalogos />}
      </div>
    </Container>
  );
}

function Resumen() {
  const [r, setR] = useState<ResumenAdmin | null>(null);
  useEffect(() => { getResumenAdmin().then(setR).catch(() => null); }, []);
  if (!r) return <Skeleton className="h-40" />;
  const estados = Object.keys(ESTADO_LABEL) as EstadoProyecto[];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat valor={r.usuarios.ALUMNO ?? 0} label="alumnos" icono="🎓" />
        <Stat valor={r.usuarios.DOCENTE ?? 0} label="docentes" icono="🧑‍🏫" />
        <Stat valor={r.proyectos.PUBLICADO ?? 0} label="proyectos publicados" icono="✅" />
        <Stat valor={r.proyectos.POR_REVISAR ?? 0} label="esperando revisión" icono="📬" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="font-display text-sm font-bold text-ink-900">Proyectos por estado</h3>
          <ul className="mt-3 space-y-2 text-sm">{estados.map((e) => <li key={e} className="flex justify-between"><span className="text-ink-600">{ESTADO_LABEL[e]}</span><span className="font-semibold">{r.proyectos[e] ?? 0}</span></li>)}</ul>
        </div>
        <div className="card p-5">
          <h3 className="font-display text-sm font-bold text-ink-900">Publicados por carrera</h3>
          {r.publicadosPorCarrera.length === 0 ? <p className="mt-2 text-sm text-ink-500">Todavía nada publicado.</p> : (
            <ul className="mt-3 space-y-2 text-sm">{r.publicadosPorCarrera.map((c) => <li key={c.carrera} className="flex justify-between gap-3"><span className="truncate text-ink-600">{c.carrera}</span><span className="font-semibold">{c.total}</span></li>)}</ul>
          )}
        </div>
      </div>
      <div className="card p-5">
        <h3 className="font-display text-sm font-bold text-ink-900">Esperando revisión hace más tiempo</h3>
        {r.porRevisarMasAntiguos.length === 0 ? <p className="mt-2 text-sm text-ink-500">La cola está vacía 🎉</p> : (
          <ul className="mt-3 divide-y divide-ink-100">{r.porRevisarMasAntiguos.map((p) => <li key={p.id} className="flex items-center justify-between py-2 text-sm"><span><span className="font-medium text-ink-900">{p.nombre}</span><span className="ml-2 text-xs text-ink-500">{p.carrera?.nombre ?? "Sin carrera"} · desde {fechaCorta(p.updatedAt)}</span></span><Link href={`/dashboard/revision/${p.id}`} className="text-brand-700 hover:underline">Revisar</Link></li>)}</ul>
        )}
      </div>
    </div>
  );
}

function Usuarios() {
  const { usuario: yo } = useSesion();
  const { avisar } = useToast();
  const [q, setQ] = useState("");
  const [rol, setRol] = useState("");
  const [offset, setOffset] = useState(0);
  const [datos, setDatos] = useState<{ items: UsuarioAdmin[]; total: number } | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  useEffect(() => { getCarreras().then(setCarreras).catch(() => null); }, []);
  const LIMIT = 25;
  const cargar = () => getUsuariosAdmin({ q, rol, limit: LIMIT, offset }).then(setDatos).catch(() => setDatos({ items: [], total: 0 }));
  useEffect(() => { const t = setTimeout(cargar, 250); return () => clearTimeout(t); }, [q, rol, offset]); // eslint-disable-line react-hooks/exhaustive-deps

  const cambiarCarrera = async (u: UsuarioAdmin, carreraId: number | null) => {
    try { await editarPerfil(u.id, { carreraId }); avisar("Carrera actualizada"); void cargar(); } catch (e) { avisar(e instanceof Error ? e.message : "No se pudo cambiar", "error"); }
  };
  const cambiar = async (u: UsuarioAdmin, nuevo: Rol) => {
    try { await cambiarRol(u.id, nuevo); avisar(`${u.nombre} ahora es ${nuevo.toLowerCase()}`); void cargar(); } catch (e) { avisar(e instanceof Error ? e.message : "No se pudo cambiar", "error"); }
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
        <Input value={q} onChange={(e) => { setQ(e.target.value); setOffset(0); }} placeholder="Buscar por nombre o correo…" />
        <Select value={rol} onChange={(e) => { setRol(e.target.value); setOffset(0); }}><option value="">Todos los roles</option><option value="ALUMNO">Alumnos</option><option value="DOCENTE">Docentes</option><option value="ADMIN">Admins</option></Select>
      </div>
      {datos === null ? <Skeleton className="mt-4 h-40" /> : datos.items.length === 0 ? <EmptyState className="mt-4" titulo="Sin usuarios" /> : (
        <ul className="card mt-4 divide-y divide-ink-100">
          {datos.items.map((u) => (
            <li key={u.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
              <Avatar name={u.nombre} src={u.fotoUrl} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{u.nombre}</p>
                <p className="truncate text-xs text-ink-500">{u.correo} · {u.carrera?.nombre ?? "sin carrera"} · {u._count.membresias} proyecto(s)</p>
              </div>
              <Select value={u.carreraId ?? ""} onChange={(e) => cambiarCarrera(u, Number(e.target.value) || null)} className="sm:w-64" aria-label="Carrera">
                <option value="">Sin carrera</option>
                {carreras.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </Select>
              <Select value={u.rol} disabled={u.id === yo?.id} onChange={(e) => cambiar(u, e.target.value as Rol)} className="sm:w-36"><option value="ALUMNO">Alumno</option><option value="DOCENTE">Docente</option><option value="ADMIN">Admin</option></Select>
            </li>
          ))}
        </ul>
      )}
      {datos && <div className="mt-4"><Pagination total={datos.total} limit={LIMIT} offset={offset} onChange={setOffset} /></div>}
    </div>
  );
}

function AltaDocentes() {
  const { avisar } = useToast();
  const [texto, setTexto] = useState("");
  const [rol, setRol] = useState<Rol>("DOCENTE");
  const [carreraId, setCarreraId] = useState<number | "">("");
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [lista, setLista] = useState<RolPreasignado[]>([]);
  const [enviando, setEnviando] = useState(false);
  const cargar = () => getPreasignados().then(setLista).catch(() => null);
  useEffect(() => { void cargar(); getCarreras().then(setCarreras).catch(() => null); }, []);
  const nombreCarrera = (id: number | null) => carreras.find((c) => c.id === id)?.nombre;

  const enviar = async () => {
    const correos = texto.split(/[\s,;]+/).map((c) => c.trim().toLowerCase()).filter(Boolean);
    if (!correos.length) return;
    setEnviando(true);
    try {
      const r = await preasignarRoles(correos, rol, carreraId || undefined);
      avisar(`${r.aplicadosAhora.length} aplicados ahora · ${r.pendientesDePrimerIngreso.length} al primer ingreso`);
      setTexto("");
      void cargar();
    } catch (e) { avisar(e instanceof Error ? e.message : "No se pudo", "error"); } finally { setEnviando(false); }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-6">
        <h3 className="font-display text-base font-bold text-ink-900">Dar de alta docentes</h3>
        <p className="mt-1 text-sm text-ink-500">Pega los correos @tecsup.edu.pe (uno por línea o separados por coma) y la carrera que dictan. Si ya entraron a Vitrina se aplica ahora; si no, en cuanto entren con Google. No hay que crear usuarios ni contraseñas.</p>
        <Field label="Correos" htmlFor="correos" className="mt-4"><Textarea id="correos" rows={6} value={texto} onChange={(e) => setTexto(e.target.value)} placeholder={"juan.perez@tecsup.edu.pe\nmaria.lopez@tecsup.edu.pe"} /></Field>
        <div className="mt-3 grid gap-3 sm:grid-cols-[140px_1fr]">
          <Select value={rol} onChange={(e) => setRol(e.target.value as Rol)}><option value="DOCENTE">Docente</option><option value="ADMIN">Admin</option></Select>
          <Select value={carreraId} onChange={(e) => setCarreraId(Number(e.target.value) || "")} aria-label="Carrera que dicta">
            <option value="">Carrera que dicta (opcional)</option>
            {Array.from(new Set(carreras.map((c) => c.area))).map((area) => (
              <optgroup key={area} label={area}>{carreras.filter((c) => c.area === area).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}</optgroup>
            ))}
          </Select>
        </div>
        <div className="mt-3 flex justify-end"><Button onClick={enviar} loading={enviando} disabled={!texto.trim()}>Dar de alta</Button></div>
      </div>
      <div className="card p-6">
        <h3 className="font-display text-base font-bold text-ink-900">Pendientes de primer ingreso</h3>
        {lista.length === 0 ? <p className="mt-2 text-sm text-ink-500">Nadie pendiente.</p> : (
          <ul className="mt-3 divide-y divide-ink-100">{lista.map((p) => <li key={p.correo} className="flex items-center justify-between py-2 text-sm"><span><span className="font-medium text-ink-900">{p.correo}</span> <Chip className="ml-2">{p.rol.toLowerCase()}</Chip>{nombreCarrera(p.carreraId) && <span className="ml-2 text-xs text-ink-500">{nombreCarrera(p.carreraId)}</span>}</span><button type="button" className="text-xs text-rose-600 hover:underline" onClick={async () => { await quitarPreasignado(p.correo); void cargar(); }}>Quitar</button></li>)}</ul>
        )}
      </div>
    </div>
  );
}

function Carreras() {
  const { avisar } = useToast();
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [nueva, setNueva] = useState({ nombre: "", area: "", sedes: [] as string[] });
  const cargar = () => getCarreras(true).then(setCarreras).catch(() => null);
  useEffect(() => { void cargar(); }, []);
  const areas = Array.from(new Set(carreras.map((c) => c.area)));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <ul className="card divide-y divide-ink-100">
        {carreras.map((c) => (
          <li key={c.id} className="flex items-center gap-3 p-3">
            <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: c.color ?? "#00B3E0" }} />
            <div className="min-w-0 flex-1">
              <p className={`truncate text-sm font-semibold ${c.estado ? "text-ink-900" : "text-ink-400 line-through"}`}>{c.nombre}</p>
              <p className="truncate text-xs text-ink-500">{c.area} · {c.sedes.join(", ") || "sede sin definir"} · {c.proyectosPublicados} publicados · {c.estudiantes} estudiantes</p>
            </div>
            <Button size="sm" variant="ghost" onClick={async () => { await actualizarCarrera(c.id, { estado: !c.estado }); void cargar(); }}>{c.estado ? "Desactivar" : "Activar"}</Button>
          </li>
        ))}
      </ul>
      <div className="card h-fit p-5">
        <h3 className="font-display text-sm font-bold text-ink-900">Nueva carrera</h3>
        <div className="mt-3 space-y-3">
          <Input value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} placeholder="Nombre oficial" />
          <Input value={nueva.area} onChange={(e) => setNueva({ ...nueva, area: e.target.value })} placeholder="Área (ej. Tecnología Digital)" list="areas" />
          <datalist id="areas">{areas.map((a) => <option key={a} value={a} />)}</datalist>
          <div className="flex flex-wrap gap-2">{SEDES.map((s) => <Chip key={s} size="md" active={nueva.sedes.includes(s)} onClick={() => setNueva({ ...nueva, sedes: nueva.sedes.includes(s) ? nueva.sedes.filter((x) => x !== s) : [...nueva.sedes, s] })}>{s}</Chip>)}</div>
          <Button className="w-full" disabled={!nueva.nombre || !nueva.area} onClick={async () => { try { await crearCarrera(nueva); setNueva({ nombre: "", area: "", sedes: [] }); avisar("Carrera creada"); void cargar(); } catch (e) { avisar(e instanceof Error ? e.message : "Error", "error"); } }}>Crear</Button>
        </div>
      </div>
    </div>
  );
}

function Catalogos() {
  const { avisar } = useToast();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [color, setColor] = useState("#00B3E0");
  const cargar = () => getCategorias().then(setCategorias).catch(() => null);
  useEffect(() => { void cargar(); }, []);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="card p-5">
        <h3 className="font-display text-sm font-bold text-ink-900">Categorías</h3>
        <p className="mt-1 text-xs text-ink-500">Transversales a todas las carreras. Las tecnologías las agregan los propios alumnos al editar su proyecto.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {categorias.map((c) => (
            <span key={c.id} className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${c.color ?? "#999"}1a`, color: c.color ?? "#333", borderColor: `${c.color ?? "#999"}40` }}>
              {c.nombre}
              <button type="button" aria-label={`Eliminar ${c.nombre}`} className="opacity-60 hover:opacity-100" onClick={async () => { try { await eliminarCategoria(c.id); void cargar(); } catch (e) { avisar(e instanceof Error ? e.message : "No se puede eliminar: tiene proyectos", "error"); } }}>×</button>
            </span>
          ))}
        </div>
      </div>
      <div className="card h-fit p-5">
        <h3 className="font-display text-sm font-bold text-ink-900">Nueva categoría</h3>
        <div className="mt-3 space-y-3">
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
          <div className="flex items-center gap-3"><input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-10 w-14 cursor-pointer rounded-lg border border-ink-200" aria-label="Color" /><span className="text-xs text-ink-500">{color}</span></div>
          <Button className="w-full" disabled={!nombre.trim()} onClick={async () => { try { await crearCategoria({ nombre: nombre.trim(), color }); setNombre(""); avisar("Categoría creada"); void cargar(); } catch (e) { avisar(e instanceof Error ? e.message : "Error", "error"); } }}>Crear</Button>
        </div>
      </div>
    </div>
  );
}
