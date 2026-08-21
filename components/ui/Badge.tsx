const variantStyles: Record<string, string> = {
  daw: "bg-tecsup-cyan/15 text-tecsup-cyan",
  iot: "bg-tecsup-purple/15 text-tecsup-purple",
  Publicado: "bg-tecsup-green/15 text-tecsup-green",
  PUBLICADO: "bg-tecsup-green/15 text-tecsup-green",
  "En Desarrollo": "bg-amber-100 text-amber-700",
  EN_DESARROLLO: "bg-amber-100 text-amber-700",
  "Por Revisar": "bg-tecsup-info/15 text-tecsup-info",
  POR_REVISAR: "bg-tecsup-info/15 text-tecsup-info",
  Bloqueado: "bg-tecsup-red/15 text-tecsup-red",
  BLOQUEADO: "bg-tecsup-red/15 text-tecsup-red",
  Oculto: "bg-gray-100 text-gray-500",
  OCULTO: "bg-gray-100 text-gray-500",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: string;
  className?: string;
}

export default function Badge({ children, variant = "Publicado", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${variantStyles[variant] ?? "bg-gray-100 text-gray-500"} ${className}`}
    >
      {children}
    </span>
  );
}
