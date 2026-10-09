import type { NextConfig } from "next";

const esProduccion = process.env.NODE_ENV === "production";
const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
// URL base publica del storage (bucket). Ej. https://archivos.tu-dominio.com
const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "http://localhost:9000";

function patronRemoto(url: string) {
  const u = new URL(url);
  return {
    protocol: u.protocol.replace(":", "") as "http" | "https",
    hostname: u.hostname,
    ...(u.port ? { port: u.port } : {}),
    pathname: "/**",
  };
}

// Content-Security-Policy: lo minimo para Next, Google Identity Services, YouTube embeds y el storage.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${esProduccion ? "" : "'unsafe-eval'"} https://accounts.google.com`,
  "style-src 'self' 'unsafe-inline' https://accounts.google.com https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  `img-src 'self' data: blob: ${storageUrl} https://lh3.googleusercontent.com https://*.googleusercontent.com https://i.ytimg.com`,
  `connect-src 'self' ${apiUrl} ${storageUrl} https://accounts.google.com ${esProduccion ? "" : "ws://localhost:* wss://localhost:* http://localhost:*"}`,
  "frame-src https://accounts.google.com https://www.youtube.com https://www.youtube-nocookie.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  ...(esProduccion ? ["upgrade-insecure-requests"] : []),
]
  .map((d) => d.replace(/\s+/g, " ").trim())
  .join("; ");

const cabecerasSeguridad = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  ...(esProduccion
    ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
    : []),
];

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: { root: __dirname },
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Las imagenes viven en el storage externo; sin optimizador para no gastar cupo del hosting gratuito.
    unoptimized: true,
    remotePatterns: [patronRemoto(storageUrl), { protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  async headers() {
    return [{ source: "/(.*)", headers: cabecerasSeguridad }];
  },
};

export default nextConfig;
