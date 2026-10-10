"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Icono, { type NombreIcono } from "@/components/ui/Icono";
import { cn } from "@/lib/utils";

/* ─── Avisos (toasts) ─── */
type Tipo = "ok" | "error" | "info";
interface Toast {
  id: number;
  tipo: Tipo;
  texto: string;
}
interface ToastCtx {
  avisar: (texto: string, tipo?: Tipo) => void;
}
const Ctx = createContext<ToastCtx | null>(null);

const ICONO_AVISO: Record<Tipo, NombreIcono> = { ok: "check", error: "alerta", info: "info" };

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const avisar = useCallback((texto: string, tipo: Tipo = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, tipo, texto }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);
  const valor = useMemo(() => ({ avisar }), [avisar]);
  return (
    <Ctx.Provider value={valor}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "aparece pointer-events-auto flex max-w-md items-center gap-3 rounded-sm px-4 py-3 text-label shadow-lg",
              t.tipo === "error" ? "bg-state-danger text-state-on-danger" : "bg-ink-default text-ink-inverse",
            )}
          >
            <Icono nombre={ICONO_AVISO[t.tipo]} tam={18} />
            {t.texto}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}

/* ─── Modal (dialog nativo: foco atrapado y Escape gratis) ─── */
interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  titulo: string;
  descripcion?: string;
  children?: React.ReactNode;
  acciones?: React.ReactNode;
  ancho?: "sm" | "md" | "lg";
}

export function Modal({ abierto, onCerrar, titulo, descripcion, children, acciones, ancho = "md" }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={ref}
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && onCerrar()}
      aria-label={titulo}
      className={cn(
        "m-auto mb-0 w-full max-w-none rounded-t-lg bg-surface-overlay p-0 text-ink-default shadow-lg backdrop:bg-[oklch(15%_0.01_60/0.45)] sm:mb-auto sm:rounded-lg",
        ancho === "sm" && "sm:max-w-sm",
        ancho === "md" && "sm:max-w-lg",
        ancho === "lg" && "sm:max-w-3xl",
      )}
    >
      {abierto && (
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-display text-title font-medium">{titulo}</h2>
              {descripcion && <p className="mt-1 text-body-small text-ink-muted">{descripcion}</p>}
            </div>
            <button type="button" onClick={onCerrar} className="-m-2 grid h-10 w-10 shrink-0 place-items-center rounded-sm text-ink-muted hover:bg-surface-sunken hover:text-ink-default" aria-label="Cerrar">
              <Icono nombre="cerrar" />
            </button>
          </div>
          {children && <div className="mt-4">{children}</div>}
          {acciones && <div className="mt-6 flex flex-wrap justify-end gap-2">{acciones}</div>}
        </div>
      )}
    </dialog>
  );
}

/* ─── Estados vacíos y carga ─── */
export function EmptyState({
  icono = "carpeta",
  titulo,
  texto,
  accion,
  className,
}: {
  icono?: NombreIcono;
  titulo: string;
  texto?: string;
  accion?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center border-y border-linea px-6 py-14 text-center", className)}>
      <Icono nombre={icono} tam={28} className="text-ink-subtle" />
      <h2 className="mt-4 font-display text-title font-medium text-ink-default">{titulo}</h2>
      {texto && <p className="mt-2 max-w-sm text-body-small text-ink-muted">{texto}</p>}
      {accion && <div className="mt-6">{accion}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("cargando rounded-sm", className)} />;
}

/** Hueco de una lámina mientras llegan los datos. */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden className={className}>
      <div className="cargando aspect-[4/3] shadow-[0_0_0_1px_var(--c-marco)]" />
      <div className="cargando mt-4 h-5 w-3/4 rounded-sm" />
      <div className="cargando mt-2 h-3.5 w-1/2 rounded-sm" />
    </div>
  );
}

/* ─── Paginación ─── */
interface PaginacionProps {
  total: number;
  limit: number;
  offset: number;
  /** Con enlaces reales (Explorar): funciona sin JS y el «atrás» devuelve la página exacta. */
  hrefDe?: (offset: number) => string;
  onChange?: (offset: number) => void;
}

export function Pagination({ total, limit, offset, hrefDe, onChange }: PaginacionProps) {
  const paginas = Math.max(1, Math.ceil(total / limit));
  const actual = Math.floor(offset / limit) + 1;
  if (paginas <= 1) return null;
  const rango = Array.from({ length: paginas }, (_, i) => i + 1).filter((p) => p === 1 || p === paginas || Math.abs(p - actual) <= 1);
  const items: (number | "…")[] = [];
  for (const p of rango) {
    const ultimo = items[items.length - 1];
    if (typeof ultimo === "number" && ultimo + 1 < p) items.push("…");
    items.push(p);
  }

  const celda = "inline-flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-sm px-3 text-label transition-colors";
  const Destino = ({ pagina, children, className, label }: { pagina: number; children: React.ReactNode; className?: string; label?: string }) => {
    const off = (pagina - 1) * limit;
    if (hrefDe) {
      return (
        <Link href={hrefDe(off)} scroll className={className} aria-label={label} aria-current={pagina === actual ? "page" : undefined}>
          {children}
        </Link>
      );
    }
    return (
      <button type="button" onClick={() => onChange?.(off)} className={className} aria-label={label} aria-current={pagina === actual ? "page" : undefined}>
        {children}
      </button>
    );
  };

  return (
    <nav className="flex flex-wrap items-center justify-center gap-1" aria-label="Paginación">
      {actual > 1 ? (
        <Destino pagina={actual - 1} className={cn(celda, "text-ink-default hover:bg-surface-sunken")} label="Página anterior">
          <Icono nombre="chevron-izq" tam={18} />
          <span className="hidden sm:inline">Anterior</span>
        </Destino>
      ) : (
        <span className={cn(celda, "text-ink-subtle")} aria-hidden>
          <Icono nombre="chevron-izq" tam={18} />
          <span className="hidden sm:inline">Anterior</span>
        </span>
      )}
      {items.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-ink-subtle">
            …
          </span>
        ) : (
          <Destino
            key={p}
            pagina={p}
            label={`Página ${p}`}
            className={cn(celda, p === actual ? "bg-ink-default text-ink-inverse" : "text-ink-default hover:bg-surface-sunken")}
          >
            {p}
          </Destino>
        ),
      )}
      {actual < paginas ? (
        <Destino pagina={actual + 1} className={cn(celda, "text-ink-default hover:bg-surface-sunken")} label="Página siguiente">
          <span className="hidden sm:inline">Siguiente</span>
          <Icono nombre="chevron-der" tam={18} />
        </Destino>
      ) : (
        <span className={cn(celda, "text-ink-subtle")} aria-hidden>
          <span className="hidden sm:inline">Siguiente</span>
          <Icono nombre="chevron-der" tam={18} />
        </span>
      )}
    </nav>
  );
}

/* ─── Pestañas: subrayado terracota, sin píldoras ─── */
export function Tabs<T extends string>({ valor, opciones, onChange }: { valor: T; opciones: { id: T; label: string; count?: number }[]; onChange: (v: T) => void }) {
  return (
    <div className="carril -mx-1 flex gap-1 overflow-x-auto border-b border-linea px-1" role="tablist">
      {opciones.map((o) => (
        <button
          key={o.id}
          role="tab"
          type="button"
          aria-selected={valor === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "-mb-px flex min-h-11 items-center gap-2 whitespace-nowrap border-b-2 px-3 text-label transition-colors",
            valor === o.id ? "border-brand-primary text-ink-default" : "border-transparent text-ink-muted hover:text-ink-default",
          )}
        >
          {o.label}
          {o.count !== undefined && <span className="num text-caption text-ink-subtle">{o.count}</span>}
        </button>
      ))}
    </div>
  );
}
