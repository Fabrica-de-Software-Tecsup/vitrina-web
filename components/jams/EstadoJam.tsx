"use client";

import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { diaLima, faseDe, horaLima, type FaseJam as Fase, type Jam } from "@/lib/api-jams";
import { restante, useAhora } from "./reloj";

/** Cuenta atrás hasta el cierre y la llamada a subir el proyecto mientras la jam está abierta. */
export default function EstadoJam({ jam, faseInicial }: { jam: Jam; faseInicial: Fase }) {
  const ahora = useAhora();
  // Hasta hidratar se usa la fase que calculó el servidor: el HTML y el primer render coinciden.
  const fase = ahora ? faseDe(jam, ahora) : faseInicial;
  const cierre = Date.parse(jam.cierreEn);

  if (fase === "cerrada") {
    return (
      <div className="flex items-start gap-3">
        <Icono nombre="check" tam={22} className="mt-1 shrink-0 text-ink-muted" />
        <div>
          <p className="font-display text-title font-medium text-ink-default">Envíos cerrados</p>
          <p className="mt-1 text-body-small text-ink-muted">
            Cerraron el {diaLima(jam.cierreEn)} a las {horaLima(jam.cierreEn)}. Gracias a todos los equipos.
          </p>
        </div>
      </div>
    );
  }

  if (fase === "antes") {
    return (
      <div className="flex items-start gap-3">
        <Icono nombre="reloj" tam={22} className="mt-1 shrink-0 text-ink-muted" />
        <div>
          <p className="font-display text-title font-medium text-ink-default">Los envíos abren pronto</p>
          <p className="mt-1 text-body-small text-ink-muted">
            Desde el {diaLima(jam.inicioEn)} a las {horaLima(jam.inicioEn)}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-body-small text-ink-muted">Los envíos cierran en</p>
        <p className="num mt-1 font-display text-[2.5rem] font-normal leading-none tracking-tight text-ink-default sm:text-[3rem]" aria-live="off">
          {ahora ? restante(cierre - ahora) : horaLima(jam.cierreEn)}
        </p>
        <p className="mt-2 text-body-small text-ink-muted">
          {diaLima(jam.cierreEn)}, {horaLima(jam.cierreEn)}
        </p>
      </div>
      <Button href={`/jams/${jam.slug}/enviar`} size="lg" icon={<Icono nombre="subir" tam={18} />} className="w-full sm:w-auto">
        Subir nuestro proyecto
      </Button>
    </div>
  );
}
