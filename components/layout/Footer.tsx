import Link from "next/link";

/** Pie sobrio: la marca, una frase y los enlaces necesarios. */
export default function Footer() {
  return (
    <footer className="mt-24 border-t border-linea">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-6 px-4 py-8 sm:px-8 md:flex-row md:items-baseline md:gap-10 xl:px-20">
        <p className="flex items-baseline gap-3">
          <Link href="/" className="font-display text-[1.375rem] font-medium text-ink-default">
            Vitrina
          </Link>
          <span className="text-body-small text-ink-muted">Proyectos de estudiantes, revisados por sus docentes.</span>
        </p>
        <nav aria-label="Pie de página" className="flex flex-wrap gap-x-6 gap-y-2 text-body-small text-ink-muted md:ml-auto">
          <Link href="/proyectos" className="hover:text-ink-default hover:underline">Explorar</Link>
          <Link href="/estudiantes" className="hover:text-ink-default hover:underline">Estudiantes</Link>
          <Link href="/dashboard/proyectos/nuevo" className="hover:text-ink-default hover:underline">Publicar un proyecto</Link>
          <Link href="/privacidad" className="hover:text-ink-default hover:underline">Privacidad</Link>
          <Link href="/terminos" className="hover:text-ink-default hover:underline">Términos</Link>
          <Link href="/eliminar-cuenta" className="hover:text-ink-default hover:underline">Eliminar cuenta</Link>
        </nav>
      </div>
      <p className="mx-auto max-w-[90rem] px-4 pb-8 text-caption text-ink-subtle sm:px-8 xl:px-20">
        © {new Date().getFullYear()} Vitrina. Los proyectos pertenecen a sus autores.
      </p>
    </footer>
  );
}
