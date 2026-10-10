import Link from "next/link";
import { cn } from "@/lib/utils";

type Variante = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Tamano = "sm" | "md" | "lg";

interface Props {
  children?: React.ReactNode;
  variant?: Variante;
  size?: Tamano;
  href?: string;
  /** Abre el enlace en otra pestaña (enlaces externos). */
  externo?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  "aria-label"?: string;
}

const variantes: Record<Variante, string> = {
  primary: "bg-brand-primary text-brand-on-primary hover:bg-[color-mix(in_oklch,var(--c-brand-primary)_88%,var(--c-ink-default))]",
  secondary: "bg-ink-default text-ink-inverse hover:bg-[color-mix(in_oklch,var(--c-ink-default)_86%,var(--c-surface-default))]",
  outline: "border border-surface-outline text-ink-default hover:border-ink-muted hover:bg-surface-sunken",
  ghost: "text-ink-default hover:bg-surface-sunken",
  danger: "bg-state-danger text-state-on-danger hover:bg-[color-mix(in_oklch,var(--c-state-danger)_86%,var(--c-ink-default))]",
};

const tamanos: Record<Tamano, string> = {
  sm: "h-9 px-3 text-label gap-1.5",
  md: "h-10 px-4 text-[0.9375rem] font-medium gap-2",
  lg: "h-12 px-5 text-base font-medium gap-2",
};

/** Botón sobrio: un solo relleno (terracota) para la acción principal; el resto con línea o sin fondo. */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  externo,
  type = "button",
  onClick,
  disabled,
  loading,
  className,
  icon,
  title,
  "aria-label": ariaLabel,
}: Props) {
  const clases = cn(
    "inline-flex select-none items-center justify-center whitespace-nowrap rounded-sm transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.98]",
    variantes[variant],
    tamanos[size],
    (disabled || loading) && "pointer-events-none opacity-50",
    className,
  );
  const contenido = (
    <>
      {loading ? <Spinner /> : icon}
      {children}
    </>
  );
  if (href && !disabled) {
    if (externo) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={clases} title={title} aria-label={ariaLabel}>
          {contenido}
        </a>
      );
    }
    return (
      <Link href={href} className={clases} title={title} aria-label={ariaLabel}>
        {contenido}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={clases} title={title} aria-label={ariaLabel} aria-busy={loading || undefined}>
      {contenido}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" className="opacity-25" />
      <path d="M21 12a9 9 0 0 1-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
