"use client";

import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { useToast } from "@/components/ui/Feedback";

/** Compartir la página pública: hoja del sistema en el teléfono, copiar el enlace en el escritorio. */
export default function CompartirEnlace({ titulo, texto, className }: { titulo: string; texto?: string; className?: string }) {
  const { avisar } = useToast();
  const compartir = async () => {
    const url = window.location.href.split("#")[0];
    try {
      if (navigator.share) {
        await navigator.share({ title: titulo, text: texto, url });
      } else {
        await navigator.clipboard.writeText(url);
        avisar("Enlace copiado");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") avisar("No se pudo compartir el enlace", "error");
    }
  };
  return (
    <Button variant="outline" size="lg" onClick={compartir} icon={<Icono nombre="compartir" tam={18} />} className={className}>
      Compartir
    </Button>
  );
}
