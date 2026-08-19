import { apiFetch } from "./api-client";

export interface Curso {
  id: number;
  nombre: string;
  ciclo: string;
  periodo: string;
}

export interface Categoria {
  id: number;
  nombre: string;
}

export async function getCursos(): Promise<Curso[]> {
  return apiFetch("/academico/cursos");
}

export async function getCategorias(): Promise<Categoria[]> {
  return apiFetch("/catalogos/categorias");
}