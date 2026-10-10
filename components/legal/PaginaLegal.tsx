import Link from "next/link";
import { Container } from "@/components/ui/Section";

export interface SeccionLegal {
  id: string;
  titulo: string;
  contenido: React.ReactNode;
}

/** Plantilla comun de /privacidad, /terminos y /eliminar-cuenta: cabecera, indice lateral y secciones. */
export default function PaginaLegal({
  eyebrow,
  titulo,
  resumen,
  actualizado,
  secciones,
}: {
  eyebrow: string;
  titulo: string;
  resumen: React.ReactNode;
  actualizado: string;
  secciones: SeccionLegal[];
}) {
  return (
    <Container className="py-10">
      <header className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>
        <h1 className="mt-1 font-display text-3xl font-bold text-ink-900 sm:text-4xl">{titulo}</h1>
        <div className="mt-3 text-ink-600">{resumen}</div>
        <p className="mt-3 text-xs text-ink-400">Última actualización: {actualizado}</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="Contenido" className="hidden lg:block">
          <ol className="sticky top-24 space-y-1 border-l border-ink-200 text-sm">
            {secciones.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="-ml-px block border-l border-transparent py-1 pl-4 text-ink-500 hover:border-brand-500 hover:text-ink-900">
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="card max-w-3xl divide-y divide-ink-100">
          {secciones.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-24 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-ink-900">{s.titulo}</h2>
              <div className="mt-3 space-y-3 text-[0.95rem] leading-relaxed text-ink-700 [&_a]:font-medium [&_a]:text-brand-700 [&_a:hover]:underline [&_li]:pl-1 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5 [&_strong]:text-ink-900">
                {s.contenido}
              </div>
            </section>
          ))}
        </article>
      </div>

      <p className="mt-10 text-sm text-ink-500">
        Más información: <Link href="/privacidad" className="text-brand-700 hover:underline">Privacidad</Link> ·{" "}
        <Link href="/terminos" className="text-brand-700 hover:underline">Términos de uso</Link> ·{" "}
        <Link href="/eliminar-cuenta" className="text-brand-700 hover:underline">Eliminar tu cuenta</Link>
      </p>
    </Container>
  );
}
