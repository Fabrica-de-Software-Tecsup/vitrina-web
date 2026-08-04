export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Aquí irá el componente <Header /> */}
      <header className="h-16 bg-tecsup-gray border-b flex items-center px-6">
        <span className="font-bold text-tecsup-dark">Vitrina (Header pendiente)</span>
      </header>
      
      <main className="flex-1">{children}</main>
      
      {/* Aquí irá el componente <Footer /> */}
      <footer className="bg-tecsup-dark p-4 text-center text-sm text-white">
        Vitrina — Diseño y Desarrollo de Software · Hecho por estudiantes, para el mundo
      </footer>
    </div>
  );
}