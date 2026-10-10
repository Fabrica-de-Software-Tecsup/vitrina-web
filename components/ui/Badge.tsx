import { ESTADO_LABEL, type EstadoProyecto } from "@/lib/tipos";
import { cn } from "@/lib/utils";

const estilos: Record<EstadoProyecto, string> = {
  PUBLICADO: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  EN_DESARROLLO: "bg-amber-50 text-amber-700 ring-amber-200",
  POR_REVISAR: "bg-brand-50 text-brand-700 ring-brand-200",
  OCULTO: "bg-ink-100 text-ink-600 ring-ink-200",
};
const puntos: Record<EstadoProyecto, string> = {
  PUBLICADO: "bg-emerald-500",
  EN_DESARROLLO: "bg-amber-500",
  POR_REVISAR: "bg-brand-500",
  OCULTO: "bg-ink-400",
};

export function EstadoBadge({ estado, className }: { estado: EstadoProyecto; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset",
        estilos[estado],
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", puntos[estado])} />
      {ESTADO_LABEL[estado]}
    </span>
  );
}

interface ChipProps {
  children: React.ReactNode;
  color?: string | null;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

/** Etiqueta para tecnologias, categorias y carreras. Si recibe `color` lo usa como tinte. */
export function Chip({ children, color, size = "sm", className, onClick, active }: ChipProps) {
  const estilo = color ? { backgroundColor: `${color}1a`, color, borderColor: `${color}40` } : undefined;
  const base = cn(
    "inline-flex items-center rounded-full border font-medium whitespace-nowrap",
    size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
    !color && !active && "border-ink-200 bg-ink-50 text-ink-700",
    active && "border-brand-600 bg-brand-600 text-white",
    onClick && "cursor-pointer transition-colors hover:border-brand-400",
    className,
  );
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={base} style={active ? undefined : estilo}>
        {children}
      </button>
    );
  }
  return (
    <span className={base} style={estilo}>
      {children}
    </span>
  );
}
