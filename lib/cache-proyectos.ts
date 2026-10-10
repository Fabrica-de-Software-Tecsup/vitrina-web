import type { Paginado, Proyecto } from "./tipos";

/*
  Caché en memoria del navegador (nunca en el servidor: ahí sería compartida entre usuarios).
  Sirve al gesto de firma: la lámina y la cabecera del detalle tienen que estar en el mismo commit
  de la navegación. Con los datos ya en memoria, el detalle pinta su portada sin esperar a la red,
  y al volver atrás Explorar pinta su retícula al instante para que la lámina regrese a su sitio.
*/
const enNavegador = typeof window !== "undefined";
const porSlug = new Map<string, Proyecto>();
const listas = new Map<string, Paginado<Proyecto>>();

export function recordarProyectos(items: Proyecto[]) {
  if (!enNavegador) return;
  for (const p of items) porSlug.set(p.slug, p);
}

export function proyectoEnCache(slug: string): Proyecto | undefined {
  return enNavegador ? porSlug.get(slug) : undefined;
}

export function recordarLista(clave: string, datos: Paginado<Proyecto>) {
  if (!enNavegador) return;
  listas.set(clave, datos);
  recordarProyectos(datos.items);
  if (listas.size > 30) listas.delete(listas.keys().next().value!);
}

export function listaEnCache(clave: string): Paginado<Proyecto> | undefined {
  return enNavegador ? listas.get(clave) : undefined;
}

let explorar = "/proyectos";

/** Última URL de Explorar (con filtros y página), para que «Explorar» en el detalle vuelva a la misma retícula. */
export function recordarExplorar(url: string) {
  if (enNavegador) explorar = url;
}

export function urlExplorar(): string {
  return explorar;
}
