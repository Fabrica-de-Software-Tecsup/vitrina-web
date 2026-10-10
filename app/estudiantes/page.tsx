import type { Metadata } from "next";
import Directorio from "@/components/personas/Directorio";

export const metadata: Metadata = { title: "Estudiantes", alternates: { canonical: "/estudiantes" } };

export default function EstudiantesPage() {
  return (
    <Directorio
      rol="ALUMNO"
      titulo="Estudiantes"
      texto="Quiénes hicieron los proyectos, su carrera y las tecnologías que usan. Para contactarlos necesitas iniciar sesión."
      proyectos={["proyecto", "proyectos"]}
    />
  );
}
