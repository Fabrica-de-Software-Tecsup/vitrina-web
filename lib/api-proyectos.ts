import { apiFetch } from "./api-client";
import type { Project } from "./mock-data";

export interface ProyectoApi {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  estado: string;
  youtubeUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  figmaUrl: string | null;
  vistas: number;
  compartidos: number;
  fechaEntrega: string | null;
  comoLoConstruyeron: string | null;
  retosSuperados: string | null;
  leccionAprendida: string | null;
  queHarianDiferente: string | null;
  categorias: { categoria: { id: number; nombre: string } }[];
  tecnologias: { tecnologia: { id: number; nombre: string } }[];
  cursos: { curso: { id: number; nombre: string; ciclo: string } }[];
  miembros: { usuarioId: string; rol: string; usuario: { nombre: string; fotoUrl: string | null } }[];
  imagenes: { id: string; url: string; esPortada: boolean }[];
  buildUrl: string | null;
  createdAt: string;
}

function normalizeEstado(estado: string): Project["status"] {
  const map: Record<string, Project["status"]> = {
    PUBLICADO: "Publicado",
    EN_DESARROLLO: "En Desarrollo",
    POR_REVISAR: "Por Revisar",
    OCULTO: "Oculto",
  };
  return map[estado] ?? (estado as Project["status"]);
}

export function proyectoApiToProject(p: ProyectoApi): Project {
  return {
    id: p.id,
    name: p.nombre,
    course: p.cursos[0]?.curso.nombre ?? "",
    cycle: p.cursos[0]?.curso.ciclo ?? "",
    category: p.categorias[0]?.categoria.nombre ?? "",
    description: p.descripcion ?? "",
    descriptionLong: p.descripcion ?? "",
    technologies: p.tecnologias.map((t) => t.tecnologia.nombre),
    team: p.miembros.map((m) => ({ id: m.usuarioId, name: m.usuario.nombre, role: m.rol })),
    images: p.imagenes.map((img) => img.url),
    views: p.vistas,
    shares: p.compartidos,
    status: normalizeEstado(p.estado),
    deadline: p.fechaEntrega ?? "",
    links: {
      github: p.githubUrl ?? "",
      demo: p.demoUrl ?? "",
      figma: p.figmaUrl ?? "",
    },
    youtubeId: p.youtubeUrl ?? "",
    createdAt: p.createdAt,
    slug: p.slug,
    buildUrl: p.buildUrl,
  };
}

export async function getProyectos(): Promise<Project[]> {
  const data: ProyectoApi[] = await apiFetch("/proyectos");
  return data.map(proyectoApiToProject);
}


export interface CrearProyectoInput {
  nombre: string;
  descripcion?: string;
  categoriaIds?: number[];
  cursoIds?: number[];
}

export async function crearProyecto(input: CrearProyectoInput): Promise<ProyectoApi> {
  return apiFetch("/proyectos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
}

export async function agregarMiembro(
  proyectoId: string,
  usuarioId: string,
  rol: string,
  esLider = false,
): Promise<ProyectoApi> {
  return apiFetch(`/proyectos/${proyectoId}/miembros`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId, rol, esLider }),
  });
}

export async function getProyectoPorId(id: string): Promise<Project> {
  const data: ProyectoApi = await apiFetch(`/proyectos/${id}`);
  return proyectoApiToProject(data);
}

export interface ActualizarProyectoInput {
  estado?: string;
  observaciones?: string;
  descripcion?: string;
  tecnologiaIds?: number[];
  youtubeUrl?: string;
  githubUrl?: string;
  comoLoConstruyeron?: string;
  retosSuperados?: string;
  leccionAprendida?: string;
  queHarianDiferente?: string;
  fechaEntrega?: string;
}
export async function actualizarProyecto(
  id: string,
  cambios: ActualizarProyectoInput,
): Promise<ProyectoApi> {
  return apiFetch(`/proyectos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
}

export async function getProyectoPorSlug(slug: string): Promise<Project> {
  const data: ProyectoApi = await apiFetch(`/proyectos/slug/${slug}`);
  return proyectoApiToProject(data);
}

export async function subirImagenProyecto(
  proyectoId: string,
  archivo: File,
  esPortada: boolean,
): Promise<ProyectoApi> {
  const formData = new FormData();
  formData.append("archivo", archivo);
  formData.append("esPortada", String(esPortada));
  return apiFetch(`/proyectos/${proyectoId}/imagenes`, {
    method: "POST",
    body: formData,
  });
}

export async function subirBuildProyecto(
  proyectoId: string,
  archivo: File,
): Promise<ProyectoApi> {
  const formData = new FormData();
  formData.append("archivo", archivo);
  return apiFetch(`/proyectos/${proyectoId}/build`, {
    method: "POST",
    body: formData,
  });
}

export async function quitarMiembro(
  proyectoId: string,
  usuarioId: string,
): Promise<ProyectoApi> {
  return apiFetch(`/proyectos/${proyectoId}/miembros/${usuarioId}`, {
    method: "DELETE",
  });
}

export async function getProyectoRawPorId(id: string): Promise<ProyectoApi> {
  return apiFetch(`/proyectos/${id}`);
}

