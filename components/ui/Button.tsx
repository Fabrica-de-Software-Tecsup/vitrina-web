import Link from "next/link";
import { cn } from "@/lib/utils";

type Variante = "primary" | "secondary" | "outline" | "ghost" | "danger" | "white";
type Tamano = "sm" | "md" | "lg";

interface Props {
  children: React.ReactNode;
  variant?: Variante;
  size?: Tamano;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  icon?: React.ReactNode;
  title?: string;
}

const variantes: Record<Variante, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-600/20",
  secondary: "bg-ink-900 text-white hover:bg-ink-800",
  outline: "border border-ink-200 bg-white text-ink-800 hover:border-brand-400 hover:text-brand-700",
  ghost: "text-ink-700 hover:bg-ink-100",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  white: "bg-white text-brand-800 hover:bg-brand-50 shadow-sm",
};

const tamanos: Record<Tamano, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  type = "button",
  onClick,
  disabled,
  loading,
  className,
  icon,
  title,
}: Props) {
  const clases = cn(
    "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 whitespace-nowrap select-none",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25",
    variantes[variant],
    tamanos[size],
    (disabled || loading) && "opacity-50 pointer-events-none",
    className,
  );
  const contenido = (
    <>
      {loading ? <Spinner /> : icon}
      {children}
    </>
  );
  if (href && !disabled) {
    return (
      <Link href={href} className={clases} title={title}>
        {contenido}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading} className={clases} title={title}>
      {contenido}
    </button>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn("h-4 w-4 animate-spin", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
