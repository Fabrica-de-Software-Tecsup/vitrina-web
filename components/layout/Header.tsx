import Link from "next/link";
import Avatar from "@/components/ui/Avatar";

interface HeaderProps {
  role?: "public" | "student" | "teacher";
}

export default function Header({ role = "public" }: HeaderProps) {
  // Datos de prueba (en el futuro vendrá del contexto de autenticación)
  const userName = "Maria Mamani";

  return (
    <header className="sticky top-0 z-50 bg-tecsup-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo Izquierdo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-7 h-7 relative">
            <div className="absolute inset-0 bg-white/30 rounded-md rotate-45 group-hover:rotate-[55deg] transition-transform duration-300" />
            <div className="absolute inset-1 bg-white/10 rounded-sm rotate-45" />
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Vitrina
          </span>
        </Link>

        {/* Navegación Central (Cambia según el rol) */}
        <nav className="hidden md:flex items-center gap-1">
          {(role === "public" || role === "student" || role === "teacher") && (
            <>
              <Link
                href="/"
                className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              >
                Proyectos
              </Link>
              <Link
                href="/estudiantes"
                className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              >
                Estudiantes
              </Link>
              <Link
                href="/cursos"
                className="px-3 py-1.5 text-sm font-medium text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              >
                Cursos
              </Link>
            </>
          )}

          {role === "student" && (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm font-semibold text-white bg-white/20 rounded-md"
            >
              Mis Proyectos
            </Link>
          )}

          {role === "teacher" && (
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-sm font-semibold text-white bg-tecsup-green rounded-md hover:bg-tecsup-green/90 transition-colors"
            >
              + Nuevo Proyecto
            </Link>
          )}
        </nav>

        {/* Lado Derecho (Login o Perfil) */}
        <div>
          {role === "public" ? (
            <Link
              href="/auth/login"
              className="px-4 py-1.5 bg-white text-tecsup-blue text-sm font-bold rounded-full hover:bg-gray-100 transition-colors"
            >
              Ingresar
            </Link>
          ) : (
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white leading-tight">
                  Maria
                </p>
                <p className="text-[10px] text-white/60 uppercase">
                  {role === "student" ? "Alumno" : "Docente"}
                </p>
              </div>
              <Avatar name={userName} size="md" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
