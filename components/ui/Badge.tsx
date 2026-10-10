import { ESTADO_LABEL, type EstadoProyecto } from "@/lib/tipos";
import { cn } from "@/lib/utils";

/** Punto de estado: hueco en desarrollo, terracota por revisar, verde publicado, gris oculto. */
const puntos: Record<EstadoProyecto, string> = {
  EN_DESARROLLO: "shadow-[inset_0_0_0_1.5px_var(--c-status-en-desarrollo)]",
  POR_REVISAR: "bg-status-por-revisar",
  PUBLICADO: "bg-status-publicado",
  OCULTO: "bg-status-oculto",
};

function Punto({ estado }: { estado: EstadoProyecto }) {
  return <span aria-hidden className={cn("h-[7px] w-[7px] shrink-0 rounded-full", puntos[estado])} />;
}

/** Estado en línea con el texto (listas, cabeceras del panel). */
export function EstadoBadge({ estado, className }: { estado: EstadoProyecto; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm border border-linea px-2 py-0.5 text-caption font-medium text-ink-default", className)}>
      <Punto estado={estado} />
      {ESTADO_LABEL[estado]}
    </span>
  );
}

/** Sello opaco y discreto sobre la esquina de una lámina (Mi espacio). */
export function Sello({ estado, className }: { estado: EstadoProyecto; className?: string }) {
  return (
    <span
      className={cn(
        "absolute left-2 top-2 z-[1] inline-flex h-6 items-center gap-1.5 rounded-sm bg-surface-default px-2 text-caption font-semibold text-ink-default shadow-[0_0_0_0.5px_var(--c-marco)]",
        className,
      )}
    >
      <Punto estado={estado} />
      {ESTADO_LABEL[estado]}
    </span>
  );
}

interface ChipProps {
  children: React.ReactNode;
  /** Color de la categoría: se muestra como un punto, nunca como tinte de fondo. */
  color?: string | null;
  size?: "sm" | "md";
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

/** Etiqueta para tecnologías y categorías: línea fina, sin relleno; activa = tinta. */
export function Chip({ children, color, size = "sm", className, onClick, active }: ChipProps) {
  const base = cn(
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-sm border",
    size === "sm" ? "h-7 px-2.5 text-caption" : "h-8 px-3 text-label",
    active ? "border-ink-default bg-ink-default text-ink-inverse" : "border-linea text-ink-default",
    onClick && !active && "cursor-pointer transition-colors hover:border-ink-muted",
    className,
  );
  const punto = color && !active ? <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} /> : null;
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={base} aria-pressed={active}>
        {punto}
        {children}
      </button>
    );
  }
  return (
    <span className={base}>
      {punto}
      {children}
    </span>
  );
}
