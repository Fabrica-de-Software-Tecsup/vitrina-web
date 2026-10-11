import PortadaCliente from "@/components/portada/PortadaCliente";
import { RUTA_DESTACADO, RUTA_RECIENTES } from "@/lib/api-proyectos";
import { conservarPaginaSiFaltan, pedirEnServidor } from "@/lib/api-servidor";
import type { Paginado, Proyecto } from "@/lib/tipos";

// Página estática que se regenera cada 5 minutos (o al publicar un proyecto, vía /api/revalidar).
export const revalidate = 300;

/** Portada: el destacado y los recién publicados llegan en el HTML, servido desde la caché aunque el API duerma. */
export default async function PortadaPage() {
  const [destacado, recientes] = await Promise.all([
    pedirEnServidor<Paginado<Proyecto>>(RUTA_DESTACADO, ["proyectos"]),
    pedirEnServidor<Paginado<Proyecto>>(RUTA_RECIENTES, ["proyectos"]),
  ]);
  conservarPaginaSiFaltan(destacado, recientes);
  return <PortadaCliente inicial={{ destacado, recientes }} />;
}
