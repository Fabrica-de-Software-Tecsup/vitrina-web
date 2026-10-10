import { getInitials, cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const tamanos = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-24 w-24 text-3xl",
};

/** Foto redonda o iniciales en Newsreader sobre papel, con línea fina. */
export default function Avatar({ name, src, size = "sm", className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- fotos de Google, sin optimizador
      <img
        src={src}
        alt=""
        title={name}
        referrerPolicy="no-referrer"
        className={cn(tamanos[size], "shrink-0 rounded-full bg-surface-sunken object-cover shadow-[inset_0_0_0_1px_var(--c-linea)]", className)}
      />
    );
  }
  return (
    <span
      className={cn(
        tamanos[size],
        "inline-grid shrink-0 place-items-center rounded-full bg-surface-sunken font-display font-medium text-ink-default shadow-[inset_0_0_0_1px_var(--c-linea)]",
        className,
      )}
      title={name}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}

export function AvatarGroup({ personas, max = 3 }: { personas: { nombre: string; fotoUrl?: string | null }[]; max?: number }) {
  const visibles = personas.slice(0, max);
  const resto = personas.length - visibles.length;
  return (
    <div className="flex items-center -space-x-2" aria-label={personas.map((p) => p.nombre).join(", ")}>
      {visibles.map((p, i) => (
        <Avatar key={`${p.nombre}-${i}`} name={p.nombre} src={p.fotoUrl} size="sm" className="ring-2 ring-surface-default" />
      ))}
      {resto > 0 && (
        <span className="num inline-grid h-8 w-8 place-items-center rounded-full bg-surface-sunken text-caption text-ink-muted ring-2 ring-surface-default">+{resto}</span>
      )}
    </div>
  );
}
