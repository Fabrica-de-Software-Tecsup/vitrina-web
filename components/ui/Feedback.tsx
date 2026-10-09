"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

/* ─── Toasts ─── */
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
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium shadow-lift animate-fade-up",
              t.tipo === "ok" && "bg-ink-900 text-white",
              t.tipo === "error" && "bg-rose-600 text-white",
              t.tipo === "info" && "bg-white text-ink-800 ring-1 ring-ink-200",
            )}
          >
            <span aria-hidden>{t.tipo === "ok" ? "✓" : t.tipo === "error" ? "!" : "i"}</span>
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

/* ─── Modal ─── */
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
  if (!abierto) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm" onClick={onCerrar} />
      <div
        className={cn(
          "relative w-full rounded-3xl bg-white p-6 shadow-lift animate-fade-up",
          ancho === "sm" && "max-w-sm",
          ancho === "md" && "max-w-lg",
          ancho === "lg" && "max-w-2xl",
        )}
      >
        <h3 className="text-lg font-bold text-ink-900">{titulo}</h3>
        {descripcion && <p className="mt-1 text-sm text-ink-600">{descripcion}</p>}
        {children && <div className="mt-4">{children}</div>}
        {acciones && <div className="mt-6 flex flex-wrap justify-end gap-2">{acciones}</div>}
      </div>
    </div>
  );
}

/* ─── Estados vacios y carga ─── */
export function EmptyState({
  icono = "✦",
  titulo,
  texto,
  accion,
  className,
}: {
  icono?: React.ReactNode;
  titulo: string;
  texto?: string;
  accion?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("card flex flex-col items-center px-6 py-14 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-600">{icono}</div>
      <h3 className="mt-4 text-base font-bold text-ink-900">{titulo}</h3>
      {texto && <p className="mt-1 max-w-sm text-sm text-ink-500">{texto}</p>}
      {accion && <div className="mt-5">{accion}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-xl bg-ink-200/70", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-[16/10] rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

/* ─── Paginacion ─── */
export function Pagination({ total, limit, offset, onChange }: { total: number; limit: number; offset: number; onChange: (offset: number) => void }) {
  const paginas = Math.max(1, Math.ceil(total / limit));
  const actual = Math.floor(offset / limit) + 1;
  if (paginas <= 1) return null;
  const rango = Array.from({ length: paginas }, (_, i) => i + 1).filter((p) => p === 1 || p === paginas || Math.abs(p - actual) <= 1);
  const items: (number | "…")[] = [];
  for (const p of rango) {
    if (items.length && typeof items[items.length - 1] === "number" && (items[items.length - 1] as number) + 1 < p) items.push("…");
    items.push(p);
  }
  return (
    <nav className="flex items-center justify-center gap-1" aria-label="Paginación">
      <button
        type="button"
        onClick={() => onChange((actual - 2) * limit)}
        disabled={actual === 1}
        className="h-9 rounded-full px-3 text-sm text-ink-600 hover:bg-ink-100 disabled:opacity-40"
      >
        ← Anterior
      </button>
      {items.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="px-1 text-ink-400">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange((p - 1) * limit)}
            aria-current={p === actual ? "page" : undefined}
            className={cn("h-9 min-w-9 rounded-full px-3 text-sm font-medium", p === actual ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-100")}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        onClick={() => onChange(actual * limit)}
        disabled={actual === paginas}
        className="h-9 rounded-full px-3 text-sm text-ink-600 hover:bg-ink-100 disabled:opacity-40"
      >
        Siguiente →
      </button>
    </nav>
  );
}

/* ─── Tabs ─── */
export function Tabs<T extends string>({ valor, opciones, onChange }: { valor: T; opciones: { id: T; label: string; count?: number }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-full bg-ink-100 p-1" role="tablist">
      {opciones.map((o) => (
        <button
          key={o.id}
          role="tab"
          type="button"
          aria-selected={valor === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
            valor === o.id ? "bg-white text-ink-900 shadow-sm" : "text-ink-600 hover:text-ink-900",
          )}
        >
          {o.label}
          {o.count !== undefined && (
            <span className={cn("rounded-full px-1.5 text-[11px]", valor === o.id ? "bg-brand-100 text-brand-700" : "bg-ink-200 text-ink-600")}>{o.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
