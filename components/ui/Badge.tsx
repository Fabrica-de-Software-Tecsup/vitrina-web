type BadgeVariant = "daw" | "iot" | "Publicado" | "En Desarrollo" | "Por Revisar" | "Oculto";

const variantStyles: Record<BadgeVariant, string> = {
  daw: "bg-tecsup-cyan/15 text-tecsup-cyan",
  iot: "bg-tecsup-purple/15 text-tecsup-purple",
  Publicado: "bg-tecsup-green/15 text-tecsup-green",
  "En Desarrollo": "bg-amber-100 text-amber-700",
  "Por Revisar": "bg-tecsup-info/15 text-tecsup-info",
  Oculto: "bg-gray-200 text-gray-500",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export default function Badge({ children, variant = "Publicado" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}