import { apiFetch } from "./api-client";
import type { Carrera, Categoria, Tecnologia } from "./tipos";

export const RUTA_CARRERAS = "/academico/carreras";
export const RUTA_CATEGORIAS = "/catalogos/categorias";
export const RUTA_TECNOLOGIAS = "/catalogos/tecnologias";

export const getCarreras = (todas = false) => apiFetch<Carrera[]>(`${RUTA_CARRERAS}${todas ? "?todas=true" : ""}`);
export const getCategorias = () => apiFetch<Categoria[]>(RUTA_CATEGORIAS);
export const getTecnologias = () => apiFetch<Tecnologia[]>(RUTA_TECNOLOGIAS);

const json = (body: unknown): RequestInit => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const crearTecnologia = (nombre: string, tipo = "herramienta") =>
  apiFetch<Tecnologia>("/catalogos/tecnologias", { method: "POST", ...json({ nombre, tipo }) });

// Solo admin
export const crearCategoria = (datos: { nombre: string; color?: string }) =>
  apiFetch<Categoria>("/catalogos/categorias", { method: "POST", ...json(datos) });
export const eliminarCategoria = (id: number) => apiFetch(`/catalogos/categorias/${id}`, { method: "DELETE" });
export const eliminarTecnologia = (id: number) => apiFetch(`/catalogos/tecnologias/${id}`, { method: "DELETE" });

export interface DatosCarrera {
  nombre: string;
  area: string;
  sedes?: string[];
  descripcion?: string;
  url?: string;
  color?: string;
  estado?: boolean;
}
export const crearCarrera = (datos: DatosCarrera) => apiFetch<Carrera>("/academico/carreras", { method: "POST", ...json(datos) });
export const actualizarCarrera = (id: number, datos: Partial<DatosCarrera>) =>
  apiFetch<Carrera>(`/academico/carreras/${id}`, { method: "PATCH", ...json(datos) });
