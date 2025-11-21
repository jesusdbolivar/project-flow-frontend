# 🧠 Guía de Arquitectura y Contexto para Agentes de IA

> **INSTRUCCIÓN PARA LA IA:** Antes de generar código o proponer cambios, lee este documento para entender la arquitectura, estructura de directorios y convenciones del proyecto "Project Flow".
>
> **MANTENIMIENTO:** Si realizas cambios estructurales (nuevos módulos, cambios en el router, nuevas librerías), **DEBES** actualizar este documento al final de tu respuesta.

---

## 1. 🛠 Tech Stack & Core Libraries

- **Framework:** React 18 + TypeScript + Vite
- **UI Library:** Shadcn/UI (basado en Radix UI) + Tailwind CSS
- **State Management:** Zustand (con persistencia para datos locales)
- **Routing:** React Router v6 (Data Router con `createBrowserRouter`)
- **Forms:** React Hook Form + Zod (validación)
- **Drag & Drop:** @dnd-kit (usado en FormBuilder)
- **Icons:** Lucide React
- **API Mocking:** MSW (Mock Service Worker)

---

## 2. 📂 Estructura del Proyecto

La estructura es **modular** y basada en **features** (funcionalidades), especialmente dentro de `pages`.

```text
src/
├── components/
│   ├── layout/          # Layouts globales (AppLayout, Sidebar)
│   └── ui/              # Componentes base de Shadcn (Button, Input, etc.)
├── config/
│   └── sidebar.config.ts # ⚙️ ÚNICA fuente de verdad para el menú lateral
├── hooks/               # Hooks reutilizables (use-mobile, etc.)
├── lib/                 # Utilidades (utils.ts para cn(), axios setup)
├── mocks/               # Handlers de MSW
├── pages/               # Vistas de la aplicación
│   ├── Dashboard.tsx    # Home
│   └── settings/        # 📦 MÓDULO MODULAR (Ver sección 3)
│       ├── forms/       # Submódulo de Formularios
│       ├── users/       # (Futuro) Submódulo de Usuarios
│       └── index.ts     # Barrel file para exportar páginas
├── routes/
│   └── index.tsx        # Definición de rutas y lazy loading
├── services/            # Capa de comunicación con API
└── state/               # Stores globales de Zustand
```

---

## 3. 🏗 Patrones de Arquitectura

### A. Módulos de Settings (Patrón Estricto)
Cualquier nueva funcionalidad en "Configuración" debe seguir esta estructura de carpeta en `src/pages/settings/[nombre-modulo]/`:

1.  **`index.ts`**: Exporta las páginas públicas del módulo.
2.  **`[Modulo]ListPage.tsx`**: Vista principal (tabla/grid).
3.  **`[Modulo]EditPage.tsx`**: Vista de edición/creación.
4.  **`components/`**: Componentes exclusivos de este módulo.
5.  **`README.md`**: Documentación específica del módulo.

### B. Enrutamiento
- Usamos rutas anidadas en `src/routes/index.tsx`.
- El layout principal es `AppLayout` que contiene el `Outlet`.
- **Regla:** Nunca agregar lógica de navegación hardcodeada en componentes; usar `useNavigate` o `Link`.

### C. Estado (Zustand)
- **Global UI:** Sidebar state, theme (en `state/ui.store.ts` si existiera).
- **Domain Data:** Datos de negocio complejos (ej: `src/state/forms.store.ts`).
- **Server State:** Preferimos `useEffect` + Services para cargar datos, y Zustand para manipularlos localmente si es necesario (como en el FormBuilder).

---

## 4. 📝 Convenciones de Código

### Naming
- **Componentes:** PascalCase (`FormBuilder.tsx`).
- **Hooks:** camelCase con prefijo use (`useFormsList.ts`).
- **Archivos de configuración:** kebab-case o camelCase (`src/config/sidebar.config.ts`).

### Exports
- Preferimos **Named Exports** (`export function Componente`) sobre Default Exports, excepto para `React.lazy`.
- Usar **Barrel Files** (`index.ts`) en las carpetas de módulos para mantener limpios los imports.

### UI Components

## 5. 🚀 Workflow para Añadir una Nueva Página
### Endpoints (Separados por Dominio)

Forms (CRUD básico):
- `GET /api/forms` → Lista de summaries `{ id, title, description, updatedAt }`.
- `GET /api/forms/:id` → Summary individual.
- `POST /api/forms` → Crear formulario (sin fields).
- `PUT /api/forms/:id` → Actualizar meta (title/description).
- `DELETE /api/forms/:id` → Eliminar formulario.

FormBuilder (estructura y campos):
- `GET /api/forms/:id/schema` → Detalles completos (incluye `fields`).
- `PUT /api/forms/:id/schema` → Reemplaza título, descripción y array completo de `fields`.
- `GET /api/forms/:id/fields` → Lista sólo los campos.
- `POST /api/forms/:id/fields` → Crear campo nuevo.
- `PUT /api/forms/:formId/fields/:fieldId` → Actualizar campo existente.
- `DELETE /api/forms/:formId/fields/:fieldId` → Eliminar campo.
- `PATCH /api/forms/:id/fields/reorder` → Reordenar campos enviando `{ order: string[] }`.

---
- [x] **Layout Base:** Sidebar colapsable, Header, Responsive.
- [x] **Dashboard:** Vista inicial con estadísticas estáticas.
### Stores

Separación aplicada:
- `useFormsStore` → Sólo metadatos (id, title, description, updatedAt). No maneja campos.
- `useFormBuilderStore` → Maneja `currentForm` (detalles + fields) y operaciones: `loadForm`, `addField`, `updateField`, `removeField`, `reorderFields`, `replaceSchema`, `setLocalFields`.

El componente `FormBuilder` ahora recibe `formId` y se conecta directamente al store para persistir acciones (creación, edición, reorden, eliminación) contra la API mock de FormBuilder con UI optimista.
Se separó la lógica (contenedor `FormBuilder` que maneja estados: loading, notFound, error) de la presentación (`FormBuilderView`). El store expone `notFound` y `resetError` para una UX controlada sin overlays intrusivos.

Esto reduce acoplamiento y permite escalar validaciones y lógica específica del builder sin inflar el store de formularios global.
- [x] **Módulo Forms:**
    - [x] Listado de formularios.
    - [x] Form Builder (Drag & Drop) funcional.
    - [x] Vista Previa (Preview) en tiempo real.
    - [x] Edición de propiedades de campos.
    - [x] Creación de formularios desde modal (título y descripción).
    - [x] API Mock para Form Builder (CRUD de campos, reorder, schema completo).
- [ ] **Módulo Users:** Pendiente de implementación.
- [ ] **Backend Integration:** Actualmente usando MSW (Mocks). API real pendiente.

---

## 7. 🧩 API Form Builder (Contrato Mock Actual)

Se agregó una capa de endpoints mock (MSW) para soportar operaciones del constructor de formularios. Estos endpoints facilitan migrar luego a un backend real sin cambiar la interfaz del front.

### Endpoints

- `GET /api/forms` ⇒ Lista de summaries `{ id, title, description, updatedAt }`.
- `GET /api/forms/:id` ⇒ Summary individual.
- `POST /api/forms` ⇒ Crear formulario.
- `PUT /api/forms/:id` ⇒ Actualizar meta (title/description).
- `DELETE /api/forms/:id` ⇒ Eliminar formulario.

#### Builder específico
- `GET /api/forms/:id/schema` ⇒ Detalles completos (incluye `fields`).
- `PUT /api/forms/:id/schema` ⇒ Reemplaza título, descripción y array completo de `fields` (bulk).
- `GET /api/forms/:id/fields` ⇒ Lista sólo los campos.
- `POST /api/forms/:id/fields` ⇒ Crear campo nuevo.
- `PUT /api/forms/:formId/fields/:fieldId` ⇒ Actualizar campo existente.
- `DELETE /api/forms/:formId/fields/:fieldId` ⇒ Eliminar campo.
- `PATCH /api/forms/:id/fields/reorder` ⇒ Reordenar campos enviando `{ order: string[] }`.

### Tipos Clave
`FormField` (en `src/pages/settings/forms/FormBuilder/types.ts`): define propiedades ricas para cada campo (layout, opciones, dataSource, validaciones, comportamiento de botones, etc.).

`FormDetails` (servicio) = Summary + `fields: FormField[]`.

### Store
`useFormsStore` ahora incluye métodos remotos:
- `loadFormRemote(formId)`
- `remoteAddField(formId, field)`
- `remoteUpdateField(formId, fieldId, data)`
- `remoteRemoveField(formId, fieldId)`
- `remoteReorderFields(formId, orderedIds)`

Permite estrategias de actualización optimista o sincronización explícita con el backend mock.

### Próximos Pasos Sugeridos
1. Añadir validación con Zod para bodies antes de enviar (cliente) y en backend real.
2. Incorporar control de versiones de formularios (versionado de schema).
3. Endpoint de publicación: `POST /api/forms/:id/publish` que genera snapshot inmutable.
4. Integrar caching y revalidación (React Query / TanStack Query) si se escala el consumo.
5. Autorización: incluir encabezados y validación de roles para modificar formularios.

---
