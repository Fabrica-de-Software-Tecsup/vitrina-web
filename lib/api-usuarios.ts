import { apiFetch } from "./api-client";

export interface UsuarioBusqueda {
  id: string;
  nombre: string;
  correo: string;
  fotoUrl: string | null;
}

export async function buscarUsuarios(q: string): Promise<UsuarioBusqueda[]> {
  if (q.trim().length < 2) return [];
  return apiFetch(`/usuarios/buscar?q=${encodeURIComponent(q)}`);
}

export interface EstudianteConStats {
  id: string;
  nombre: string;
  correo: string;
  fotoUrl: string | null;
  bio: string | null;
  ciudad: string | null;
  carrera: string | null;
  cvUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  rol: string;
  projectCount: number;
  technologies: string[];
}

export async function getEstudiantes(): Promise<EstudianteConStats[]> {
  return apiFetch("/usuarios?rol=ALUMNO");
}

export async function getUsuarios(): Promise<EstudianteConStats[]> {
  return apiFetch("/usuarios");
}

export interface EditarPerfilInput {
  nombre?: string;
  bio?: string;
  ciudad?: string;
  experiencia?: string;
  carrera?: string;
  githubUrl?: string;
  linkedinUrl?: string;
}

export async function editarPerfil(id: string, cambios: EditarPerfilInput): Promise<EstudianteConStats> {
  return apiFetch(`/usuarios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });
}