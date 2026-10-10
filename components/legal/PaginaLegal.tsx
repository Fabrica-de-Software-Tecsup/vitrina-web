import Link from "next/link";
import { Container } from "@/components/ui/Section";

export interface SeccionLegal {
  id: string;
  titulo: string;
  contenido: React.ReactNode;
}

/** Plantilla común de /privacidad, /terminos y /eliminar-cuenta (modo Leer): columna de lectura con índice lateral. */
export default function PaginaLegal({
  titulo,
  resumen,
  actualizado,
  secciones,
}: {
  titulo: string;
  resumen: React.ReactNode;
  actualizado: string;
  secciones: SeccionLegal[];
}) {
  return (
    <Container className="pt-12 sm:pt-16">
      <header className="max-w-3xl">
        <h1 className="titular-2 text-ink-default">{titulo}</h1>
        <div className="mt-5 max-w-[60ch] text-lg leading-relaxed text-ink-muted">{resumen}</div>
        <p className="mt-4 text-body-small text-ink-muted">Última actualización: {actualizado}</p>
      </header>

      <div className="mt-12 grid gap-10 border-t border-linea pt-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
        <nav aria-label="Contenido" className="hidden lg:block">
          <ol className="sticky top-28 space-y-1 text-body-small">
            {secciones.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="block py-1 text-ink-muted hover:text-ink-default hover:underline">
                  {s.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-[68ch]">
          {secciones.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-28 pb-10">
              <h2 className="seccion-t text-ink-default">{s.titulo}</h2>
              <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-ink-default [&_a]:font-medium [&_a]:text-brand-primary [&_a]:underline [&_li]:pl-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {s.contenido}
              </div>
            </section>
          ))}
        </article>
      </div>

      <p className="mt-6 border-t border-linea pt-6 text-body-small text-ink-muted">
        Más información: <Link href="/privacidad" className="text-brand-primary hover:underline">Privacidad</Link> ·{" "}
        <Link href="/terminos" className="text-brand-primary hover:underline">Términos de uso</Link> ·{" "}
        <Link href="/eliminar-cuenta" className="text-brand-primary hover:underline">Eliminar tu cuenta</Link>
      </p>
    </Container>
  );
}
