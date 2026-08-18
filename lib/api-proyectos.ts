import { apiFetch } from "./api-client";
import type { Project } from "./mock-data";

interface ProyectoApi {
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
  categorias: { categoria: { nombre: string } }[];
  tecnologias: { tecnologia: { nombre: string } }[];
  cursos: { curso: { nombre: string; ciclo: string } }[];
  miembros: { rol: string; usuario: { nombre: string; fotoUrl: string | null } }[];
  imagenes: { url: string }[];
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
    team: p.miembros.map((m) => ({ name: m.usuario.nombre, role: m.rol })),
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
  };
}

export async function getProyectos(): Promise<Project[]> {
  const data: ProyectoApi[] = await apiFetch("/proyectos");
  return data.map(proyectoApiToProject);
}