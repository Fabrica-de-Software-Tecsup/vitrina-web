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
        <label htmlFor={htmlFor} className="text-sm font-semibold text-ink-800">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </label>
        {contador && (
          <span className={cn("text-[11px] tabular-nums", contador.actual > contador.max ? "text-rose-500" : "text-ink-400")}>
            {contador.actual}/{contador.max}
          </span>
        )}
      </div>
      {children}
      {error ? <p className="text-xs text-rose-600">{error}</p> : hint ? <p className="text-xs text-ink-500">{hint}</p> : null}
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
    <select
      {...props}
      className={cn("field appearance-none pr-9", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2364748b' stroke-width='2' viewBox='0 0 24 24'><path d='m6 9 6 6 6-6'/></svg>\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 0.75rem center",
        backgroundSize: "16px 16px",
      }}
    >
      {children}
    </select>
  );
}
