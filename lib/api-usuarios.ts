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