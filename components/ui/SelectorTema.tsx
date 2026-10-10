"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import Icono, { type NombreIcono } from "@/components/ui/Icono";
import { aplicarTema, leerTema, suscribirTema, type Tema } from "@/lib/tema";
import { cn } from "@/lib/utils";

const OPCIONES: { id: Tema; label: string; icono: NombreIcono }[] = [
  { id: "sistema", label: "Sistema", icono: "sistema" },
  { id: "claro", label: "Claro", icono: "sol" },
  { id: "oscuro", label: "Oscuro", icono: "luna" },
];

function useTema(): Tema {
  return useSyncExternalStore(suscribirTema, leerTema, () => "sistema");
}

/** Acceso rápido en la cabecera: un botón con icono que abre las tres opciones. */
export function SelectorTemaMenu({ className }: { className?: string }) {
  const tema = useTema();
  const [abierto, setAbierto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const id = useId();
  const actual = OPCIONES.find((o) => o.id === tema) ?? OPCIONES[0];

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => {
      if (!raiz.current?.contains(e.target as Node)) setAbierto(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  return (
    <div ref={raiz} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setAbierto((a) => !a)}
        aria-expanded={abierto}
        aria-controls={id}
        aria-label={`Tema: ${actual.label}. Cambiar tema`}
        className="grid h-10 w-10 place-items-center rounded-md text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink-default"
      >
        <Icono nombre={actual.icono} />
      </button>
      {abierto && (
        <div
          id={id}
          role="group"
          aria-label="Tema"
          className="aparece absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-linea bg-surface-overlay p-1 shadow-md"
        >
          {OPCIONES.map((o) => (
            <button
              key={o.id}
              type="button"
              aria-pressed={tema === o.id}
              onClick={() => {
                aplicarTema(o.id);
                setAbierto(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-sm px-3 py-2 text-left text-label transition-colors hover:bg-surface-sunken",
                tema === o.id ? "text-ink-default" : "text-ink-muted",
              )}
            >
              <Icono nombre={o.icono} tam={18} />
              <span className="flex-1">{o.label}</span>
              {tema === o.id && <Icono nombre="check" tam={16} className="text-brand-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Control segmentado para la sección Cuenta del panel. */
export function SelectorTemaSegmentado() {
  const tema = useTema();
  return (
    <fieldset>
      <legend className="text-label text-ink-default">Tema</legend>
      <p className="mt-1 text-body-small text-ink-muted">Se guarda en este dispositivo.</p>
      <div className="mt-3 inline-flex rounded-md border border-surface-outline p-0.5">
        {OPCIONES.map((o) => (
          <label
            key={o.id}
            className={cn(
              "flex min-h-10 cursor-pointer items-center gap-2 rounded-sm px-3.5 text-label transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-primary",
              tema === o.id ? "bg-ink-default text-ink-inverse" : "text-ink-muted hover:text-ink-default",
            )}
          >
            <input type="radio" name="tema" value={o.id} checked={tema === o.id} onChange={() => aplicarTema(o.id)} className="sr-only" />
            <Icono nombre={o.icono} tam={18} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
