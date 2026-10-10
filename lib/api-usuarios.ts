import { apiFetch } from "./api-client";
import type { Perfil, PerfilDirectorio, PerfilPropio, UsuarioResumen } from "./tipos";

export interface UsuarioBusqueda extends UsuarioResumen {
  correo: string;
  carrera: { nombre: string } | null;
}

export interface DocenteOpcion extends UsuarioResumen {
  carrera: { id: number; nombre: string } | null;
  sede: string | null;
}

export const getMiPerfil = () => apiFetch<PerfilPropio>("/usuarios/me");
export const getPerfil = (id: string) => apiFetch<Perfil>(`/usuarios/${id}`);
/** Borra (anonimiza) la cuenta propia. El API responde 204 e invalida todas las sesiones. */
export const eliminarMiCuenta = () => apiFetch<void>("/usuarios/me", { method: "DELETE" });
export const getDocentes = () => apiFetch<DocenteOpcion[]>("/usuarios/docentes");

export function buscarUsuarios(q: string): Promise<UsuarioBusqueda[]> {
  if (q.trim().length < 2) return Promise.resolve([]);
  return apiFetch<UsuarioBusqueda[]>(`/usuarios/buscar?q=${encodeURIComponent(q.trim())}`);
}

export interface FiltrosDirectorio {
  rol?: string;
  carreraId?: number;
  sede?: string;
  q?: string;
}

export function getDirectorio(filtros: FiltrosDirectorio = {}): Promise<PerfilDirectorio[]> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(filtros)) if (v !== undefined && v !== "") qs.set(k, String(v));
  const s = qs.toString();
  return apiFetch<PerfilDirectorio[]>(`/usuarios${s ? `?${s}` : ""}`);
}

export interface EditarPerfilInput {
  nombre?: string;
  bio?: string;
  ciudad?: string;
  experiencia?: string;
  carreraId?: number | null;
  ciclo?: number | null;
  sede?: string | null;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export const editarPerfil = (id: string, cambios: EditarPerfilInput) =>
  apiFetch<PerfilPropio>(`/usuarios/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });

export function subirCV(id: string, archivo: File) {
  const fd = new FormData();
  fd.append("archivo", archivo);
  return apiFetch<PerfilPropio>(`/usuarios/${id}/cv`, { method: "POST", body: fd });
}
