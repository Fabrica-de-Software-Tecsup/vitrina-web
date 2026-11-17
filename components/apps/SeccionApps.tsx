"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/components/ui/Feedback";
import { TIENDAS_APP, type TiendaApp } from "@/lib/tiendas";
import { cn } from "@/lib/utils";

interface Props {
  modo?: "portada" | "pagina";
}

type VistaEscaparate = "moviles" | "oscuro" | "xr";

function IconoGooglePlay({ tam = 22 }: { tam?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <path fill="#4285F4" d="M3.61 1.814L13.793 12 3.61 22.186a1.77 1.77 0 0 1-.46-1.193V3.007c0-.455.174-.883.46-1.193z" />
      <path fill="#34A853" d="M17.203 8.59L5.222 1.66a1.79 1.79 0 0 0-1.612.154L13.793 12l3.41-3.41z" />
      <path fill="#FBBC04" d="M20.386 10.431l-3.183-1.841L13.793 12l3.41 3.41 3.183-1.841a1.81 1.81 0 0 0 0-3.138z" />
      <path fill="#EA4335" d="M13.793 12L3.61 22.186a1.79 1.79 0 0 0 1.612.154l11.981-6.93L13.793 12z" />
    </svg>
  );
}

function IconoApple({ tam = 22 }: { tam?: number }) {
  return (
    <svg width={tam} height={tam} viewBox="0 0 24 24" fill="currentColor" aria-hidden className="shrink-0">
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.68.03.13.05.28.05.43zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.945 1.34-1.94 2.71-3.43 2.71-1.517 0-1.9-.88-3.63-.88-1.698 0-2.302.91-3.67.91-1.377 0-2.332-1.26-3.428-2.8-1.287-1.82-2.323-4.63-2.323-7.28 0-4.28 2.797-6.55 5.552-6.55 1.448 0 2.675.95 3.6.95.865 0 2.222-1.01 3.902-1.01.613 0 2.886.06 4.374 2.19-.13.09-2.383 1.37-2.383 4.19 0 3.26 2.854 4.42 2.955 4.45z" />
    </svg>
  );
}

function IconoTienda({ id, tam = 22 }: { id: TiendaApp["id"]; tam?: number }) {
  return id === "android" ? <IconoGooglePlay tam={tam} /> : <IconoApple tam={tam} />;
}

function QrTienda({ tienda, tam = "md" }: { tienda: TiendaApp; tam?: "sm" | "md" | "lg" }) {
  const dimension = tam === "lg" ? "h-40 w-40 sm:h-44 sm:w-44" : tam === "sm" ? "h-24 w-24 sm:h-28 sm:w-28" : "h-32 w-32";
  return (
    <div className="w-fit rounded-sm border border-linea bg-white p-2 shadow-xs">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={tienda.qrViewBox}
        shapeRendering="crispEdges"
        role="img"
        aria-label={`Código QR para descargar ${tienda.nombreApp} en ${tienda.tienda}`}
        className={cn("block", dimension)}
      >
        <rect width={tienda.qrSize} height={tienda.qrSize} fill="#ffffff" />
        <path stroke="#161412" d={tienda.qrPath} />
      </svg>
    </div>
  );
}

function BotonTienda({ tienda }: { tienda: TiendaApp }) {
  return (
    <a
      href={tienda.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex w-full items-center gap-3 rounded-sm bg-ink-default px-4 py-2.5 text-ink-inverse transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98]"
    >
      <IconoTienda id={tienda.id} tam={22} />
      <span className="min-w-0 flex-1 text-left leading-tight">
        <span className="block text-[0.6875rem] uppercase tracking-[0.06em] opacity-75">{tienda.sobrelinea}</span>
        <span className="block truncate text-[0.9375rem] font-semibold">{tienda.tienda}</span>
      </span>
      <Icono nombre="externo" tam={16} className="opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}

function TarjetaTienda({ tienda, compacta = false }: { tienda: TiendaApp; compacta?: boolean }) {
  return (
    <article className={cn("card flex flex-col justify-between", compacta ? "p-4" : "p-6 sm:p-7")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <IconoTienda id={tienda.id} tam={compacta ? 18 : 22} />
            <h3 className="font-display text-[1.25rem] font-medium leading-tight text-ink-default">{tienda.tienda}</h3>
          </div>
          <p className="mt-1 text-body-small text-ink-muted">{tienda.plataformas}</p>
        </div>
        <span className="shrink-0 rounded-sm border border-linea bg-surface-sunken px-2 py-0.5 text-caption text-ink-muted">
          {tienda.id === "android" ? "v1.2" : "iOS"}
        </span>
      </div>

      <div className={cn("flex flex-col items-center", compacta ? "my-4" : "my-6")}>
        <QrTienda tienda={tienda} tam={compacta ? "sm" : "lg"} />
        <p className="mt-2.5 text-center text-caption text-ink-muted">
          {compacta ? "Escanea con tu cámara" : `Escanea para instalar ${tienda.nombreApp}`}
        </p>
      </div>

      <BotonTienda tienda={tienda} />
    </article>
  );
}

function MarcoTelefono({
  src,
  alt,
  etiqueta,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  etiqueta: string;
  width: number;
  height: number;
  className?: string;
}) {
  return (
    <figure className={cn("flex flex-col items-center", className)}>
      <div className="w-full overflow-hidden rounded-[1.75rem] border-[5px] border-[#1c1917] bg-[#1c1917] shadow-[0_18px_40px_-16px_rgba(22,20,18,0.35)]">
        <Image src={src} alt={alt} width={width} height={height} unoptimized className="block h-auto w-full rounded-[1.35rem]" />
      </div>
      <figcaption className="mt-2.5 text-caption font-medium text-ink-muted">{etiqueta}</figcaption>
    </figure>
  );
}

const VISTAS: { id: VistaEscaparate; label: string; pie: string }[] = [
  { id: "moviles", label: "Android e iPhone", pie: "Interfaz nativa en cada plataforma: Material 3 en Android y SwiftUI con Liquid Glass en iPhone." },
  { id: "oscuro", label: "Modo oscuro", pie: "Cada proyecto tiñe su fondo con el color dominante de su portada, sin perder legibilidad." },
  { id: "xr", label: "Galaxy XR", pie: "Experiencia espacial en Android XR: portada, descripción y proyectos relacionados en paneles curvos." },
];

/** Sección de descarga de las apps móviles (Google Play y App Store) con capturas reales, iconos y QR. */
export default function SeccionApps({ modo = "portada" }: Props) {
  const { avisar } = useToast();
  const [vista, setVista] = useState<VistaEscaparate>("moviles");
  const esPagina = modo === "pagina";

  const copiarEnlace = async () => {
    const url = `${window.location.origin}/apps`;
    try {
      await navigator.clipboard.writeText(url);
      avisar("Enlace copiado");
    } catch {
      avisar("No se pudo copiar el enlace", "error");
    }
  };

  const vistaActual = VISTAS.find((v) => v.id === vista) ?? VISTAS[0];

  if (esPagina) {
    return (
      <Container className="pt-12 sm:pt-16">
        <div className="grid gap-10 border-b border-linea pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14">
          <div>
            <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-primary">
              Android · iPhone · Android XR
            </p>
            <h1 className="titular-2 mt-3 text-ink-default">Tu portafolio estudiantil, ahora en tu teléfono.</h1>
            <p className="mt-4 max-w-[44ch] text-lg leading-relaxed text-ink-muted">
              Explora proyectos reales en segundos, revisa entregas si eres docente y vive la galería espacial en Android XR.
            </p>
            <ul className="mt-6 space-y-2.5 text-body-small text-ink-default">
              <li className="flex items-start gap-2.5">
                <Icono nombre="check" tam={18} className="mt-0.5 text-brand-primary" />
                <span>Escritas en SwiftUI y Jetpack Compose para sentirse propias en cada sistema.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icono nombre="check" tam={18} className="mt-0.5 text-brand-primary" />
                <span>Caché local persistente para abrir proyectos al instante incluso con red lenta.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icono nombre="check" tam={18} className="mt-0.5 text-brand-primary" />
                <span>Navegación libre; accede con Google institucional o Sign in with Apple.</span>
              </li>
            </ul>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button variant="outline" onClick={copiarEnlace} icon={<Icono nombre="copiar" tam={18} />}>
                Copiar enlace de descarga
              </Button>
              <Button href="/proyectos" variant="ghost" icon={<Icono nombre="flecha-der" tam={18} />} className="flex-row-reverse">
                Explorar en la web
              </Button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {TIENDAS_APP.map((t) => (
              <TarjetaTienda key={t.id} tienda={t} />
            ))}
          </div>
        </div>

        <section aria-labelledby="pantallas-titulo" className="pt-14">
          <div className="max-w-2xl">
            <h2 id="pantallas-titulo" className="seccion-t text-ink-default">
              Así se ve en cada pantalla
            </h2>
            <p className="mt-2 text-ink-muted">
              Un mismo sistema de diseño adaptado a las fortalezas de Android, iPhone y visores Android XR.
            </p>
          </div>

          <div className="mt-10 grid items-end gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card flex flex-col items-center bg-surface-sunken p-6 sm:p-8">
              <MarcoTelefono
                src="/images/apps/android-explorar.webp"
                alt="Vitrina en Android explorando proyectos"
                etiqueta="Android · Jetpack Compose"
                width={720}
                height={1600}
                className="w-48 sm:w-52"
              />
            </div>
            <div className="card flex flex-col items-center bg-surface-sunken p-6 sm:p-8">
              <MarcoTelefono
                src="/images/apps/ios-explorar.webp"
                alt="Vitrina Estudiantil en iPhone"
                etiqueta="iPhone · SwiftUI"
                width={720}
                height={1565}
                className="w-48 sm:w-52"
              />
            </div>
            <div className="card flex flex-col items-center bg-surface-sunken p-6 sm:col-span-2 sm:p-8 lg:col-span-1">
              <MarcoTelefono
                src="/images/apps/ios-detalle-oscuro.webp"
                alt="Detalle de un proyecto en modo oscuro en iPhone"
                etiqueta="Modo oscuro · Halo adaptativo"
                width={720}
                height={1565}
                className="w-48 sm:w-52"
              />
            </div>
          </div>

          <figure className="card mt-8 overflow-hidden bg-surface-sunken p-4 sm:p-6">
            <div className="overflow-hidden rounded-lamina border border-linea">
              <Image
                src="/images/apps/xr-espacial.webp"
                alt="Vitrina en modo espacial sobre Samsung Galaxy XR con tres paneles curvos"
                width={1200}
                height={750}
                unoptimized
                className="block h-auto w-full object-cover"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-2 text-body-small text-ink-muted">
              <span className="font-medium text-ink-default">Android XR · Samsung Galaxy XR</span>
              <span>Incluido en la versión de Google Play: galería espacial con paneles curvos en Full Space.</span>
            </figcaption>
          </figure>
        </section>
      </Container>
    );
  }

  return (
    <section id="apps" aria-labelledby="apps-titulo" className="mt-20 scroll-mt-24 border-t border-linea">
      <Container className="pt-14 sm:pt-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-14">
          <div>
            <p className="text-caption font-medium uppercase tracking-[0.12em] text-brand-primary">
              Apps oficiales · Android, iPhone y XR
            </p>
            <h2 id="apps-titulo" className="titular-2 mt-3 text-ink-default">
              Lleva Vitrina en tu teléfono.
            </h2>
            <p className="mt-4 max-w-[42ch] text-lg leading-relaxed text-ink-muted">
              Descubre proyectos de estudiantes, sigue los hackatones y revisa entregas con tu cuenta institucional desde una app nativa y rápida.
            </p>

            <ul className="mt-5 space-y-2 text-body-small text-ink-default">
              <li className="flex items-start gap-2">
                <Icono nombre="check" tam={17} className="mt-0.5 text-brand-primary" />
                <span>Nativa en Android (Compose + Galaxy XR) y iPhone (SwiftUI).</span>
              </li>
              <li className="flex items-start gap-2">
                <Icono nombre="check" tam={17} className="mt-0.5 text-brand-primary" />
                <span>Escanea el QR o toca la tienda para instalarla al instante.</span>
              </li>
            </ul>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {TIENDAS_APP.map((t) => (
                <TarjetaTienda key={t.id} tienda={t} compacta />
              ))}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button href="/apps" variant="outline" size="sm" icon={<Icono nombre="flecha-der" tam={16} />} className="flex-row-reverse">
                Ver capturas y página de descarga
              </Button>
              <Button variant="ghost" size="sm" onClick={copiarEnlace} icon={<Icono nombre="copiar" tam={16} />}>
                Copiar enlace
              </Button>
            </div>
          </div>

          <div className="card overflow-hidden bg-surface-sunken p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-linea pb-4">
              <span className="text-body-small font-medium text-ink-default">Vista previa real</span>
              <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Elegir dispositivo">
                {VISTAS.map((v) => {
                  const activo = v.id === vista;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      role="tab"
                      aria-selected={activo}
                      onClick={() => setVista(v.id)}
                      className={cn(
                        "rounded-sm px-2.5 py-1 text-caption font-medium transition-colors",
                        activo
                          ? "bg-ink-default text-ink-inverse"
                          : "border border-linea bg-surface-raised text-ink-muted hover:text-ink-default",
                      )}
                    >
                      {v.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex min-h-[21rem] items-center justify-center sm:min-h-[24rem]">
              {vista === "moviles" ? (
                <div className="grid w-full max-w-[26rem] grid-cols-2 items-end gap-4 sm:gap-6">
                  <MarcoTelefono
                    src="/images/apps/android-explorar.webp"
                    alt="Vitrina en Android"
                    etiqueta="Android · Compose"
                    width={720}
                    height={1600}
                    className="translate-y-2"
                  />
                  <MarcoTelefono
                    src="/images/apps/ios-explorar.webp"
                    alt="Vitrina Estudiantil en iPhone"
                    etiqueta="iPhone · SwiftUI"
                    width={720}
                    height={1565}
                    className="-translate-y-2"
                  />
                </div>
              ) : vista === "oscuro" ? (
                <MarcoTelefono
                  src="/images/apps/ios-detalle-oscuro.webp"
                  alt="Detalle en modo oscuro en iPhone"
                  etiqueta="iPhone · Modo oscuro"
                  width={720}
                  height={1565}
                  className="w-48 sm:w-52"
                />
              ) : (
                <figure className="w-full">
                  <div className="overflow-hidden rounded-lamina border border-linea shadow-md">
                    <Image
                      src="/images/apps/xr-espacial.webp"
                      alt="Vitrina en Android XR sobre Galaxy XR"
                      width={1200}
                      height={750}
                      unoptimized
                      className="block h-auto w-full object-cover"
                    />
                  </div>
                  <figcaption className="mt-2.5 text-center text-caption font-medium text-ink-muted">
                    Android XR · Samsung Galaxy XR
                  </figcaption>
                </figure>
              )}
            </div>

            <p className="mt-5 border-t border-linea pt-4 text-body-small text-ink-muted">{vistaActual.pie}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
