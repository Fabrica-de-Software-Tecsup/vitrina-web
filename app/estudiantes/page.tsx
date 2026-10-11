import type { Metadata } from "next";
import Directorio from "@/components/personas/Directorio";
import { RUTA_CARRERAS } from "@/lib/api-catalogos";
import { conservarPaginaSiFaltan, inicialDe, pedirEnServidor } from "@/lib/api-servidor";
import { rutaDirectorio } from "@/lib/api-usuarios";
import type { Carrera, PerfilDirectorio } from "@/lib/tipos";

export const metadata: Metadata = { title: "Estudiantes", alternates: { canonical: "/estudiantes" } };

// Página estática que se regenera cada 5 minutos (o al publicar un proyecto, vía /api/revalidar).
export const revalidate = 300;

export default async function EstudiantesPage() {
  const [inicial, carreras] = await Promise.all([
    inicialDe<PerfilDirectorio[]>(rutaDirectorio({ rol: "ALUMNO" }), ["personas", "proyectos"]),
    pedirEnServidor<Carrera[]>(RUTA_CARRERAS, ["catalogos", "proyectos"]),
  ]);
  conservarPaginaSiFaltan(inicial, carreras);
  return (
    <Directorio
      rol="ALUMNO"
      titulo="Estudiantes"
      texto="Quiénes hicieron los proyectos, su carrera y las tecnologías que usan. Para contactarlos necesitas iniciar sesión."
      proyectos={["proyecto", "proyectos"]}
      inicial={inicial}
      carrerasIniciales={carreras}
    />
  );
}
