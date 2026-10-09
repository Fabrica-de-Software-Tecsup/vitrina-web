import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <p className="font-display text-lg font-bold text-ink-900">Vitrina</p>
          <p className="mt-2 max-w-xs text-sm text-ink-500">
            Portafolio público de proyectos de los estudiantes de Tecsup. Hecho por estudiantes, para el mundo.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-ink-900">Explorar</p>
          <ul className="mt-3 space-y-2 text-ink-600">
            <li><Link href="/proyectos" className="hover:text-brand-700">Todos los proyectos</Link></li>
            <li><Link href="/proyectos?orden=destacados" className="hover:text-brand-700">Destacados</Link></li>
            <li><Link href="/estudiantes" className="hover:text-brand-700">Estudiantes</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-ink-900">Participa</p>
          <ul className="mt-3 space-y-2 text-ink-600">
            <li><Link href="/auth/login" className="hover:text-brand-700">Ingresar con correo Tecsup</Link></li>
            <li><Link href="/dashboard/proyectos/nuevo" className="hover:text-brand-700">Publicar un proyecto</Link></li>
            <li><a href="https://www.tecsup.edu.pe" target="_blank" rel="noopener noreferrer" className="hover:text-brand-700">tecsup.edu.pe ↗</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-100">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-ink-400 sm:px-6 lg:px-8">© {new Date().getFullYear()} Vitrina · Tecsup. Los proyectos pertenecen a sus autores.</p>
      </div>
    </footer>
  );
}
