import Link from "next/link";
import Button from "@/components/ui/Button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo Izquierdo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-tecsup-cyan rounded-lg rotate-45 group-hover:rotate-[55deg] transition-transform duration-300" />
            <div className="absolute inset-1 bg-white rounded-md rotate-45" />
            <div className="absolute inset-2 bg-tecsup-cyan/60 rounded-sm rotate-45" />
          </div>
          <span className="text-lg font-bold tracking-tight text-tecsup-dark">
            Vitrina
          </span>
        </Link>

        {/* Navegación Central */}
        <nav className="hidden md:flex items-center gap-1">
          {["Explorar", "Estudiantes", "Cursos"].map((item) => (
            <Link
              key={item}
              href="#"
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-tecsup-dark rounded-lg hover:bg-tecsup-gray transition-colors duration-200"
            >
              {item}
            </Link>
          ))}
        </nav>

        {/* Botón Ingresar (Usando nuestro componente Button) */}
        <Link href="/auth/login">
          <Button variant="primary">Ingresar</Button>
        </Link>

      </div>
    </header>
  );
}