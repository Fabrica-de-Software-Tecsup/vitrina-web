import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import AvisoServidor from "@/components/layout/AvisoServidor";
import Footer from "@/components/layout/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SesionProvider } from "@/components/sesion/SesionProvider";
import { ToastProvider } from "@/components/ui/Feedback";
import { SCRIPT_TEMA } from "@/lib/tema";

/** Newsreader con tamaño óptico para nombres de proyecto y titulares; Instrument Sans (con ancho) para la interfaz. */
const display = Newsreader({ subsets: ["latin", "latin-ext"], axes: ["opsz"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const sans = Instrument_Sans({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-sans", display: "swap" });

const descripcion = "Proyectos reales de estudiantes de Tecsup, revisados por sus docentes: software, electrónica, mecánica, minería, gestión y más.";

/** URL canónica: la configurada, si no la de producción que inyecta Vercel, y en local localhost. */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Vitrina — Proyectos hechos por estudiantes", template: "%s — Vitrina" },
  description: descripcion,
  applicationName: "Vitrina",
  openGraph: { type: "website", locale: "es_PE", siteName: "Vitrina", url: "/", title: "Vitrina — Proyectos hechos por estudiantes", description: descripcion },
  twitter: { card: "summary_large_image", title: "Vitrina — Proyectos hechos por estudiantes", description: descripcion },
  appleWebApp: { title: "Vitrina", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF6F1" },
    { media: "(prefers-color-scheme: dark)", color: "#191511" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Fija el tema elegido antes de pintar para que no parpadee. */}
        <script dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ""}>
          <SesionProvider>
            <ToastProvider>
              <Header />
              <AvisoServidor />
              <main id="contenido" className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </SesionProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
