import Icono from "@/components/ui/Icono";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string | null;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  contador?: { actual: number; max: number };
}

/** Envoltorio de campo con etiqueta, ayuda, error y contador opcional. */
export function Field({ label, htmlFor, hint, error, required, children, className, contador }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={htmlFor} className="text-label text-ink-default">
          {label}
          {required && (
            <span className="ml-1 text-state-danger" aria-hidden>
              *
            </span>
          )}
        </label>
        {contador && (
          <span className={cn("num text-caption", contador.actual > contador.max ? "text-state-danger" : "text-ink-subtle")}>
            {contador.actual}/{contador.max}
          </span>
        )}
      </div>
      {children}
      {error ? (
        <p className="text-body-small text-state-danger" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-body-small text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export function Input({ className, ...props }: InputProps) {
  return <input {...props} className={cn("field", className)} />;
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;
export function Textarea({ className, ...props }: TextareaProps) {
  return <textarea {...props} className={cn("field min-h-[110px] resize-y leading-relaxed", className)} />;
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;
export function Select({ className, children, ...props }: SelectProps) {
  return (
    <span className={cn("relative block", className?.includes("w-auto") && "inline-block")}>
      <select {...props} className={cn("field cursor-pointer appearance-none pr-9", className)}>
        {children}
      </select>
      <Icono nombre="chevron-abajo" tam={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted" />
    </span>
  );
}
