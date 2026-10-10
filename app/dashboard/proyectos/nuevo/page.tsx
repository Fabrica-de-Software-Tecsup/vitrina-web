"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Field, Input, Select } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Feedback";
import { useSesion } from "@/components/sesion/SesionProvider";
import { crearProyecto } from "@/lib/api-proyectos";
import { getCarreras } from "@/lib/api-catalogos";
import { getDocentes, type DocenteOpcion } from "@/lib/api-usuarios";
import { periodoActual } from "@/lib/utils";
import DocentesSelector from "@/components/proyectos/DocentesSelector";
import type { Carrera } from "@/lib/tipos";

/** Paso 1: lo minimo para crear el borrador. Todo lo demas se completa en el editor, guardando por partes. */
export default function NuevoProyectoPage() {
  const router = useRouter();
  const { usuario, esDocente } = useSesion();
  const { avisar } = useToast();
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [docentes, setDocentes] = useState<DocenteOpcion[]>([]);
  const [nombre, setNombre] = useState("");
  const [tagline, setTagline] = useState("");
  const [carreraTocada, setCarreraId] = useState<number | "" | undefined>(undefined);
  const [cicloTocado, setCiclo] = useState<number | "" | undefined>(undefined);
  const carreraId = carreraTocada ?? usuario?.carreraId ?? "";
  const ciclo = cicloTocado ?? usuario?.ciclo ?? "";
  const [periodo, setPeriodo] = useState(periodoActual());
  const [docenteIds, setDocenteIds] = useState<string[]>([]);
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    getCarreras().then(setCarreras).catch(() => null);
    getDocentes().then(setDocentes).catch(() => null);
  }, []);

  const crear = async () => {
    if (nombre.trim().length < 3) return avisar("El nombre necesita al menos 3 caracteres", "error");
    setCreando(true);
    try {
      const p = await crearProyecto({
        nombre: nombre.trim(),
        tagline: tagline.trim() || undefined,
        carreraId: carreraId ? Number(carreraId) : null,
        ciclo: ciclo ? Number(ciclo) : null,
        periodo,
        docenteIds,
      });
      avisar("Borrador creado. Ahora cuéntanos más.");
      router.push(`/dashboard/proyectos/${p.id}`);
    } catch (e) {
      avisar(e instanceof Error ? e.message : "No se pudo crear el proyecto", "error");
      setCreando(false);
    }
  };


  return (
    <Container className="max-w-2xl py-12">
      <h1 className="mt-2 titular-2 text-ink-default">¿Qué construiste?</h1>
      <p className="mt-3 text-ink-muted">Paso 1 de 2. Empieza con lo básico. Se guarda como borrador y nadie lo ve hasta que tú lo envíes a revisión.</p>

      <div className="card mt-8 space-y-5 p-6 sm:p-8">
        <Field label="Nombre del proyecto" htmlFor="nombre" required contador={{ actual: nombre.length, max: 120 }}>
          <Input id="nombre" value={nombre} maxLength={120} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Sistema de riego inteligente con ESP32" autoFocus />
        </Field>
        <Field label="En una frase" htmlFor="tagline" hint="Lo que verán en la tarjeta. Qué problema resuelve y para quién." contador={{ actual: tagline.length, max: 120 }}>
          <Input id="tagline" value={tagline} maxLength={120} onChange={(e) => setTagline(e.target.value)} placeholder="Ej. Riega el huerto del campus solo cuando la tierra lo necesita" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Carrera" htmlFor="carrera" className="sm:col-span-3">
            <Select id="carrera" value={carreraId} onChange={(e) => setCarreraId(Number(e.target.value) || "")}>
              <option value="">Sin carrera</option>
              {Array.from(new Set(carreras.map((c) => c.area))).map((area) => (
                <optgroup key={area} label={area}>{carreras.filter((c) => c.area === area).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}</optgroup>
              ))}
            </Select>
          </Field>
          <Field label="Ciclo" htmlFor="ciclo">
            <Select id="ciclo" value={ciclo} onChange={(e) => setCiclo(Number(e.target.value) || "")}>
              <option value="">—</option>
              {[1, 2, 3, 4, 5, 6].map((c) => <option key={c} value={c}>Ciclo {c}</option>)}
            </Select>
          </Field>
          <Field label="Periodo" htmlFor="periodo" hint="Formato AAAA-1 / AAAA-2">
            <Input id="periodo" value={periodo} onChange={(e) => setPeriodo(e.target.value)} pattern="\d{4}-[12]" />
          </Field>
        </div>
        <DocentesSelector docentes={docentes} seleccionados={docenteIds} onChange={setDocenteIds} carreraId={carreraId || null} />
        <p className="-mt-2 text-xs text-ink-muted">Si tu docente aún no aparece, crea el borrador igual y agrégalo después desde el editor.</p>
        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" href="/dashboard">Cancelar</Button>
          <Button onClick={crear} loading={creando} size="lg" disabled={nombre.trim().length < 3}>Crear borrador</Button>
        </div>
      </div>
      {esDocente && <p className="mt-4 text-xs text-ink-subtle">Como docente, el proyecto quedará a tu nombre; puedes agregar alumnos al equipo en el siguiente paso.</p>}
    </Container>
  );
}
