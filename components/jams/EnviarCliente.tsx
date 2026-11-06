"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { Field, Input } from "@/components/ui/Field";
import { EmptyState, Skeleton } from "@/components/ui/Feedback";
import AvisoError from "@/components/jams/AvisoError";
import CamposEnvio, { aDatos, valoresVacios, type ValoresEnvio } from "@/components/jams/CamposEnvio";
import EnlacePrivado from "@/components/jams/EnlacePrivado";
import GestorImagenes from "@/components/jams/GestorImagenes";
import { crearEnvio, guardarToken, rutaEditar, rutaJam, tokenGuardado, type Envio, type Jam } from "@/lib/api-jams";
import { useDatoPublico } from "@/lib/usar-dato-publico";

interface Props {
  slug: string;
  jamInicial: Jam | null;
  codigoInicial: string;
}

const claveBorrador = (slug: string) => `vitrina.jam.${slug}.borrador`;

/**
 * Subir el proyecto en dos pasos en la misma página: (1) el formulario con el código del evento y (2) «¡Listo!» con el
 * enlace privado de edición, las fotos y el acceso a la página pública. El borrador se guarda en el teléfono mientras se
 * escribe: si se recarga la página o falla la red no se pierde nada.
 */
export default function EnviarCliente({ slug, jamInicial, codigoInicial }: Props) {
  const jamPedida = useDatoPublico<Jam>(rutaJam(slug), jamInicial);
  const jam = jamPedida.datos;
  const [codigo, setCodigo] = useState(codigoInicial);
  const [valores, setValores] = useState<ValoresEnvio>(valoresVacios);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [hecho, setHecho] = useState<{ envio: Envio; token: string } | null>(null);
  const [previo, setPrevio] = useState<{ id: string; token: string } | null>(null);
  const restaurado = useRef(false);
  const refError = useRef<HTMLDivElement>(null);

  // Tras hidratar: borrador guardado y un envío anterior desde este navegador.
  useEffect(() => {
    void Promise.resolve().then(() => {
      setPrevio(tokenGuardado(slug));
      try {
        const b = JSON.parse(localStorage.getItem(claveBorrador(slug)) ?? "null") as { valores?: ValoresEnvio; codigo?: string } | null;
        if (b?.valores?.integrantes) setValores(b.valores);
        if (b?.codigo && !codigoInicial) setCodigo(b.codigo);
      } catch {
        /* sin borrador */
      }
      restaurado.current = true;
    });
  }, [slug, codigoInicial]);

  useEffect(() => {
    if (!restaurado.current || hecho) return;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(claveBorrador(slug), JSON.stringify({ valores, codigo }));
      } catch {
        /* almacenamiento lleno o bloqueado */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [valores, codigo, slug, hecho]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      const r = await crearEnvio(slug, { ...aDatos(valores), codigo: codigo.trim() });
      guardarToken(slug, r.envio.id, r.tokenEdicion);
      try {
        localStorage.removeItem(claveBorrador(slug));
      } catch {
        /* nada */
      }
      setHecho({ envio: r.envio, token: r.tokenEdicion });
      window.scrollTo({ top: 0 });
    } catch (err) {
      setError(err);
      requestAnimationFrame(() => refError.current?.querySelector<HTMLElement>("[role=alert]")?.focus());
    } finally {
      setEnviando(false);
    }
  };

  if (!jam) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-10 sm:px-8">
        {jamPedida.fallo ? (
          <EmptyState icono="buscar" titulo="No encontramos esta jam" texto="Revisa el enlace o vuelve a escanear el código QR." accion={<Button variant="outline" onClick={jamPedida.reintentar}>Reintentar</Button>} />
        ) : (
          <>
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="mt-8 h-64 w-full" />
          </>
        )}
      </div>
    );
  }

  if (hecho) return <Listo jam={jam} envio={hecho.envio} token={hecho.token} onImagenes={(imagenes) => setHecho({ ...hecho, envio: { ...hecho.envio, imagenes } })} />;

  const cerrada = !jam.abierta;

  return (
    <div className="mx-auto max-w-2xl px-4 pb-6 pt-6 sm:px-8 sm:pt-10">
      <Link href={`/jams/${slug}`} className="-ml-1.5 inline-flex h-11 items-center gap-1 pr-2 text-[0.9375rem] font-medium text-ink-default hover:underline">
        <Icono nombre="chevron-izq" tam={18} />
        {jam.nombre}
      </Link>
      <h1 className="titular-2 mt-4 text-ink-default">Sube tu proyecto</h1>
      <p className="mt-3 text-ink-muted">Cinco minutos. Al terminar recibes un enlace privado para editarlo y añadir fotos hasta el cierre.</p>

      {previo && (
        <div className="mt-6 flex flex-col gap-3 rounded-md border border-linea bg-surface-raised p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-small text-ink-default">Ya subiste un proyecto desde este teléfono.</p>
          <Button href={rutaEditar(slug, previo.id, previo.token)} variant="outline" size="sm" icon={<Icono nombre="editar" tam={16} />}>
            Editarlo
          </Button>
        </div>
      )}

      {cerrada ? (
        <EmptyState className="mt-10" icono="reloj" titulo="Los envíos están cerrados" texto="Ya no se pueden subir proyectos a esta jam." accion={<Button href={`/jams/${slug}`} variant="outline">Ver los proyectos</Button>} />
      ) : (
        <form onSubmit={enviar} className="mt-8 space-y-10">
          <Field label="Código de acceso" htmlFor="codigo" required hint="Está en la pantalla del evento o te lo da la organización.">
            <Input
              id="codigo"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              required
              maxLength={80}
              autoComplete="off"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              className="font-mono uppercase tracking-wider"
            />
          </Field>

          <CamposEnvio valores={valores} onChange={setValores} categorias={jam.categorias} />

          <div ref={refError} className="space-y-4 border-t border-linea pt-6">
            <AvisoError error={error} />
            <Button type="submit" size="lg" loading={enviando} className="w-full" icon={<Icono nombre="subir" tam={18} />}>
              {enviando ? "Enviando…" : "Enviar proyecto"}
            </Button>
            <p className="text-center text-body-small text-ink-muted">Después podrás añadir fotos y corregir lo que quieras.</p>
          </div>
        </form>
      )}
    </div>
  );
}

/** Paso 2: el enlace privado (lo primero y lo más visible), las fotos y la página pública. */
function Listo({ jam, envio, token, onImagenes }: { jam: Jam; envio: Envio; token: string; onImagenes: (i: Envio["imagenes"]) => void }) {
  const [url] = useState(() => `${window.location.origin}${rutaEditar(jam.slug, envio.id, token)}`);
  return (
    <div className="aparece mx-auto max-w-2xl px-4 pb-6 pt-8 sm:px-8 sm:pt-12">
      <p className="flex items-center gap-2 text-body-small font-medium text-state-success">
        <Icono nombre="check" tam={18} />
        Proyecto recibido
      </p>
      <h1 className="titular-2 mt-3 text-ink-default">¡Listo!</h1>
      <p className="mt-3 text-lg text-ink-muted">«{envio.nombre}» ya está en la galería de {jam.nombre}.</p>

      <section aria-labelledby="enlace-privado" className="mt-8 rounded-lg border border-brand-primary bg-brand-container/40 p-5">
        <h2 id="enlace-privado" className="font-display text-title font-medium text-ink-default">
          Guarda tu enlace de edición
        </h2>
        <p className="mt-2 text-body-small text-ink-default">
          Es la única llave para editar el proyecto: <strong className="font-semibold">no hay usuario ni contraseña</strong>. Cópialo o envíatelo ahora y compártelo solo con tu equipo.
        </p>
        <div className="mt-4">
          <EnlacePrivado url={url} titulo={envio.nombre} />
        </div>
      </section>

      <section aria-labelledby="fotos" className="mt-10">
        <h2 id="fotos" className="font-display text-title font-medium text-ink-default">
          Añade fotos
        </h2>
        <p className="mt-1 text-body-small text-ink-muted">Capturas de pantalla, el prototipo, el equipo trabajando. Le dan vida a la galería.</p>
        <div className="mt-4">
          <GestorImagenes slug={jam.slug} envioId={envio.id} token={token} imagenes={envio.imagenes} onCambio={onImagenes} />
        </div>
      </section>

      <div className="mt-10 grid gap-3 border-t border-linea pt-6 sm:flex">
        <Button href={`/jams/${jam.slug}/p/${envio.slug}`} size="lg" icon={<Icono nombre="ojo" tam={18} />}>
          Ver la página del proyecto
        </Button>
        <Button href={`/jams/${jam.slug}`} size="lg" variant="outline">
          Volver a la jam
        </Button>
      </div>
    </div>
  );
}
