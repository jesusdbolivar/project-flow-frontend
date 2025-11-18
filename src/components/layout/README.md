# Layout Components

Esta carpeta contiene los componentes de diseño principal de la aplicación.

## Estructura

### `app-sidebar.tsx`
Componente principal del sidebar que renderiza el menú de navegación usando la configuración desde `sidebar.config.ts`.

## Características implementadas

- ✅ **Sidebar colapsable** con animaciones
- ✅ **Soporte para items con sub-menús**
- ✅ **Detección automática de ruta activa** - Los items se resaltan según la URL actual
- ✅ **Apertura automática de sub-menús** - Si un sub-item está activo, el menú padre se abre automáticamente
- ✅ **Header** con logo y nombre de la aplicación
- ✅ **Footer** con información del usuario y menú dropdown
- ✅ **Tooltips** en modo colapsado
- ✅ **Responsive** (se convierte en drawer en móvil)

### `app-layout.tsx`
Layout principal que envuelve el contenido de la aplicación.

**Características:**
- Integración del sidebar
- Header con trigger del sidebar, separador y breadcrumbs
- Área de contenido scrolleable
- Responsive y adaptativo

## Uso

### Implementar el layout en tu aplicación:

```tsx
import { AppLayout } from '@/components/layout/app-layout';

function App() {
  return (
    <AppLayout>
      <div>
        <h1>Mi Contenido</h1>
        {/* Tu contenido aquí */}
      </div>
    </AppLayout>
  );
}
```

### Configurar items del sidebar:

Edita el archivo `/src/config/sidebar.config.ts`:

```typescript
export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    isActive: true, // Marca como activo por defecto
  },
  {
    title: "Proyectos",
    url: "/projects",
    icon: FolderKanban,
    badge: "5", // Opcional: mostrar badge
    items: [ // Opcional: sub-items
      {
        title: "Todos los proyectos",
        url: "/projects",
      },
    ],
  },
];
```

### Agregar nuevos módulos:

1. Importa el icono de lucide-react
2. Agrega un nuevo objeto al array `sidebarItems`
3. El sidebar se actualizará automáticamente

**Ejemplo:**

```typescript
import { Home, FolderKanban, Users } from "lucide-react";

export const sidebarItems: SidebarItem[] = [
  // ... items existentes
  {
    title: "Equipo",
    url: "/team",
    icon: Users,
  },
];
```

## Personalización

### Cambiar el logo:
Edita la sección `SidebarHeader` en `app-sidebar.tsx`

### Cambiar información del usuario:
Edita la sección `SidebarFooter` en `app-sidebar.tsx`

### Ajustar breadcrumbs:
Modifica el componente `Breadcrumb` en `app-layout.tsx` o hazlo dinámico según la ruta actual.

## Iconos disponibles

Puedes usar cualquier icono de [Lucide React](https://lucide.dev/icons):
- Home
- FolderKanban
- Users
- Settings
- BarChart
- FileText
- Calendar
- Mail
- Bell
- Y muchos más...
