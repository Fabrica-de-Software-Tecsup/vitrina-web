"use client";

import { startTransition, useEffect, useState } from "react";
import { enDisco, enMemoria, guardarEnCache, pedirPublico } from "./cache-swr";

interface Opciones<T> {
  /** Datos secundarios (catálogos, cifras): nunca encienden el aviso de servidor dormido. */
  silencioso?: boolean;
  /** Si devuelve false, la respuesta no se escribe en disco (depende de la sesión). */
  persistir?: (datos: T) => boolean;
}

export interface DatoPublico<T> {
  /** Lo último que se puede enseñar; puede ser de la ruta anterior mientras llega la nueva. */
  datos: T | null;
  /** Ruta a la que pertenecen `datos`. */
  rutaDeDatos: string | null;
  /** true cuando `datos` corresponde a la ruta pedida. */
  actualizado: boolean;
  /** Se agotaron los reintentos y no hay nada que enseñar para esta ruta. */
  fallo: boolean;
  reintentar: () => void;
}

/**
 * Un GET público con pintado inmediato y revalidación en segundo plano. Orden de preferencia para pintar:
 * los datos que trae el HTML del servidor (`inicial`), lo visto en esta sesión (memoria) y, tras hidratar,
 * la última respuesta guardada en disco. Después se pide siempre la versión nueva.
 */
export function useDatoPublico<T>(ruta: string, inicial: T | null, { silencioso = false, persistir }: Opciones<T> = {}): DatoPublico<T> {
  const [estado, setEstado] = useState<{ ruta: string; datos: T } | null>(() => {
    const d = inicial ?? enMemoria<T>(ruta);
    return d == null ? null : { ruta, datos: d };
  });
  const [fallida, setFallida] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  // Ruta nueva (otros filtros, otra página) con datos ya disponibles: se adoptan en este mismo render,
  // dentro de la transición de la navegación.
  if (estado?.ruta !== ruta) {
    const d = inicial ?? enMemoria<T>(ruta);
    if (d != null) setEstado({ ruta, datos: d });
  }

  useEffect(() => {
    let vigente = true;
    const control = new AbortController();
    if (inicial != null && enMemoria(ruta) === undefined) guardarEnCache(ruta, inicial, persistir ? persistir(inicial) : true);
    let visible = enMemoria(ruta) !== undefined;

    void (async () => {
      if (!visible) {
        // Fuera del cuerpo del efecto: el primer render ya coincidió con el del servidor.
        const guardado = await Promise.resolve(enDisco<T>(ruta));
        if (!vigente) return;
        if (guardado !== undefined) {
          visible = true;
          startTransition(() => setEstado({ ruta, datos: guardado }));
        }
      }
      try {
        const datos = await pedirPublico<T>(ruta, { avisar: !visible && !silencioso, signal: control.signal, persistir });
        if (!vigente) return;
        // En una transición: la retícula vieja se funde con la nueva (<ViewTransition> con key).
        startTransition(() => {
          setFallida(null);
          setEstado((previo) => (previo?.ruta === ruta && JSON.stringify(previo.datos) === JSON.stringify(datos) ? previo : { ruta, datos }));
        });
      } catch {
        if (vigente && !visible) setFallida(ruta);
      }
    })();

    return () => {
      vigente = false;
      control.abort();
    };
    // `persistir` y `silencioso` son constantes de cada uso; no deben relanzar la petición.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta, inicial, intento]);

  return {
    datos: estado?.datos ?? null,
    rutaDeDatos: estado?.ruta ?? null,
    actualizado: estado?.ruta === ruta,
    fallo: fallida === ruta && estado?.ruta !== ruta,
    reintentar: () => {
      setFallida(null);
      setIntento((n) => n + 1);
    },
  };
}
