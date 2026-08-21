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

export interface Tecnologia {
  id: number;
  nombre: string;
  tipo: string;
}

export async function getTecnologias(): Promise<Tecnologia[]> {
  return apiFetch("/catalogos/tecnologias");
}

export async function crearTecnologia(nombre: string, tipo: string): Promise<Tecnologia> {
  return apiFetch("/catalogos/tecnologias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, tipo }),
  });
}