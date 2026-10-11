import type { Metadata } from "next";
import Directorio from "@/components/personas/Directorio";
import { RUTA_CARRERAS } from "@/lib/api-catalogos";
import { conservarPaginaSiFaltan, inicialDe, pedirEnServidor } from "@/lib/api-servidor";
import { rutaDirectorio } from "@/lib/api-usuarios";
import type { Carrera, PerfilDirectorio } from "@/lib/tipos";

export const metadata: Metadata = { title: "Docentes", alternates: { canonical: "/docentes" } };

// Página estática que se regenera cada 5 minutos (o al publicar un proyecto, vía /api/revalidar).
export const revalidate = 300;

export default async function DocentesPage() {
  const [inicial, carreras] = await Promise.all([
    inicialDe<PerfilDirectorio[]>(rutaDirectorio({ rol: "DOCENTE" }), ["personas", "proyectos"]),
    pedirEnServidor<Carrera[]>(RUTA_CARRERAS, ["catalogos", "proyectos"]),
  ]);
  conservarPaginaSiFaltan(inicial, carreras);
  return (
    <Directorio
      rol="DOCENTE"
      titulo="Docentes"
      texto="Quienes asesoran y revisan los proyectos antes de publicarlos. En cada perfil están los trabajos que acompañan."
      proyectos={["proyecto", "proyectos"]}
      inicial={inicial}
      carrerasIniciales={carreras}
    />
  );
}
