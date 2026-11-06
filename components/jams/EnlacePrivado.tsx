"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { useToast } from "@/components/ui/Feedback";

/** El enlace privado de edición, a la vista, con copiar y compartir (la hoja del sistema manda a WhatsApp o al correo). */
export default function EnlacePrivado({ url, titulo }: { url: string; titulo: string }) {
  const { avisar } = useToast();
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      avisar("Enlace copiado");
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      avisar("No se pudo copiar: mantén pulsado el enlace y cópialo a mano", "error");
    }
  };

  const compartir = async () => {
    try {
      if (navigator.share) await navigator.share({ title: `Editar «${titulo}»`, text: `Enlace privado para editar «${titulo}» en Vitrina:`, url });
      else await copiar();
    } catch (e) {
      if ((e as Error).name !== "AbortError") avisar("No se pudo compartir", "error");
    }
  };

  return (
    <div>
      <p className="select-all break-all rounded-md border border-surface-outline bg-surface-raised px-4 py-3 font-mono text-body-small leading-relaxed text-ink-default" data-enlace-privado>
        {url}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:flex">
        <Button onClick={copiar} size="lg" icon={<Icono nombre={copiado ? "check" : "copiar"} tam={18} />}>
          {copiado ? "Copiado" : "Copiar enlace"}
        </Button>
        <Button onClick={compartir} size="lg" variant="outline" icon={<Icono nombre="compartir" tam={18} />}>
          Enviármelo
        </Button>
      </div>
    </div>
  );
}
