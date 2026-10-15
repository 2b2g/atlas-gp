# ATLAS GP — Plan básico de implementación

**Objetivo:** convertir el fork de TaskView (proyecto/task management) en
**ATLAS GP**, una herramienta para gestionar el *proceso de edición de libros*
en una editorial: recepción del manuscrito → edición → corrección → maquetación
→ aprobaciones → publicación.

---

## 1. Qué hereda el fork (ya funcionando)

| Capacidad de TaskView | Uso en la editorial |
|---|---|
| Proyectos, listas, tareas y subtareas | Cada **libro** = proyecto; cada etapa = lista; tareas = actividades |
| Estados/flujo personalizado + Kanban | **Pipeline editorial** configurable por colección |
| Roles y permisos granulares (RBAC) | Autor, editor, corrector, maquetador, diseñador, jefe de edición |
| Grafos de dependencias | Secuencias críticas (no maquetar antes de cerrar corrección) |
| Sprints, calendario, vencimientos | Ciclos de edición y **fechas de publicación** |
| Seguimiento de tiempo | Coste real por libro y por etapa |
| Notificaciones + webhooks + API + MCP | Avisos de atraso, integraciones y asistente IA |
| Facturación / gastos (módulo billing) | Anticipos y regalías (fase tardía) |

**Arquitectura** (dónde tocar cada cosa):

```text
atlasgp-packages/atlasgp-db-schemas/src/schemas/   ← esquemas Drizzle (nuevas tablas)
api/src/tv-modules/<modulo>/                       ← API REST + lógica (nuevo módulo)
api/src/migrations/atlasgp/sql/<version>/          ← migración SQL nueva
web/src/pages/user/<pagina>.vue                    ← páginas nuevas
web/src/components/features/<dominio>/             ← UI por dominio
web/src/locales/{en,es,...}.ts                     ← textos i18n
atlasgp-packages/atlasgp-mcp/                      ← herramientas MCP opcionales
```

---

## 2. Fases

### Fase 0 — Fork y renombrado ✅ (completada)

* Clone del upstream como fork local renombrado **ATLAS GP**
  (501 archivos, 25 rutas: paquetes `atlasgp-*`, título, i18n, env vars
  `ATLAS_GP_*`, prefijo de tokens `agp_`, ids de app móvil).
* `pnpm install` + builds de paquetes, API y web en verde; 125 tests MCP ✓.
* Adaptación a pnpm 11 (`allowBuilds` en `pnpm-workspace.yaml`).

### Fase 1 — Entidad «Libro» (catálogo) · estimación: 1–2 semanas

1. **Esquema** `books.schema.ts` en `atlasgp-db-schemas`:
   `id, organization_id, project_id (≥1), titulo, subtitulo, autor(es),
   coleccion, isbn, formato (tapa dura/blanda/ebook/audio), idioma,
   extension_pags, fecha_publicacion_prevista, estado_publicacion`.
2. **Migración SQL** en `api/src/migrations/atlasgp/sql/` + registrar en
   `migrate.json`.
3. **Módulo API** `api/src/tv-modules/books/` (CRUD + rutas + permisos),
   siguiendo el patrón de `tasks`/`organizations`.
4. **Web**: página `web/src/pages/user/books.vue` (lista + ficha),
   componente `components/features/books/`, store y menú lateral.
5. **Vinculación**: libro ↔ proyecto existente (el proyecto aporta tablero,
   estados, tareas y tiempo; el libro aporta metadatos editoriales).

**Criterio de aceptación:** crear un libro desde la UI genera proyecto +
ficha consultable por API; filtros por colección/estado/fecha.

### Fase 2 — Pipeline y roles editoriales · estimación: 1–2 semanas

1. **Plantilla de producción reutilizable**: serializar el flujo de estados
   editorial (Propuesta → Contrato → Manuscrito → Edición de contenido →
   Corrección de estilo → Maquetación → Pruebas → Tapa/arte → Publicación)
   y poder aplicarla con un clic a un libro nuevo (hoy los workflows ya son
   reusables; se añade la plantilla editorial por defecto).
2. **Roles editoriales**: mapear roles RBAC existentes a
   autor/editor/corrector/maquetador/diseñador/jefe de edición
   (módulo `collaboration-roles`), con permisos por etapa.
3. **Checklist por etapa**: subtareas obligatorias de cierre de fase
   (reutilizar subtareas + nueva propiedad `required_to_close`).
4. **Idiomas i18n** completos (es por defecto, en/pt-br de respaldo).

**Criterio de aceptación:** un libro nuevo nace con las 9 etapas, checklists
y roles asignados en < 1 minuto.

### Fase 3 — Control de calidad: versiones, consultas y aprobaciones · estimación: 2 semanas

1. **Versiones de manuscrito**: tabla `manuscript_versions`
   (`book_id, version, file_url, submitted_by, fecha, notas`) con historial
   en la ficha del libro (adjuntos + activity feed ya existentes).
2. **Consultas autor↔editorial («quer»)**: tipo especial de tarea/comentario
   con estados *abierta/contestada/cerrada* y notificación al asignado.
3. **Aprobación de etapa (gate)**: acción «Cerrar etapa» que exige checklist
   completa + aprobación del jefe de edición; registra quién/aprobó/cuándo
   (tabla `stage_approvals`).

**Criterio de aceptación:** no se puede avanzar de etapa sin aprobación;
queda trazabilidad completa en el historial.

### Fase 4 — Seguimiento y dashboards editoriales · estimación: 1–2 semanas

1. **Calendario de publicación**: vista de fechas previstas vs. reales,
   alertas de atraso (notificaciones + webhooks).
2. **Dashboard editorial** (extender `analytics`): libros por etapa, tiempo
   promedio en corrección/maquetación, carga por corrector, backlog de la
   colección.
3. **Reportes de coste por libro** (reutilizar time-tracking + ingresos/gastos).

**Criterio de aceptación:** jefe de edición ve el estado de toda la lista en
una pantalla y recibe alertas cuando un libro se atrasa.

### Fase 5 — Backlog (posterior)

* Anticipos y regalías sobre facturación existente.
* Exportación/importación de metadatos (ONIX) y envío a imprenta.
* Herramientas MCP nuevas: «buscar libros por etapa», «resumir correcciones».
* Revisión visual: logo, favicon, capturas (los assets aún muestran TaskView).
* Limpieza de codenames internos (`tv-modules`, `TvWebExtension`) y de
  `web__old/` (legado, excluido del renombrado).
* Revisión de `docs/` (renombrado mecánicamente; enlaces `atlasgp.tech` son
  placeholders).

---

## 3. Consideraciones

* **Licencia**: uso interno permitido; no SaaS, no producto competidor, no
  marca TaskView. Mantener `LICENSE.md` intacto.
* **Datos**: migraciones pensadas para instalación nueva (fork sin datos
  previos); si alguien migra una instancia TaskView existente, las
  referencias renombradas (`atlasgp`, `agp_`) no coincidirían con sus datos.
* **Verificación pendiente**: tests con Docker/Postgres (no disponible en esta
  máquina), builds de iOS/Android (renombrados solo a nivel de texto),
  despliegue con `build-dockers.sh` e imágenes bajo un registry propio.
* **Prioridad recomendada**: Fase 1 → 2 → 3 → 4. Cada fase deja valor
  usable y es independiente de las siguientes.
