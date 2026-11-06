"use client";

import { useState } from "react";
import Icono from "@/components/ui/Icono";
import { useToast } from "@/components/ui/Feedback";
import { ErrorJam, MAX_BYTES_IMAGEN, MAX_IMAGENES, eliminarImagenEnvio, imagenesOrdenadas, subirImagenEnvio, type ImagenEnvio } from "@/lib/api-jams";
import { peso, reducirImagen } from "@/lib/reducir-imagen";
import { cn } from "@/lib/utils";

interface Props {
  slug: string;
  envioId: string;
  token: string;
  imagenes: ImagenEnvio[];
  onCambio: (imagenes: ImagenEnvio[]) => void;
  deshabilitado?: boolean;
}

interface Subida {
  clave: string;
  nombre: string;
  /** null mientras se reduce; luego 0–1. */
  avance: number | null;
  error?: string;
}

/**
 * Fotos del envío: hasta 6, reducidas en el teléfono (2.000 px, WebP) antes de subir y con la barra de avance de cada una.
 * La primera es la portada en la galería.
 */
export default function GestorImagenes({ slug, envioId, token, imagenes, onCambio, deshabilitado }: Props) {
  const { avisar } = useToast();
  const [subidas, setSubidas] = useState<Subida[]>([]);
  const [borrando, setBorrando] = useState<string | null>(null);
  const ordenadas = imagenesOrdenadas({ imagenes });
  const enCurso = subidas.filter((s) => !s.error).length;
  const libres = MAX_IMAGENES - imagenes.length - enCurso;

  const actualizar = (clave: string, cambio: Partial<Subida>) => setSubidas((l) => l.map((s) => (s.clave === clave ? { ...s, ...cambio } : s)));

  const subir = async (archivos: FileList | null) => {
    if (!archivos?.length) return;
    const lista = Array.from(archivos).filter((f) => f.type.startsWith("image/"));
    if (!lista.length) return avisar("Elige fotos en PNG, JPG, WebP o GIF", "error");
    if (lista.length > libres) avisar(`Solo caben ${Math.max(0, libres)} más; se suben las primeras.`, "info");
    const elegidas = lista.slice(0, Math.max(0, libres)).map((f, i) => ({ archivo: f, clave: `${Date.now()}-${i}-${f.name}` }));
    setSubidas((l) => [...l, ...elegidas.map((e) => ({ clave: e.clave, nombre: e.archivo.name, avance: null }))]);
    let actuales = imagenes;
    for (const { archivo: original, clave } of elegidas) {
      try {
        const { archivo } = await reducirImagen(original);
        if (archivo.size > MAX_BYTES_IMAGEN) throw new ErrorJam(`Pesa ${peso(archivo.size)} incluso reducida; el máximo es 5 MB.`, 413);
        actualizar(clave, { avance: 0 });
        const nueva = await subirImagenEnvio(slug, envioId, token, archivo, (f) => actualizar(clave, { avance: f }));
        actuales = [...actuales, nueva];
        onCambio(actuales);
        setSubidas((l) => l.filter((s) => s.clave !== clave));
      } catch (e) {
        actualizar(clave, { error: e instanceof Error ? e.message : "No se pudo subir", avance: null });
      }
    }
  };

  const quitar = async (img: ImagenEnvio) => {
    setBorrando(img.id);
    try {
      await eliminarImagenEnvio(slug, envioId, token, img.id);
      onCambio(imagenes.filter((i) => i.id !== img.id));
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo quitar la imagen", "error");
    } finally {
      setBorrando(null);
    }
  };

  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ordenadas.map((img, i) => (
          <li key={img.id} className="min-w-0">
            <div className="lamina" style={{ backgroundColor: img.colorDominante ?? undefined }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- miniatura del editor */}
              <img src={img.variantes?.s?.webp ?? img.url} alt={`Imagen ${i + 1}`} loading="lazy" />
              {i === 0 && <span className="absolute left-2 top-2 rounded-sm bg-surface-default px-2 py-0.5 text-caption font-semibold text-ink-default shadow-[0_0_0_0.5px_var(--c-marco)]">Portada</span>}
            </div>
            {!deshabilitado && (
              <button
                type="button"
                onClick={() => quitar(img)}
                disabled={borrando === img.id}
                className="mt-1 inline-flex min-h-10 items-center gap-1 text-body-small font-medium text-state-danger hover:underline disabled:opacity-50"
              >
                <Icono nombre="borrar" tam={16} />
                {borrando === img.id ? "Quitando…" : "Quitar"}
              </button>
            )}
          </li>
        ))}

        {subidas.map((s) => (
          <li key={s.clave} className="min-w-0">
            <div className={cn("lamina flex flex-col items-center justify-center gap-3 p-4 text-center", s.error && "bg-surface-sunken")}>
              <Icono nombre={s.error ? "alerta" : "reloj"} tam={22} className={s.error ? "text-state-danger" : "text-ink-muted"} />
              <span className="w-full truncate text-caption text-ink-muted">{s.nombre}</span>
              {s.error ? (
                <span className="text-caption text-state-danger">{s.error}</span>
              ) : (
                <span className="block h-1.5 w-full overflow-hidden rounded-full bg-[var(--c-linea)]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((s.avance ?? 0) * 100)} aria-label={`Subiendo ${s.nombre}`}>
                  <span className={cn("block h-full rounded-full bg-brand-primary transition-[width] duration-200", s.avance === null && "cargando")} style={{ width: s.avance === null ? "30%" : `${Math.max(4, s.avance * 100)}%` }} />
                </span>
              )}
            </div>
            {s.error && (
              <button type="button" onClick={() => setSubidas((l) => l.filter((x) => x.clave !== s.clave))} className="mt-1 inline-flex min-h-10 items-center text-body-small font-medium text-ink-default hover:underline">
                Descartar
              </button>
            )}
          </li>
        ))}

        {!deshabilitado && libres > 0 && (
          <li>
            <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-lamina border border-dashed border-surface-outline bg-surface-sunken px-3 text-center text-body-small text-ink-muted hover:border-ink-muted hover:text-ink-default has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand-primary">
              <Icono nombre="imagen" tam={24} />
              <span className="font-medium text-ink-default">{imagenes.length || enCurso ? "Añadir más fotos" : "Elegir fotos"}</span>
              <span className="text-caption">Quedan {libres}</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                className="sr-only"
                onChange={(e) => {
                  void subir(e.target.files);
                  e.target.value = "";
                }}
              />
            </label>
          </li>
        )}
      </ul>
      <p className="mt-3 text-body-small text-ink-muted">
        Hasta {MAX_IMAGENES} fotos o capturas, 5 MB cada una. Las reducimos en tu teléfono antes de subirlas. La primera es la portada.
      </p>
    </div>
  );
}
