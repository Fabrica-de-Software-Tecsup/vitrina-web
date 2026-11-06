import Icono from "@/components/ui/Icono";
import { ErrorJam } from "@/lib/api-jams";

/** Error del API en castellano, con la lista de campos a revisar si la validación devolvió varios. */
export default function AvisoError({ error }: { error: unknown }) {
  if (!error) return null;
  const mensaje = error instanceof Error ? error.message : "Algo salió mal. Vuelve a intentarlo.";
  const detalles = error instanceof ErrorJam ? error.detalles : [];
  return (
    <div role="alert" tabIndex={-1} className="flex gap-3 rounded-md border border-state-danger bg-surface-raised px-4 py-3 text-body-small text-ink-default outline-none">
      <Icono nombre="alerta" tam={20} className="mt-px shrink-0 text-state-danger" />
      <div>
        <p className="font-medium">{mensaje}</p>
        {detalles.length > 0 && (
          <ul className="mt-1 list-disc space-y-0.5 pl-4 text-ink-muted">
            {detalles.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
