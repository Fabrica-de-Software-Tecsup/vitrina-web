import { Suspense } from "react";
import { headers } from "next/headers";
import { Container } from "@/components/ui/Section";
import { CardSkeleton } from "@/components/ui/Feedback";
import EsperaHistorial from "@/components/proyectos/EsperaHistorial";
import ExplorarCliente from "@/components/explorar/ExplorarCliente";
import { RUTA_CARRERAS, RUTA_CATEGORIAS, RUTA_TECNOLOGIAS } from "@/lib/api-catalogos";
import { RUTA_ESTADISTICAS, filtrosDeUrl, rutaProyectos } from "@/lib/api-proyectos";
import { inicialDe, pedirEnServidor } from "@/lib/api-servidor";
import type { Carrera, Categoria, Estadisticas, Paginado, Proyecto, Tecnologia } from "@/lib/tipos";

type Params = Record<string, string | string[] | undefined>;

/**
 * Explorar llega renderizado: el servidor resuelve la misma consulta que describe la URL (filtros, orden y página)
 * contra la caché de datos, así el HTML ya trae los proyectos aunque el API esté dormido. Si el API no responde
 * a tiempo y no hay nada guardado, cada pieza va como null y el navegador la carga por su cuenta.
 */
export default async function ExplorarPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const filtros = filtrosDeUrl((clave) => {
    const v = sp[clave];
    return Array.isArray(v) ? v[0] : v;
  });
  // Al cambiar un filtro dentro del sitio (petición RSC) la navegación espera a esta respuesta: con una consulta
  // que aún no está en caché se espera poco y, si no llega, el navegador la pide y enseña el aviso.
  const esNavegacion = (await headers()).get("rsc") === "1";
  const espera = esNavegacion ? 2000 : 8000;

  const [lista, carreras, categorias, tecnologias, estadisticas] = await Promise.all([
    inicialDe<Paginado<Proyecto>>(rutaProyectos(filtros), ["proyectos"], espera),
    pedirEnServidor<Carrera[]>(RUTA_CARRERAS, ["catalogos", "proyectos"], espera),
    pedirEnServidor<Categoria[]>(RUTA_CATEGORIAS, ["catalogos"], espera),
    pedirEnServidor<Tecnologia[]>(RUTA_TECNOLOGIAS, ["catalogos"], espera),
    pedirEnServidor<Estadisticas>(RUTA_ESTADISTICAS, ["proyectos"], espera),
  ]);

  // EsperaHistorial va fuera del Suspense: si suspendiera dentro de un límite recién montado, React mostraría el fallback.
  return (
    <>
      <EsperaHistorial />
      <Suspense
        fallback={
          <Container className="pt-20">
            <div className="reticula">
              {[1, 2, 3, 4].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          </Container>
        }
      >
        <ExplorarCliente inicial={{ lista, carreras, categorias, tecnologias, estadisticas }} />
      </Suspense>
    </>
  );
}
