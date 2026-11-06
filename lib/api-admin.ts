import { apiBlob, apiFetch } from "./api-client";
import type { Envio, Jam } from "./api-jams";
import type { Paginado, Perfil, Rol } from "./tipos";

export interface ResumenAdmin {
  usuarios: Partial<Record<Rol, number>>;
  proyectos: Record<string, number>;
  publicadosPorCarrera: { carreraId: number | null; carrera: string; total: number }[];
  porRevisarMasAntiguos: { id: string; nombre: string; slug: string; updatedAt: string; carrera: { nombre: string } | null }[];
}

export interface UsuarioAdmin extends Perfil {
  correo: string;
  _count: { proyectos: number; membresias: number };
}

export interface RolPreasignado {
  correo: string;
  rol: Rol;
  carreraId: number | null;
  creadoEn: string;
}

const json = (body: unknown): RequestInit => ({ headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const getResumenAdmin = () => apiFetch<ResumenAdmin>("/admin/resumen");

export function getUsuariosAdmin(params: { q?: string; rol?: string; limit?: number; offset?: number } = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") qs.set(k, String(v));
  const s = qs.toString();
  return apiFetch<Paginado<UsuarioAdmin>>(`/admin/usuarios${s ? `?${s}` : ""}`);
}

export const cambiarRol = (id: string, rol: Rol) => apiFetch<Perfil>(`/usuarios/${id}/rol`, { method: "PATCH", ...json({ rol }) });

export const getPreasignados = () => apiFetch<RolPreasignado[]>("/admin/roles-preasignados");
export const preasignarRoles = (correos: string[], rol: Rol, carreraId?: number) =>
  apiFetch<{ aplicadosAhora: string[]; pendientesDePrimerIngreso: string[] }>("/admin/roles-preasignados", {
    method: "POST",
    ...json({ correos, rol, ...(carreraId ? { carreraId } : {}) }),
  });
export const quitarPreasignado = (correo: string) =>
  apiFetch(`/admin/roles-preasignados/${encodeURIComponent(correo)}`, { method: "DELETE" });

export interface ResultadoCorreoPrueba {
  ok: boolean;
  configurado: boolean;
  proveedor: "smtp" | "resend" | "simulado";
  remitente: string;
  destinatarios: string[];
  detalle: string;
}

/** Envía un correo de prueba al admin autenticado y devuelve qué respondió el proveedor. */
export const enviarCorreoPrueba = () => apiFetch<ResultadoCorreoPrueba>("/admin/correo-prueba", { method: "POST" });

/* ─── Jams ─── */

/** La jam vista por un admin: el código de acceso no vuelve nunca (el API guarda solo su hash). */
export interface JamAdmin extends Jam {
  publica: boolean;
  maxEnvios: number;
  enviosOcultos?: number;
  creadoEn?: string;
}

export interface DatosJam {
  slug: string;
  nombre: string;
  lema?: string | null;
  descripcion?: string | null;
  lugar?: string | null;
  inicioEn: string;
  cierreEn: string;
  categorias: string[];
  /** Obligatorio al crear; al editar, solo si se quiere cambiar. */
  codigo?: string;
  publica: boolean;
  maxEnvios?: number;
}

export interface EnvioAdmin extends Envio {
  oculto: boolean;
  contactoCorreo: string;
}

export const getJamsAdmin = () => apiFetch<JamAdmin[]>("/admin/jams");
export const crearJam = (datos: DatosJam) => apiFetch<JamAdmin>("/admin/jams", { method: "POST", ...json(datos) });
export const actualizarJam = (id: string, datos: Partial<DatosJam>) => apiFetch<JamAdmin>(`/admin/jams/${id}`, { method: "PATCH", ...json(datos) });
export const getEnviosAdmin = (jamId: string) => apiFetch<EnvioAdmin[]>(`/admin/jams/${jamId}/envios`);
export const actualizarEnvioAdmin = (envioId: string, cambios: { oculto?: boolean; reconocimiento?: string | null }) =>
  apiFetch<EnvioAdmin>(`/admin/jams/envios/${envioId}`, { method: "PATCH", ...json(cambios) });
export const descargarCsvJam = (jamId: string) => apiBlob(`/admin/jams/${jamId}/envios.csv`);
/** Borra el envío y sus imágenes; irreversible (para moderar basta ocultarlo). */
export const eliminarEnvioAdmin = (envioId: string) => apiFetch<void>(`/admin/jams/envios/${envioId}`, { method: "DELETE" });
