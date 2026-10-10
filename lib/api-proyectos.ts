import { apiFetch } from "./api-client";
import type { Estadisticas, HistorialItem, Paginado, Proyecto, VersionCompleta, VersionResumen } from "./tipos";

export interface FiltrosProyectos {
  buscar?: string;
  carreraId?: number;
  categoriaId?: number;
  tecnologiaId?: number;
  ciclo?: number;
  periodo?: string;
  estado?: string;
  docenteId?: string;
  miembroId?: string;
  ambito?: "mios" | "asesorados" | "revision";
  orden?: "recientes" | "vistas" | "destacados";
  limit?: number;
  offset?: number;
}

function query(params: Record<string, string | number | undefined>): string {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "" && v !== null) qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

export function listarProyectos(filtros: FiltrosProyectos = {}): Promise<Paginado<Proyecto>> {
  return apiFetch<Paginado<Proyecto>>(`/proyectos${query({ ...filtros })}`);
}

export const getProyectoPorSlug = (slug: string) => apiFetch<Proyecto>(`/proyectos/slug/${encodeURIComponent(slug)}`);
export const getProyectoPorId = (id: string) => apiFetch<Proyecto>(`/proyectos/${id}`);
export const getRelacionados = (id: string) => apiFetch<Proyecto[]>(`/proyectos/${id}/relacionados`);
export const getHistorial = (id: string) => apiFetch<HistorialItem[]>(`/proyectos/${id}/historial`);
export const getEstadisticas = () => apiFetch<Estadisticas>("/proyectos/estadisticas");
export const getVersiones = (id: string) => apiFetch<VersionResumen[]>(`/proyectos/${id}/versiones`);
export const getVersion = (id: string, numero: number) => apiFetch<VersionCompleta>(`/proyectos/${id}/versiones/${numero}`);

export interface DatosProyecto {
  nombre?: string;
  tagline?: string;
  descripcion?: string;
  carreraId?: number | null;
  ciclo?: number | null;
  periodo?: string | null;
  docenteIds?: string[];
  resumenCambios?: string;
  categoriaIds?: number[];
  tecnologiaIds?: number[];
  youtubeUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  figmaUrl?: string;
  comoLoConstruyeron?: string;
  retosSuperados?: string;
  leccionAprendida?: string;
  queHarianDiferente?: string;
  estado?: string;
  observaciones?: string;
  fechaEntrega?: string | null;
  destacado?: boolean;
}

const json = (body: unknown): RequestInit => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const crearProyecto = (datos: DatosProyecto) => apiFetch<Proyecto>("/proyectos", { method: "POST", ...json(datos) });
export const actualizarProyecto = (id: string, datos: DatosProyecto) =>
  apiFetch<Proyecto>(`/proyectos/${id}`, { method: "PATCH", ...json(datos) });
export const eliminarProyecto = (id: string) => apiFetch<{ mensaje: string }>(`/proyectos/${id}`, { method: "DELETE" });

export const agregarMiembro = (id: string, usuarioId: string, rol: string, esLider = false) =>
  apiFetch<Proyecto>(`/proyectos/${id}/miembros`, { method: "POST", ...json({ usuarioId, rol, esLider }) });
export const quitarMiembro = (id: string, usuarioId: string) =>
  apiFetch<Proyecto>(`/proyectos/${id}/miembros/${usuarioId}`, { method: "DELETE" });

export function subirImagenProyecto(id: string, archivo: File, esPortada = false) {
  const fd = new FormData();
  fd.append("archivo", archivo);
  fd.append("esPortada", String(esPortada));
  return apiFetch<Proyecto>(`/proyectos/${id}/imagenes`, { method: "POST", body: fd });
}
export const eliminarImagenProyecto = (id: string, imagenId: string) =>
  apiFetch<Proyecto>(`/proyectos/${id}/imagenes/${imagenId}`, { method: "DELETE" });
export const actualizarImagenProyecto = (id: string, imagenId: string, cambios: { esPortada?: boolean; orden?: number }) =>
  apiFetch<Proyecto>(`/proyectos/${id}/imagenes/${imagenId}`, { method: "PATCH", ...json(cambios) });

export function subirBuildProyecto(id: string, archivo: File) {
  const fd = new FormData();
  fd.append("archivo", archivo);
  return apiFetch<Proyecto>(`/proyectos/${id}/build`, { method: "POST", body: fd });
}

export const incrementarVistas = (id: string) => apiFetch(`/proyectos/${id}/vistas`, { method: "POST" });
export const incrementarCompartidos = (id: string) => apiFetch(`/proyectos/${id}/compartidos`, { method: "POST" });
