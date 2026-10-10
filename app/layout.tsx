import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SesionProvider } from "@/components/sesion/SesionProvider";
import { ToastProvider } from "@/components/ui/Feedback";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap", weight: ["500", "600", "700", "800"] });

const descripcion = "Portafolio público de proyectos de los estudiantes de Tecsup: software, electrónica, mecánica, minería, gestión y más.";

/** URL canónica: la configurada, si no la de producción que inyecta Vercel, y en local localhost. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Vitrina — Proyectos de estudiantes de Tecsup", template: "%s — Vitrina Tecsup" },
  description: descripcion,
  applicationName: "Vitrina",
  openGraph: { type: "website", locale: "es_PE", siteName: "Vitrina Tecsup", url: "/", title: "Vitrina — Proyectos de estudiantes de Tecsup", description: descripcion },
  twitter: { card: "summary_large_image", title: "Vitrina — Proyectos de estudiantes de Tecsup", description: descripcion },
  appleWebApp: { title: "Vitrina", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b3c5a" },
  ],
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
