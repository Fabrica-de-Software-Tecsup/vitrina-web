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

/** Ruta del listado en el API. Servidor y navegador la construyen igual: es también la clave de la caché. */
export const rutaProyectos = (filtros: FiltrosProyectos = {}) => `/proyectos${query({ ...filtros })}`;
export const rutaProyectoPorSlug = (slug: string) => `/proyectos/slug/${encodeURIComponent(slug)}`;
export const RUTA_ESTADISTICAS = "/proyectos/estadisticas";
/** Las dos consultas de la portada; el servidor y el navegador piden exactamente las mismas. */
export const RUTA_DESTACADO = rutaProyectos({ orden: "destacados", limit: 1 });
export const RUTA_RECIENTES = rutaProyectos({ orden: "recientes", limit: 9 });

export function listarProyectos(filtros: FiltrosProyectos = {}): Promise<Paginado<Proyecto>> {
  return apiFetch<Paginado<Proyecto>>(rutaProyectos(filtros));
}

/** Solo se guardan en disco listados enteramente publicados (lo que ve cualquiera). */
export const soloPublicados = (r: Paginado<Proyecto>) => r.items.every((p) => p.estado === "PUBLICADO");

/** Filtros de Explorar a partir de la URL (en el servidor, de searchParams; en el navegador, de useSearchParams). */
export const LIMITE_EXPLORAR = 24;
export function filtrosDeUrl(leer: (clave: string) => string | null | undefined): FiltrosProyectos {
  const orden = leer("orden");
  return {
    buscar: leer("buscar") || undefined,
    carreraId: Number(leer("carreraId")) || undefined,
    categoriaId: Number(leer("categoriaId")) || undefined,
    tecnologiaId: Number(leer("tecnologiaId")) || undefined,
    periodo: leer("periodo") || undefined,
    ciclo: Number(leer("ciclo")) || undefined,
    orden: orden === "vistas" || orden === "destacados" ? orden : "recientes",
    offset: Number(leer("offset")) || 0,
    limit: LIMITE_EXPLORAR,
  };
}

export const getProyectoPorSlug = (slug: string) => apiFetch<Proyecto>(rutaProyectoPorSlug(slug));
export const getProyectoPorId = (id: string) => apiFetch<Proyecto>(`/proyectos/${id}`);
export const getRelacionados = (id: string) => apiFetch<Proyecto[]>(`/proyectos/${id}/relacionados`);
export const getHistorial = (id: string) => apiFetch<HistorialItem[]>(`/proyectos/${id}/historial`);
export const getEstadisticas = () => apiFetch<Estadisticas>(RUTA_ESTADISTICAS);
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

/** Un proyecto publicado al azar («Sorpréndeme»). El API puede devolver el proyecto completo o solo su slug. */
export const getProyectoAleatorio = () => apiFetch<Partial<Proyecto> & { slug: string }>("/proyectos/aleatorio");

/** URL de la tarjeta para compartir (PNG generado por el API). */
export function urlTarjeta(slug: string, formato: "historia" | "cuadrado") {
  return `${process.env.NEXT_PUBLIC_API_URL}/proyectos/slug/${encodeURIComponent(slug)}/tarjeta?formato=${formato}`;
}

export const actualizarPuntoFocal = (id: string, imagenId: string, puntoFocalX: number, puntoFocalY: number) =>
  apiFetch<Proyecto>(`/proyectos/${id}/imagenes/${imagenId}`, { method: "PATCH", ...json({ puntoFocalX, puntoFocalY }) });
