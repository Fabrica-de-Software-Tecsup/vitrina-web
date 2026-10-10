import { getInitials, getAvatarColor, cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const tamanos = {
  xs: "h-6 w-6 text-[9px]",
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-14 w-14 text-sm",
  xl: "h-24 w-24 text-2xl",
};

export default function Avatar({ name, src, size = "sm", className }: AvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- fotos de Google, sin optimizador
      <img
        src={src}
        alt={name}
        title={name}
        referrerPolicy="no-referrer"
        className={cn(tamanos[size], "shrink-0 rounded-full object-cover ring-2 ring-white", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        tamanos[size],
        getAvatarColor(name),
        "flex shrink-0 items-center justify-center rounded-full font-bold text-white ring-2 ring-white",
        className,
      )}
      title={name}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}

export function AvatarGroup({ personas, max = 3 }: { personas: { nombre: string; fotoUrl?: string | null }[]; max?: number }) {
  const visibles = personas.slice(0, max);
  const resto = personas.length - visibles.length;
  return (
    <div className="flex items-center -space-x-2">
      {visibles.map((p, i) => (
        <Avatar key={`${p.nombre}-${i}`} name={p.nombre} src={p.fotoUrl} size="sm" />
      ))}
      {resto > 0 && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-100 text-[10px] font-semibold text-ink-600 ring-2 ring-white">
          +{resto}
        </span>
      )}
    </div>
  );
}
