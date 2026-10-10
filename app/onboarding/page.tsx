"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Field, Select } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Feedback";
import { useSesion } from "@/components/sesion/SesionProvider";
import { getCarreras } from "@/lib/api-catalogos";
import { editarPerfil } from "@/lib/api-usuarios";
import { SEDES, type Carrera } from "@/lib/tipos";

/** Primer ingreso: carrera, ciclo y sede. Es lo unico que pedimos antes de dejar publicar. */
export default function OnboardingPage() {
  const router = useRouter();
  const { usuario, cargando, recargar } = useSesion();
  const { avisar } = useToast();
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carreraTocada, setCarreraTocada] = useState<number | "" | undefined>(undefined);
  const [cicloTocado, setCicloTocado] = useState<number | "" | undefined>(undefined);
  const [sedeTocada, setSedeTocada] = useState<string | undefined>(undefined);
  const carreraId = carreraTocada ?? usuario?.carreraId ?? "";
  const ciclo = cicloTocado ?? usuario?.ciclo ?? "";
  const sede = sedeTocada ?? usuario?.sede ?? "";
  const setCarreraId = setCarreraTocada;
  const setCiclo = setCicloTocado;
  const setSede = setSedeTocada;
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getCarreras().then(setCarreras).catch(() => null);
  }, []);
  useEffect(() => {
    if (!cargando && !usuario) router.replace("/auth/login");
  }, [usuario, cargando, router]);

  const carrera = carreras.find((c) => c.id === carreraId);
  const sedesDisponibles = carrera?.sedes.length ? carrera.sedes : [...SEDES];
  const esTecnica = carrera?.descripcion?.includes("2 años");

  const guardar = async () => {
    if (!usuario || !carreraId) return;
    setGuardando(true);
    try {
      await editarPerfil(usuario.id, { carreraId: Number(carreraId), ciclo: ciclo ? Number(ciclo) : null, sede: sede || null });
      await recargar();
      avisar("¡Listo! Ya puedes publicar proyectos.");
      router.push(usuario.rol === "ALUMNO" ? "/dashboard/proyectos/nuevo" : "/dashboard");
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo guardar", "error");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Container className="max-w-xl py-14">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{usuario?.perfilCompleto ? "Datos académicos" : "Un paso más"}</p>
      <h1 className="mt-2 font-display text-3xl font-bold text-ink-900">Hola{usuario ? `, ${usuario.nombre.split(" ")[0]}` : ""} 👋</h1>
      <p className="mt-2 text-ink-600">Cuéntanos tu carrera para ubicar tus proyectos en la vitrina correcta. Lo demás es opcional y lo puedes completar después.</p>

      <div className="card mt-8 space-y-5 p-6 sm:p-8">
        <Field label="Carrera" htmlFor="carrera" required>
          <Select id="carrera" value={carreraId} onChange={(e) => { setCarreraId(Number(e.target.value) || ""); setSede(""); }}>
            <option value="">Elige tu carrera…</option>
            {Array.from(new Set(carreras.map((c) => c.area))).map((area) => (
              <optgroup key={area} label={area}>
                {carreras.filter((c) => c.area === area).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </optgroup>
            ))}
          </Select>
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ciclo actual" htmlFor="ciclo" hint={esTecnica ? "Carrera técnica: 4 ciclos" : "Carrera profesional: 6 ciclos"}>
            <Select id="ciclo" value={ciclo} onChange={(e) => setCiclo(Number(e.target.value) || "")}>
              <option value="">Prefiero no decir</option>
              {Array.from({ length: esTecnica ? 4 : 6 }, (_, i) => i + 1).map((c) => <option key={c} value={c}>Ciclo {c}</option>)}
            </Select>
          </Field>
          <Field label="Sede" htmlFor="sede">
            <Select id="sede" value={sede} onChange={(e) => setSede(e.target.value)}>
              <option value="">Elige…</option>
              {sedesDisponibles.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
        <div className="flex items-center justify-between pt-2">
          {usuario?.perfilCompleto ? <Button variant="ghost" href="/dashboard">Volver</Button> : <span />}
          <Button onClick={guardar} disabled={!carreraId} loading={guardando} size="lg">Continuar</Button>
        </div>
      </div>
    </Container>
  );
}
