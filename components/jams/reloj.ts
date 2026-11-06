"use client";

import { useSyncExternalStore } from "react";

/*
  Un único reloj de un segundo para toda la página. En el servidor (y en el primer render del navegador) vale 0:
  quien lo usa pinta la fecha fija y el contador aparece al hidratar, sin desajustes.
*/
let ahora = 0;
let temporizador: ReturnType<typeof setInterval> | undefined;
const oyentes = new Set<() => void>();

function suscribir(oyente: () => void) {
  oyentes.add(oyente);
  if (!temporizador) {
    ahora = Date.now();
    temporizador = setInterval(() => {
      ahora = Date.now();
      oyentes.forEach((o) => o());
    }, 1000);
  }
  return () => {
    oyentes.delete(oyente);
    if (!oyentes.size && temporizador) {
      clearInterval(temporizador);
      temporizador = undefined;
    }
  };
}

const instantanea = () => {
  if (!ahora) ahora = Date.now();
  return ahora;
};

export const useAhora = () => useSyncExternalStore(suscribir, instantanea, () => 0);

/** «2 d 4 h», «1:05:09» o «4:09». */
export function restante(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const seg = s % 60;
  const dos = (n: number) => String(n).padStart(2, "0");
  if (d > 0) return `${d} d ${h} h`;
  if (h > 0) return `${h}:${dos(m)}:${dos(seg)}`;
  return `${m}:${dos(seg)}`;
}
