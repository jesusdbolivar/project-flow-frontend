# Configuration Files

Esta carpeta contiene archivos de configuración de la aplicación que pueden ser modificados sin tocar el código de los componentes.

## `sidebar.config.ts`

Configuración del sidebar/menú de navegación.

### Estructura de datos:

```typescript
interface SidebarItem {
  title: string;           // Nombre que aparece en el menú
  url: string;             // Ruta de navegación
  icon: LucideIcon;        // Componente de icono de lucide-react
  isActive?: boolean;      // Si está activo por defecto (para collapsibles)
  badge?: string;          // Texto para mostrar badge (ej: "3", "Nuevo")
  items?: SidebarSubItem[]; // Sub-items (crea un menú desplegable)
}

interface SidebarSubItem {
  title: string;  // Nombre del sub-item
  url: string;    // Ruta de navegación
}
```

### Ejemplo completo:

```typescript
import { Home, FolderKanban, Users, Settings } from "lucide-react";

export const sidebarItems: SidebarItem[] = [
  // Item simple
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  
  // Item con badge
  {
    title: "Notificaciones",
    url: "/notifications",
    icon: Bell,
    badge: "5",
  },
  
  // Item con sub-menú
  {
    title: "Proyectos",
    url: "/projects",
    icon: FolderKanban,
    isActive: true, // Expandido por defecto
    items: [
      {
        title: "Todos los proyectos",
        url: "/projects",
      },
      {
        title: "Mis proyectos",
        url: "/projects/my-projects",
      },
      {
        title: "Archivados",
        url: "/projects/archived",
      },
    ],
  },
  
  // Más items...
  {
    title: "Equipo",
    url: "/team",
    icon: Users,
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },
];
```

## Cómo agregar un nuevo módulo:

1. **Importa el icono** que necesites desde `lucide-react`
2. **Agrega el objeto** al array `sidebarItems`
3. **Guarda el archivo** - Los cambios se reflejarán automáticamente

### Ejemplo paso a paso:

```typescript
// 1. Importar icono
import { Home, FolderKanban, Calendar } from "lucide-react";
//                                     ^^^^^^^^ Nuevo icono

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Proyectos",
    url: "/projects",
    icon: FolderKanban,
  },
  // 2. Agregar nuevo item
  {
    title: "Calendario",
    url: "/calendar",
    icon: Calendar,
  },
];
```

## Tips:

- **Organiza por secciones**: Puedes agrupar items relacionados
- **Usa badges para notificaciones**: Ideal para mostrar contadores
- **Sub-menús para organización**: Útil cuando tienes muchas opciones relacionadas
- **Iconos consistentes**: Usa iconos que representen claramente la función
- **URLs coherentes**: Mantén una estructura de rutas lógica

## Próximos pasos:

Podrías extender esta configuración para incluir:
- Permisos/roles de usuario
- Información de tooltip personalizada
- Shortcuts de teclado
- Secciones separadas del menú
- Items dinámicos basados en el usuario
