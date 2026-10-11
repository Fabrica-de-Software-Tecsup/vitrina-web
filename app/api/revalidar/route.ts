import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";

/*
  Revalidación bajo demanda.

  La llamará el API de Vitrina cuando cambie algo público (publicar, ocultar o editar un proyecto publicado,
  tocar un catálogo), para que el sitio no espere los 5 minutos de la caché:

    POST /api/revalidar
    x-revalidar-secreto: <REVALIDAR_SECRETO>
    Content-Type: application/json

    { "etiquetas": ["proyectos", "proyecto:mi-slug"] }

  Etiquetas admitidas (las que pone lib/api-servidor.ts):
    · proyectos         listados, cifras y contadores (portada, Explorar, Carreras, directorios)
    · proyecto:<slug>   el detalle de ese proyecto
    · catalogos         carreras, categorías y tecnologías
    · personas          directorios de docentes y estudiantes

  Las páginas no se regeneran en el momento: quedan marcadas como caducadas, la siguiente visita recibe todavía
  la versión guardada y dispara la regeneración por detrás (así nunca se espera a un API dormido).
  El lado del API está pendiente de conectar. Sin REVALIDAR_SECRETO en el entorno la ruta no existe (404).
*/

const ETIQUETA = /^(proyectos|catalogos|personas|proyecto:[^\s]{1,200})$/;
const MAX_ETIQUETAS = 50;

/** Comparación en tiempo constante; se comparan los hash para no filtrar ni la longitud del secreto. */
function mismoSecreto(recibido: string, esperado: string): boolean {
  const a = createHash("sha256").update(recibido).digest();
  const b = createHash("sha256").update(esperado).digest();
  return timingSafeEqual(a, b);
}

export async function POST(peticion: Request) {
  const secreto = process.env.REVALIDAR_SECRETO;
  if (!secreto) return new Response(null, { status: 404 });

  const recibido = peticion.headers.get("x-revalidar-secreto") ?? "";
  if (!mismoSecreto(recibido, secreto)) return Response.json({ error: "No autorizado" }, { status: 401 });

  const cuerpo: unknown = await peticion.json().catch(() => null);
  const pedidas = (cuerpo as { etiquetas?: unknown } | null)?.etiquetas;
  if (!Array.isArray(pedidas) || pedidas.length === 0 || pedidas.length > MAX_ETIQUETAS) {
    return Response.json({ error: 'Se espera { "etiquetas": ["proyectos", "proyecto:<slug>", "catalogos"] }' }, { status: 400 });
  }

  const validas = [...new Set(pedidas.filter((e): e is string => typeof e === "string" && ETIQUETA.test(e)))];
  const ignoradas = pedidas.filter((e) => typeof e !== "string" || !ETIQUETA.test(e));
  for (const etiqueta of validas) revalidateTag(etiqueta, "max");

  return Response.json({ revalidadas: validas, ignoradas });
}
