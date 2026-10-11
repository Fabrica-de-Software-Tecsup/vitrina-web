import CarrerasCliente from "@/components/carreras/CarrerasCliente";
import { RUTA_CARRERAS } from "@/lib/api-catalogos";
import { conservarPaginaSiFaltan, pedirEnServidor } from "@/lib/api-servidor";
import type { Carrera } from "@/lib/tipos";

// Página estática que se regenera cada 5 minutos (o al publicar un proyecto, vía /api/revalidar).
export const revalidate = 300;

export default async function CarrerasPage() {
  const carreras = await pedirEnServidor<Carrera[]>(RUTA_CARRERAS, ["catalogos", "proyectos"]);
  conservarPaginaSiFaltan(carreras);
  return <CarrerasCliente inicial={carreras} />;
}
