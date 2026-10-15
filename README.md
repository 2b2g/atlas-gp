# ATLAS GP

**Gestión del proceso de edición de libros para editoriales.**

ATLAS GP es un fork de [TaskView Community](https://github.com/Gimanh/taskview-community)
renombrado y adaptado para gestionar el proceso completo de producción editorial:
desde la adquisición del manuscrito hasta la publicación impresa o digital.

> Estado: fork base funcional, renombrado a ATLAS GP y verificado
> (instalación, builds de paquetes/API/web y tests unitarios del MCP en verde).
> Las funcionalidades editoriales están en el [PLAN.md](./PLAN.md).

## Origen y licencia

Este proyecto se basa en TaskView CE, distribuido bajo una licencia
*source-available* (ver [LICENSE.md](./LICENSE.md)). Términos relevantes:

* se permite autoalojar, modificar y usar internamente en la organización;
* **no** se puede ofrecer como SaaS ni vender acceso al servicio;
* **no** se puede crear un producto comercial competidor;
* **no** se puede usar el nombre ni la marca TaskView en productos derivados
  (de ahí el renombrado a ATLAS GP).

Las capturas y logotipos de marca de TaskView en `assets/` son referencias del
proyecto original y están pendientes de renovación visual.

## Stack tecnológico

* **Web**: Vue 3 + Nuxt UI + TypeScript + Vite (+ Capacitor para móvil)
* **API**: Node.js / Express / Bun, TypeScript
* **Base de datos**: PostgreSQL + Drizzle ORM (esquemas compartidos)
* **Integraciones**: GitHub/GitLab, webhooks firmados, API pública, cliente
  TypeScript y servidor MCP para asistentes de IA
* **Despliegue**: Docker Compose

## Estructura del monorepo

```text
taskview-community/            ← repo del fork (ATLAS GP)
├── api/                       Backend y API HTTP
│   └── src/tv-modules/        Módulos de dominio (tasks, kanban, sprints…)
│   └── src/migrations/atlasgp/ Migraciones SQL
├── web/                       Aplicación Vue (y app móvil Capacitor)
│   └── src/pages/user/        Páginas autenticadas
│   └── src/components/features/ Componentes por dominio
├── atlasgp-packages/
│   ├── atlasgp-api/           Cliente TypeScript de la API
│   ├── atlasgp-db-schemas/    Esquemas Drizzle compartidos
│   └── atlasgp-mcp/           Servidor MCP (asistentes IA)
├── docs/                      Documentación (pendiente de revisión editorial)
└── PLAN.md                    Plan de implementación de ATLAS GP
```

## Puesta en marcha (desarrollo)

Prerrequisitos: Docker, PostgreSQL, Bun, pnpm ≥ 8 (probado con pnpm 11), Node ≥ 18.

```sh
pnpm install
cp api/.env.example api/.env   # ajustar credenciales de Postgres
cd web && pnpm dev             # frontend (puerto de Vite)
cd api && pnpm start           # backend (Bun, en otra terminal)
```

### Verificación

```sh
pnpm build:packages   # esquemas + cliente API
cd api && pnpm build  # bundle del servidor
cd web && pnpm build  # typecheck + bundle del frontend
pnpm --filter atlasgp-mcp test   # tests unitarios (125)
```

Nota: en un clone nuevo, ejecuta una vez `cd web && pnpm build-only` (o
`pnpm dev`) antes de `pnpm typecheck` si aún no existe `auto-imports.d.ts`
(archivo generado, gitignorado).

Tests del SDK y de la API que usan PostgreSQL necesitan Docker
(`docker compose` de `__tests__/docker`, puerto 15432).

## Roadmap

Ver [PLAN.md](./PLAN.md) — entidades de catálogo (libros), pipeline editorial,
roles y checklists de producción, aprobaciones y dashboards editoriales.
