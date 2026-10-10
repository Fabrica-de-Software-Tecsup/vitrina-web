"use client";

import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { useToast } from "@/components/ui/Feedback";
import { incrementarCompartidos, urlTarjeta } from "@/lib/api-proyectos";
import type { Proyecto } from "@/lib/tipos";

type Formato = "historia" | "cuadrado";

/**
 * Compartir: la tarjeta en PNG que genera el API (historia 1080×1920 o cuadrado 1080×1080) por la hoja
 * del sistema (Web Share con archivos) o, si no hay, como descarga; y el enlace, copiado o compartido.
 * Las imágenes se piden al abrir el menú para que `navigator.share` se llame dentro del gesto del usuario.
 */
export default function Compartir({ proyecto }: { proyecto: Pick<Proyecto, "id" | "slug" | "nombre" | "tagline" | "estado"> }) {
  const { avisar } = useToast();
  const [abierto, setAbierto] = useState(false);
  const [archivos, setArchivos] = useState<Partial<Record<Formato, File | null>>>({});
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const fuera = (e: PointerEvent) => !raiz.current?.contains(e.target as Node) && setAbierto(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("pointerdown", fuera);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", fuera);
      document.removeEventListener("keydown", esc);
    };
  }, [abierto]);

  const pedir = async (formato: Formato): Promise<File | null> => {
    if (archivos[formato] !== undefined) return archivos[formato] ?? null;
    try {
      const res = await fetch(urlTarjeta(proyecto.slug, formato));
      if (!res.ok || !res.headers.get("content-type")?.startsWith("image/")) throw new Error(String(res.status));
      const archivo = new File([await res.blob()], `${proyecto.slug}-${formato}.png`, { type: "image/png" });
      setArchivos((a) => ({ ...a, [formato]: archivo }));
      return archivo;
    } catch {
      setArchivos((a) => ({ ...a, [formato]: null }));
      return null;
    }
  };

  const abrir = () => {
    setAbierto((a) => !a);
    if (!abierto) {
      void pedir("historia");
      void pedir("cuadrado");
    }
  };

  const contar = () => {
    if (proyecto.estado === "PUBLICADO") incrementarCompartidos(proyecto.id).catch(() => null);
  };

  const url = () => window.location.href.split("#")[0];
  const texto = proyecto.tagline ? `${proyecto.nombre}: ${proyecto.tagline}` : proyecto.nombre;

  const compartirImagen = async (formato: Formato) => {
    const archivo = archivos[formato] ?? (await pedir(formato));
    if (!archivo) {
      avisar("La imagen para compartir no está disponible ahora. Copia el enlace.", "error");
      return;
    }
    setAbierto(false);
    try {
      if (navigator.canShare?.({ files: [archivo] })) {
        await navigator.share({ files: [archivo], title: proyecto.nombre, text: `${texto}\n${url()}` });
      } else {
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(archivo);
        enlace.download = archivo.name;
        enlace.click();
        setTimeout(() => URL.revokeObjectURL(enlace.href), 4000);
        avisar("Imagen descargada");
      }
      contar();
    } catch (e) {
      if ((e as Error).name !== "AbortError") avisar("No se pudo compartir la imagen", "error");
    }
  };

  const compartirEnlace = async () => {
    setAbierto(false);
    try {
      if (navigator.share) {
        await navigator.share({ title: proyecto.nombre, text: texto, url: url() });
      } else {
        await navigator.clipboard.writeText(url());
        avisar("Enlace copiado");
      }
      contar();
    } catch (e) {
      if ((e as Error).name !== "AbortError") avisar("No se pudo compartir el enlace", "error");
    }
  };

  const copiar = async () => {
    setAbierto(false);
    try {
      await navigator.clipboard.writeText(url());
      avisar("Enlace copiado");
      contar();
    } catch {
      avisar("No se pudo copiar el enlace", "error");
    }
  };

  const opcion = "flex w-full items-center gap-3 px-4 py-2.5 text-left text-[0.9375rem] text-ink-default hover:bg-surface-sunken";

  return (
    <div ref={raiz} className="relative">
      <Button variant="outline" size="lg" onClick={abrir} icon={<Icono nombre="compartir" tam={18} />} aria-label="Compartir este proyecto">
        Compartir
      </Button>
      {abierto && (
        <div role="menu" className="aparece absolute right-0 top-full z-40 mt-2 w-72 rounded-md border border-linea bg-surface-overlay py-1.5 shadow-md">
          <button type="button" role="menuitem" className={opcion} onClick={() => compartirImagen("historia")}>
            <Icono nombre="imagen" tam={18} className="text-ink-muted" />
            <span className="flex-1">
              Imagen para historias
              <span className="block text-caption text-ink-muted">1080 × 1920, con código QR</span>
            </span>
          </button>
          <button type="button" role="menuitem" className={opcion} onClick={() => compartirImagen("cuadrado")}>
            <Icono nombre="imagen" tam={18} className="text-ink-muted" />
            <span className="flex-1">
              Imagen cuadrada
              <span className="block text-caption text-ink-muted">1080 × 1080, para publicaciones</span>
            </span>
          </button>
          <div className="my-1.5 border-t border-linea" />
          <button type="button" role="menuitem" className={opcion} onClick={compartirEnlace}>
            <Icono nombre="compartir" tam={18} className="text-ink-muted" />
            Compartir enlace
          </button>
          <button type="button" role="menuitem" className={opcion} onClick={copiar}>
            <Icono nombre="copiar" tam={18} className="text-ink-muted" />
            Copiar enlace
          </button>
        </div>
      )}
    </div>
  );
}
