import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  titulo,
  texto,
  accion,
  align = "left",
}: {
  eyebrow?: string;
  titulo: string;
  texto?: string;
  accion?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", align === "center" && "items-center text-center sm:flex-col sm:items-center")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>}
        <h2 className="text-2xl font-bold text-ink-900 sm:text-3xl">{titulo}</h2>
        {texto && <p className="mt-2 text-ink-600">{texto}</p>}
      </div>
      {accion}
    </div>
  );
}

export function Stat({ valor, label, icono }: { valor: string | number; label: string; icono?: React.ReactNode }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      {icono && <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-xl text-brand-600">{icono}</div>}
      <div>
        <p className="font-display text-2xl font-bold text-ink-900">{valor}</p>
        <p className="text-xs text-ink-500">{label}</p>
      </div>
    </div>
  );
}
