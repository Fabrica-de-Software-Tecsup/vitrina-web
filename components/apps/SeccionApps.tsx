"use client";

import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Container } from "@/components/ui/Section";
import { useToast } from "@/components/ui/Feedback";
import { TIENDAS_APP, type TiendaApp } from "@/lib/tiendas";
import { cn } from "@/lib/utils";

interface Props {
  modo?: "portada" | "pagina";
}

function QrTienda({ tienda, grande = false }: { tienda: TiendaApp; grande?: boolean }) {
  return (
    <div className="w-fit rounded-sm border border-linea bg-white p-2.5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={tienda.qrViewBox}
        shapeRendering="crispEdges"
        role="img"
        aria-label={`Código QR para descargar ${tienda.nombreApp} en ${tienda.tienda}`}
        className={cn("block", grande ? "h-44 w-44 sm:h-48 sm:w-48" : "h-36 w-36")}
      >
        <rect width={tienda.qrSize} height={tienda.qrSize} fill="#ffffff" />
        <path stroke="#161412" d={tienda.qrPath} />
      </svg>
    </div>
  );
}

/** Sección de descarga de las apps móviles (Google Play y App Store) con QR y enlaces directos. */
export default function SeccionApps({ modo = "portada" }: Props) {
  const { avisar } = useToast();
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

  const tarjetas = (
    <div className={cn("grid gap-5 sm:grid-cols-2", esPagina && "mt-10 gap-6")}>
      {TIENDAS_APP.map((t) => (
        <article
          key={t.id}
          className={cn("card flex flex-col items-start justify-between", esPagina ? "p-6 sm:p-8" : "p-5")}
        >
          <div className="flex w-full flex-col items-center border-b border-linea pb-5">
            <QrTienda tienda={t} grande={esPagina} />
          </div>
          <div className="mt-4 w-full">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[1.25rem] font-medium text-ink-default">{t.tienda}</h3>
              <span className="text-caption text-ink-muted">{t.plataformas}</span>
            </div>
            <p className="mt-1 text-body-small text-ink-muted">{t.nombreApp}</p>
            <Button
              href={t.url}
              externo
              variant={esPagina ? "primary" : "outline"}
              size={esPagina ? "md" : "sm"}
              icon={<Icono nombre="externo" tam={16} />}
              className="mt-4 w-full flex-row-reverse"
            >
              {t.boton}
            </Button>
          </div>
        </article>
      ))}
    </div>
  );

  if (esPagina) {
    return (
      <Container className="pt-12 sm:pt-16">
        <div className="flex flex-col gap-6 border-b border-linea pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="titular-2 text-ink-default">Vitrina en tu teléfono</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
              Escanea el código QR con tu cámara o entra directo a la tienda oficial para instalar la app en Android, Android XR o iPhone.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={copiarEnlace} icon={<Icono nombre="copiar" tam={18} />}>
              Copiar enlace
            </Button>
            <Button href="/proyectos" variant="ghost" icon={<Icono nombre="flecha-der" tam={18} />} className="flex-row-reverse">
              Explorar en la web
            </Button>
          </div>
        </div>

        {tarjetas}

        <p className="mt-8 max-w-2xl text-body-small text-ink-muted">
          Puedes navegar proyectos y eventos sin iniciar sesión. Si eres estudiante o docente, entra con tu correo institucional para publicar o revisar proyectos.
        </p>
      </Container>
    );
  }

  return (
    <section id="apps" aria-labelledby="apps-titulo" className="mt-20 scroll-mt-24 border-t border-linea">
      <Container className="pt-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-16">
          <div>
            <h2 id="apps-titulo" className="seccion-t text-ink-default">
              Vitrina en tu teléfono
            </h2>
            <p className="mt-4 max-w-[38ch] text-lg leading-relaxed text-ink-muted">
              Explora proyectos, sigue los eventos de cada edición y entra con tu cuenta desde la app nativa para Android, Android XR y iPhone.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/apps" variant="outline">
                Ver página de descarga
              </Button>
              <Button variant="ghost" onClick={copiarEnlace} icon={<Icono nombre="copiar" tam={18} />}>
                Copiar enlace
              </Button>
            </div>
          </div>

          {tarjetas}
        </div>
      </Container>
    </section>
  );
}
