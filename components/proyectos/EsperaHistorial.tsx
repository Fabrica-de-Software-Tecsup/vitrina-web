"use client";

import { use } from "react";

/*
  Atrás/Adelante del navegador: React vacía las transiciones nacidas de `popstate` de forma síncrona
  (para restaurar el scroll al instante) y en ese camino no arranca View Transitions, así que la lámina
  no regresaría a su sitio. Este componente suspende una sola vez, un tick, cuando se renderiza dentro
  de un evento popstate: el commit sale entonces por el carril normal de transición y el morph se forma.
  Fuera de popstate devuelve una promesa ya resuelta (use() siempre se llama, como exige React).
  Debe ir fuera de cualquier Suspense recién montado, o React mostraría su fallback.
*/
type Rastreada = Promise<void> & { status?: "pending" | "fulfilled"; value?: undefined };

function resuelta(): Rastreada {
  const p: Rastreada = Promise.resolve();
  p.status = "fulfilled";
  p.value = undefined;
  return p;
}

const LISTA = resuelta();
const pendientes = new WeakMap<Event, Rastreada>();

function esperaDe(evento: Event): Rastreada {
  let p = pendientes.get(evento);
  if (!p) {
    p = new Promise<void>((r) => setTimeout(r, 0)) as Rastreada;
    p.status = "pending";
    p.then(() => {
      p!.status = "fulfilled";
    });
    pendientes.set(evento, p);
  }
  return p;
}

export default function EsperaHistorial() {
  let promesa = LISTA;
  if (typeof window !== "undefined") {
    const evento = window.event;
    if (evento?.type === "popstate" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) promesa = esperaDe(evento);
  }
  use(promesa as Promise<void>);
  return null;
}
