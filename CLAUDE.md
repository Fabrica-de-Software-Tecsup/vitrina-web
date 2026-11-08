@AGENTS.md

# CLAUDE.md — vitrina-web

Web de **Vitrina**, portafolio de proyectos estudiantiles de Tecsup (vitrina.xrlabs.lat). Next.js 16 (App Router) + React 19 + Tailwind 4. Solo es cliente del `vitrina-api` (NestJS): no tiene base de datos propia.

Repos hermanos (carpetas vecinas en `Vitrina/`, org GitHub `Fabrica-de-Software-Tecsup`): `../vitrina-api`, `../vitrina-app` (Kotlin Multiplatform), `../vitrina-infra` (docs, tokens de diseño, docker-compose; su `CLAUDE.md` es el índice del workspace y `docs/VITRINA.md` el documento maestro).

## Comandos

```bash
npm install
npm run dev        # http://localhost:3000 (necesita el API en :3001; ./dev-up.sh en la raíz levanta todo)
npx tsc --noEmit && npx eslint app components lib && npm run build   # chequeo antes de subir
```

Variables en `.env.local` (plantilla `.env.example`): `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID`, `NEXT_PUBLIC_STORAGE_URL`, `NEXT_PUBLIC_SITE_URL`, `API_URL_INTERNAL`, y el secreto compartido para `POST /api/revalidar` (si está vacío la ruta responde 404).

## Estructura y convenciones

- `app/` rutas: `/` portada, `proyectos`, `estudiantes`, `perfiles`, `carreras`, `docentes`, `dashboard`, `admin` (pestañas, incluida **Jams**), `auth`, `onboarding`, `privacidad`, `terminos`, `eliminar-cuenta` (las tres últimas las exigen las tiendas) y `jams/[slug]` (evento, `enviar`, `envios`, `editar`, `p`).
- `components/` por dominio (`jams`, `proyectos`, `portada`, `explorar`, `layout`, `sesion`, `ui`); `lib/` clientes del API (`api-*.ts`), `tipos.ts` (DTOs escritos a mano: mantenerlos alineados con `vitrina-api` y `vitrina-app/shared/.../Modelos.kt`).
- Lecturas del servidor con `pedirEnServidor` (`lib/api-servidor.ts`): `revalidate` de 30 s y etiquetas (`jam:<slug>`, etc.) para revalidar bajo demanda. Tokens JWT en `localStorage` en el cliente.
- Estilos: `app/tokens.css` es **generado** desde `../vitrina-infra/design` (`npm run build` e `npm run instalar` allí); no editarlo a mano. Dirección visual «Lámina» (Newsreader, Instrument Sans, Geist Mono).
- Texto de UI, rutas y commits en español. Next 16 difiere de lo conocido: leer `node_modules/next/dist/docs/` antes de usar APIs nuevas (ver AGENTS.md).

## Repos hermanos y estado 2026-11-08

`main` = `origin/main` (`5fd8923`), árbol limpio. Despliegue: Vercel Hobby (Dockerfile también disponible) contra el API en Render; CI en `.github/workflows/ci.yml` y `mantener-despierto.yml` (llama a `/health/live` del API). Trabajo reciente (2026-11-06/07): **jams** para el DevFest Arequipa: página del evento con cuenta atrás y galería, subida en dos pasos con borrador en el teléfono, enlace privado con token `#t=` para editar, página pública del proyecto con Open Graph, admin de jams (alta/edición, QR para proyectar, ocultar o eliminar envíos, reconocimientos, CSV) y Next 16.4.5. Contrato del API en `vitrina-api/CLAUDE.md`. Pendiente: crear la jam real y su código de acceso desde `/admin` el día del evento.
