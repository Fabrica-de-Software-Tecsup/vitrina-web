"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Icono from "@/components/ui/Icono";
import { EmptyState, Skeleton, useToast } from "@/components/ui/Feedback";
import AvisoError from "@/components/jams/AvisoError";
import CamposEnvio, { aDatos, valoresDe, type ValoresEnvio } from "@/components/jams/CamposEnvio";
import EnlacePrivado from "@/components/jams/EnlacePrivado";
import GestorImagenes from "@/components/jams/GestorImagenes";
import { ErrorJam, actualizarEnvio, getEnvioPrivado, guardarToken, rutaEditar, rutaJam, tokenGuardado, type EnvioPrivado, type Jam } from "@/lib/api-jams";
import { useDatoPublico } from "@/lib/usar-dato-publico";

interface Props {
  slug: string;
  id: string;
  jamInicial: Jam | null;
}

type Estado = { fase: "buscando" } | { fase: "sin-token" } | { fase: "cargando"; token: string } | { fase: "error"; error: unknown } | { fase: "listo"; token: string };

/** El token llega en el fragmento (#t=…), que el navegador nunca envía al servidor; si no, el guardado en este teléfono. */
function tokenDeLaUrl(): string | null {
  const t = new URLSearchParams(window.location.hash.slice(1)).get("t");
  return t?.trim() || null;
}

/**
 * Editar un envío con el enlace privado. Mismo formulario que al subirlo, ya relleno, y el gestor de fotos.
 * Cuando la jam cierra el formulario queda de solo lectura.
 */
export default function EditarCliente({ slug, id, jamInicial }: Props) {
  const { avisar } = useToast();
  const jam = useDatoPublico<Jam>(rutaJam(slug), jamInicial).datos;
  const [estado, setEstado] = useState<Estado>({ fase: "buscando" });
  const [envio, setEnvio] = useState<EnvioPrivado | null>(null);
  const [valores, setValores] = useState<ValoresEnvio | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState<unknown>(null);

  useEffect(() => {
    let vigente = true;
    void Promise.resolve().then(async () => {
      const token = tokenDeLaUrl() ?? tokenGuardado(slug, id)?.token ?? null;
      if (!vigente) return;
      if (!token) return setEstado({ fase: "sin-token" });
      setEstado({ fase: "cargando", token });
      try {
        const e = await getEnvioPrivado(slug, id, token);
        if (!vigente) return;
        guardarToken(slug, id, token);
        setEnvio(e);
        setValores(valoresDe(e));
        setEstado({ fase: "listo", token });
      } catch (error) {
        if (vigente) setEstado({ fase: "error", error });
      }
    });
    return () => {
      vigente = false;
    };
  }, [slug, id]);

  const original = useMemo(() => (envio ? JSON.stringify(aDatos(valoresDe(envio))) : ""), [envio]);
  const cambiado = !!valores && JSON.stringify(aDatos(valores)) !== original;
  const cerrada = jam ? !jam.abierta : false;

  const guardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (estado.fase !== "listo" || !valores || !envio) return;
    setGuardando(true);
    setErrorGuardar(null);
    try {
      const actualizado = await actualizarEnvio(slug, id, estado.token, aDatos(valores));
      const privado = { ...envio, ...actualizado, contactoCorreo: aDatos(valores).contactoCorreo };
      setEnvio(privado);
      setValores(valoresDe(privado));
      avisar("Cambios guardados");
    } catch (err) {
      setErrorGuardar(err);
    } finally {
      setGuardando(false);
    }
  };

  const volver = (
    <Link href={`/jams/${slug}`} className="-ml-1.5 inline-flex h-11 items-center gap-1 pr-2 text-[0.9375rem] font-medium text-ink-default hover:underline">
      <Icono nombre="chevron-izq" tam={18} />
      {jam?.nombre ?? "Volver a la jam"}
    </Link>
  );

  if (estado.fase === "buscando" || estado.fase === "cargando") {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-8 sm:pt-10">
        {volver}
        <Skeleton className="mt-4 h-12 w-2/3" />
        <Skeleton className="mt-8 h-72 w-full" />
      </div>
    );
  }

  if (estado.fase === "sin-token" || estado.fase === "error") {
    const tokenMalo = estado.fase === "sin-token" || (estado.error instanceof ErrorJam && (estado.error.status === 401 || estado.error.status === 403));
    return (
      <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-8 sm:pt-10">
        {volver}
        <EmptyState
          className="mt-6"
          icono={tokenMalo ? "alerta" : "buscar"}
          titulo={estado.fase === "sin-token" ? "Falta tu enlace de edición" : tokenMalo ? "Este enlace de edición no sirve" : "No pudimos abrir el proyecto"}
          texto={
            tokenMalo
              ? "Abre el enlace privado completo que recibiste al subir el proyecto (el que copiaste o te enviaste). Si lo perdiste, escríbele a la organización de la jam: pueden encontrar tu proyecto por el correo del equipo y enviarte uno nuevo."
              : estado.error instanceof Error
                ? estado.error.message
                : "Vuelve a intentarlo en unos segundos."
          }
          accion={
            <Button href={`/jams/${slug}`} variant="outline">
              Ver la jam
            </Button>
          }
        />
      </div>
    );
  }

  if (!envio || !valores) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 sm:px-8 sm:pt-10">
      {volver}
      <h1 className="titular-2 mt-4 text-ink-default">Editar proyecto</h1>
      <p className="mt-3 text-ink-muted">
        {envio.nombre} · {envio.equipoNombre}
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button href={`/jams/${slug}/p/${envio.slug}`} variant="outline" size="sm" icon={<Icono nombre="ojo" tam={16} />}>
          Ver página pública
        </Button>
      </div>

      {cerrada && (
        <p className="mt-6 flex items-start gap-2 rounded-md border border-linea bg-surface-sunken px-4 py-3 text-body-small text-ink-default">
          <Icono nombre="reloj" tam={18} className="mt-px shrink-0 text-ink-muted" />
          Los envíos de esta jam ya cerraron: tu proyecto queda como está y aquí solo puedes verlo.
        </p>
      )}

      <details className="group mt-6 rounded-md border border-linea px-4 py-1">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-label text-ink-default">
          Tu enlace privado de edición
          <Icono nombre="chevron-abajo" tam={18} className="text-ink-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="pb-4 pt-1">
          <p className="mb-3 text-body-small text-ink-muted">Compártelo solo con tu equipo: quien lo tenga puede editar el proyecto.</p>
          <EnlacePrivado url={`${window.location.origin}${rutaEditar(slug, id, estado.token)}`} titulo={envio.nombre} />
        </div>
      </details>

      <section aria-labelledby="fotos" className="mt-10">
        <h2 id="fotos" className="font-display text-title font-medium text-ink-default">
          Fotos
        </h2>
        <div className="mt-4">
          <GestorImagenes slug={slug} envioId={id} token={estado.token} imagenes={envio.imagenes} onCambio={(imagenes) => setEnvio((e) => (e ? { ...e, imagenes } : e))} deshabilitado={cerrada} />
        </div>
      </section>

      <form onSubmit={guardar} className="mt-10">
        <fieldset disabled={cerrada} className="min-w-0">
          <CamposEnvio valores={valores} onChange={setValores} categorias={jam?.categorias ?? []} />
        </fieldset>
        {!cerrada && (
          <div className="sticky bottom-0 z-10 -mx-4 mt-8 space-y-3 border-t border-linea bg-surface-default px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 sm:mx-0 sm:px-0">
            <AvisoError error={errorGuardar} />
            <Button type="submit" size="lg" variant={cambiado ? "primary" : "outline"} loading={guardando} disabled={!cambiado} className="w-full">
              {guardando ? "Guardando…" : cambiado ? "Guardar cambios" : "Sin cambios"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
