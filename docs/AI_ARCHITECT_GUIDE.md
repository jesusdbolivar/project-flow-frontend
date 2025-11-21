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
- Usar componentes de `@/components/ui` siempre que sea posible.
- No crear estilos CSS manuales si Tailwind puede resolverlo.
- Usar `className` con la utilidad `cn()` para mergear clases.

---

## 5. 🚀 Workflow para Añadir una Nueva Página

Para que la IA implemente una nueva funcionalidad correctamente, debe seguir estos 4 pasos **en orden**:

1.  **Crear Archivos:** Crear la estructura en `src/pages/[modulo]/`.
2.  **Exportar:** Agregar los exports en `src/pages/[modulo]/index.ts` y luego en `src/pages/settings/index.ts` (o `src/pages/index.ts`).
3.  **Enrutar:** Agregar la definición de la ruta en `src/routes/index.tsx`.
4.  **Navegación:** Agregar el item al menú en `src/config/sidebar.config.ts`.

---

## 6. 📊 Estado Actual del Proyecto (Live Status)

> **IA: Actualiza esta sección al terminar tus tareas.**

- [x] **Layout Base:** Sidebar colapsable, Header, Responsive.
- [x] **Dashboard:** Vista inicial con estadísticas estáticas.
- [x] **Módulo Forms:**
    - [x] Listado de formularios.
    - [x] Form Builder (Drag & Drop) funcional.
    - [x] Vista Previa (Preview) en tiempo real.
    - [x] Edición de propiedades de campos.
    - [x] Creación de formularios desde modal (título y descripción).
- [ ] **Módulo Users:** Pendiente de implementación.
- [ ] **Backend Integration:** Actualmente usando MSW (Mocks).

---
