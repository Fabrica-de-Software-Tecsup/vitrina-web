import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vitrina — Tecsup",
  description: "Portafolio de proyectos estudiantiles de Tecsup.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-white text-tecsup-dark`}>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          {/* h-screen asegura que mida exactamente el 100% de la pantalla */}
          <div className="flex flex-col h-screen overflow-hidden">
            {/* overflow-y-auto permite hacer scroll DENTRO si la página es larga (ej. Landing) */}
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
            {/* El Footer siempre se queda fijo abajo, sin importar si haces scroll arriba */}
            <Footer />
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}