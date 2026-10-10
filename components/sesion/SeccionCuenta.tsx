"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Modal, useToast } from "@/components/ui/Feedback";
import { useSesion } from "@/components/sesion/SesionProvider";
import { eliminarMiCuenta } from "@/lib/api-usuarios";
import { cerrarSesion as borrarTokens } from "@/lib/auth";

const PALABRA = "ELIMINAR";

/** Seccion "Cuenta" al final del panel: borrado de cuenta con confirmacion escrita. */
export default function SeccionCuenta() {
  const { usuario, cerrarSesion } = useSesion();
  const { avisar } = useToast();
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const eliminada = useRef(false);

  // Si se vaciara la sesion mientras seguimos en /dashboard, su layout redirigiria al login.
  // Por eso primero se navega a "/" y la sesion del contexto se limpia al desmontar esta seccion.
  useEffect(
    () => () => {
      if (eliminada.current) cerrarSesion();
    },
    [cerrarSesion],
  );

  const cerrar = () => {
    if (enviando) return;
    setAbierto(false);
    setTexto("");
    setError(null);
  };

  const confirmar = async () => {
    setEnviando(true);
    setError(null);
    try {
      await eliminarMiCuenta();
      eliminada.current = true;
      borrarTokens();
      avisar("Tu cuenta fue eliminada. Gracias por haber sido parte de Vitrina.");
      router.replace("/");
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo eliminar la cuenta");
      setEnviando(false);
    }
  };

  return (
    <section id="cuenta" aria-labelledby="cuenta-titulo" className="mt-16 border-t border-ink-200 pt-8">
      <h2 id="cuenta-titulo" className="text-sm font-bold uppercase tracking-[0.14em] text-ink-500">Cuenta</h2>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xl text-sm text-ink-500">
          Sesión iniciada como <span className="font-medium text-ink-700">{usuario?.correo}</span>. Si eliminas tu cuenta se borran tus datos
          personales; los proyectos ya publicados se conservan sin tu nombre.{" "}
          <Link href="/eliminar-cuenta" className="text-brand-700 hover:underline">Más detalles</Link>
        </p>
        <Button variant="ghost" size="sm" className="self-start text-rose-600 hover:bg-rose-50 sm:self-auto" onClick={() => setAbierto(true)}>
          Eliminar mi cuenta
        </Button>
      </div>

      <Modal
        abierto={abierto}
        onCerrar={cerrar}
        titulo="¿Eliminar tu cuenta?"
        descripcion="Esta acción es inmediata y no se puede deshacer."
        acciones={
          <>
            <Button variant="ghost" onClick={cerrar} disabled={enviando}>Cancelar</Button>
            <Button variant="danger" onClick={confirmar} disabled={texto.trim() !== PALABRA} loading={enviando}>
              Eliminar mi cuenta
            </Button>
          </>
        }
      >
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink-600">
          <li>Se borran tu nombre, correo, foto, datos de perfil y CV.</li>
          <li>Sales de los equipos y se eliminan tus borradores que no compartías con nadie.</li>
          <li>Los proyectos publicados se conservan con autor «Usuario eliminado».</li>
          <li>Se cierran tus sesiones en la web y en la app.</li>
        </ul>
        <label className="mt-4 block text-sm font-medium text-ink-800" htmlFor="confirmar-eliminar">
          Escribe <span className="font-mono font-bold">{PALABRA}</span> para confirmar
        </label>
        <input
          id="confirmar-eliminar"
          className="field mt-1.5"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          disabled={enviando}
        />
        {error && <p className="mt-2 text-sm text-rose-600" role="alert">{error}</p>}
      </Modal>
    </section>
  );
}
