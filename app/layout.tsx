import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SesionProvider } from "@/components/sesion/SesionProvider";
import { ToastProvider } from "@/components/ui/Feedback";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap", weight: ["500", "600", "700", "800"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Vitrina — Proyectos de estudiantes de Tecsup", template: "%s — Vitrina Tecsup" },
  description: "Portafolio público de proyectos de los estudiantes de Tecsup: software, electrónica, mecánica, minería, gestión y más.",
  openGraph: { type: "website", locale: "es_PE", siteName: "Vitrina Tecsup" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="min-h-screen flex flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
          <SesionProvider>
            <ToastProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </SesionProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
