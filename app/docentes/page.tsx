import type { Metadata } from "next";
import Directorio from "@/components/personas/Directorio";

export const metadata: Metadata = { title: "Docentes", alternates: { canonical: "/docentes" } };

export default function DocentesPage() {
  return (
    <Directorio
      rol="DOCENTE"
      titulo="Docentes"
      texto="Quienes asesoran y revisan los proyectos antes de publicarlos. En cada perfil están los trabajos que acompañan."
      proyectos={["proyecto", "proyectos"]}
    />
  );
}
