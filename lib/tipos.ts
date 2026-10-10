/** Tipos compartidos del API de Vitrina (espejo de las respuestas del backend). */

export type Rol = "ALUMNO" | "DOCENTE" | "ADMIN";
export type EstadoProyecto = "EN_DESARROLLO" | "POR_REVISAR" | "PUBLICADO" | "OCULTO";

export const SEDES = ["Lima", "Arequipa", "Trujillo"] as const;

export interface CarreraResumen {
  id: number;
  nombre: string;
  slug: string;
  area: string;
  color: string | null;
}

export interface Carrera extends CarreraResumen {
  sedes: string[];
  descripcion: string | null;
  url: string | null;
  estado: boolean;
  proyectosPublicados: number;
  estudiantes: number;
}

export interface Categoria {
  id: number;
  nombre: string;
  color: string | null;
  icono: string | null;
}

export interface Tecnologia {
  id: number;
  nombre: string;
  tipo: string;
}

export interface UsuarioResumen {
  id: string;
  nombre: string;
  fotoUrl: string | null;
}

export interface Perfil extends UsuarioResumen {
  correo?: string | null;
  bio: string | null;
  ciudad: string | null;
  experiencia: string | null;
  carreraId: number | null;
  carrera: CarreraResumen | null;
  ciclo: number | null;
  sede: string | null;
  cvUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  rol: Rol;
  creadoEn: string;
}

export interface PerfilPropio extends Perfil {
  correo: string;
  perfilCompleto: boolean;
}

export interface PerfilDirectorio extends Perfil {
  projectCount: number;
  technologies: string[];
}

export interface Miembro {
  usuarioId: string;
  rol: string;
  esLider: boolean;
  usuario: UsuarioResumen;
}

/** Una variante redimensionada que genera el API al subir (s 480 px, m 960 px, l 1600 px). */
export interface VarianteImagen {
  webp?: string;
  avif?: string;
  ancho: number;
  alto?: number;
}

export interface Imagen {
  id: string;
  url: string;
  esPortada: boolean;
  orden: number;
  ancho?: number | null;
  alto?: number | null;
  /** Color medio de la imagen, en hex; tiñe el hueco mientras carga. */
  colorDominante?: string | null;
  /** ThumbHash en base64. */
  placeholder?: string | null;
  /** Punto focal normalizado (0–1) para el recorte 4:3. */
  puntoFocalX?: number | null;
  puntoFocalY?: number | null;
  variantes?: Partial<Record<"s" | "m" | "l", VarianteImagen>> | null;
}

export interface Proyecto {
  id: string;
  nombre: string;
  slug: string;
  tagline: string | null;
  descripcion: string | null;
  estado: EstadoProyecto;
  carreraId: number | null;
  carrera: CarreraResumen | null;
  ciclo: number | null;
  periodo: string | null;
  docentes: { usuarioId: string; usuario: UsuarioResumen }[];
  youtubeUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  figmaUrl: string | null;
  comoLoConstruyeron: string | null;
  retosSuperados: string | null;
  leccionAprendida: string | null;
  queHarianDiferente: string | null;
  creadorId: string;
  creador: UsuarioResumen;
  categorias: { categoria: Categoria }[];
  tecnologias: { tecnologia: Tecnologia }[];
  cursos: { curso: { id: number; nombre: string; ciclo: string } }[];
  miembros: Miembro[];
  imagenes: Imagen[];
  buildUrl: string | null;
  vistas: number;
  compartidos: number;
  destacado: boolean;
  fechaEntrega: string | null;
  observaciones: string | null;
  publicadoEn: string | null;
  /** Numero de la ultima version publicada (0 = nunca). */
  versionActual: number;
  /** Nota pendiente "que cambio" para la proxima version. */
  resumenCambios: string | null;
  /** true cuando quien consulta ve la ultima version publicada mientras el equipo prepara otra. */
  enNuevaVersion?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VersionResumen {
  id: string;
  numero: number;
  periodo: string | null;
  ciclo: number | null;
  nombre: string;
  tagline: string | null;
  resumenCambios: string | null;
  publicadoEn: string;
  tecnologias: string[];
  imagenes: string[];
  miembros: { nombre: string; rol: string }[];
  publicadoPor: UsuarioResumen | null;
}

export interface VersionCompleta extends VersionResumen {
  slug: string;
  descripcion: string | null;
  comoLoConstruyeron: string | null;
  retosSuperados: string | null;
  leccionAprendida: string | null;
  queHarianDiferente: string | null;
  youtubeUrl: string | null;
  githubUrl: string | null;
  demoUrl: string | null;
  figmaUrl: string | null;
  buildUrl: string | null;
  categorias: string[];
  docentes: string[];
}

export interface Paginado<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface HistorialItem {
  id: string;
  deEstado: EstadoProyecto | null;
  aEstado: EstadoProyecto;
  observaciones: string | null;
  actor: UsuarioResumen | null;
  createdAt: string;
}

export interface Estadisticas {
  proyectosPublicados: number;
  carrerasConProyectos: number;
  estudiantes: number;
  tecnologiasTop: { id: number; nombre: string; total: number }[];
}

export const ESTADO_LABEL: Record<EstadoProyecto, string> = {
  EN_DESARROLLO: "En desarrollo",
  POR_REVISAR: "Por revisar",
  PUBLICADO: "Publicado",
  OCULTO: "Oculto",
};

/** Imagen de portada del proyecto: la marcada como portada o la primera. */
export function imagenPortada(p: Pick<Proyecto, "imagenes">): Imagen | null {
  return p.imagenes.find((i) => i.esPortada) ?? p.imagenes[0] ?? null;
}

/** URL de la portada del proyecto. */
export function portadaDe(p: Pick<Proyecto, "imagenes">): string | null {
  return imagenPortada(p)?.url ?? null;
}
