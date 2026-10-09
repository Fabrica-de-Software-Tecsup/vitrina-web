"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSesion } from "@/components/sesion/SesionProvider";
import { Container } from "@/components/ui/Section";
import { Skeleton } from "@/components/ui/Feedback";

/** Zona privada: exige sesion y, para alumnos, haber elegido carrera. */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { usuario, cargando } = useSesion();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (cargando) return;
    if (!usuario) router.replace(`/auth/login?next=${encodeURIComponent(pathname)}`);
    else if (!usuario.perfilCompleto && usuario.rol === "ALUMNO") router.replace("/onboarding");
  }, [usuario, cargando, router, pathname]);

  if (cargando || !usuario) {
    return (
      <Container className="py-10">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-6 h-40" />
      </Container>
    );
  }
  return <>{children}</>;
}
