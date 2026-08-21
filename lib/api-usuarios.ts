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