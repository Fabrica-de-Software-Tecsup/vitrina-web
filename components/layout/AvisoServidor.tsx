"use client";

import { useSyncExternalStore } from "react";
import { hayEsperaLarga, suscribirEspera } from "@/lib/cache-swr";

/**
 * Aviso discreto bajo la cabecera cuando el visitante lleva más de 4 s esperando datos: el servidor del API
 * se apaga si nadie lo usa y tarda en volver. La región `status` está siempre en el DOM para que el lector
 * de pantalla anuncie el texto cuando aparece; sin espera no ocupa sitio.
 */
export default function AvisoServidor() {
  const esperando = useSyncExternalStore(suscribirEspera, hayEsperaLarga, () => false);
  return (
    <div role="status" aria-live="polite" className="sticky top-[65px] z-40 lg:top-[73px]">
      {esperando && (
        <p className="aparece flex items-center justify-center gap-2.5 border-b border-linea bg-surface-sunken px-4 py-2 text-center text-body-small text-ink-muted">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-brand-primary motion-safe:animate-pulse" />
          Despertando el servidor, unos segundos…
        </p>
      )}
    </div>
  );
}
