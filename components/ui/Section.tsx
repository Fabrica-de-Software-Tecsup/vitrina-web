import { cn } from "@/lib/utils";

/** Columna general del sitio: 1280 px de máximo con márgenes de 16/32/80 px. */
export function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[90rem] px-4 sm:px-8 xl:px-20", className)}>{children}</div>;
}

/** Encabezado de sección: título en Newsreader, texto opcional y acción a la derecha. Sin etiquetas sobre el título. */
export function SectionHeading({ titulo, texto, accion, className }: { titulo: string; texto?: string; accion?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="max-w-2xl">
        <h2 className="seccion-t text-ink-default">{titulo}</h2>
        {texto && <p className="mt-2 text-ink-muted">{texto}</p>}
      </div>
      {accion}
    </div>
  );
}

/** Cifra del panel (va dentro de un <dl>): número tabular y etiqueta, separados por línea fina (sin caja ni icono). */
export function Stat({ valor, label }: { valor: string | number; label: string }) {
  return (
    <div className="flex flex-col-reverse border-t border-linea pt-3">
      <dt className="mt-0.5 text-body-small text-ink-muted">{label}</dt>
      <dd className="num font-display text-headline text-ink-default">{valor}</dd>
    </div>
  );
}
