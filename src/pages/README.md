# Pages

Esta carpeta contiene todas las páginas/vistas de la aplicación organizadas por módulos.

## Estructura actual

```
pages/
├── Dashboard.tsx           # Página principal del dashboard
└── settings/              # Módulo de configuración
    └── Forms.tsx          # Página de gestión de formularios
```

## Convenciones

### Organización
- Cada página debe ser un componente exportado con un nombre descriptivo
- Páginas relacionadas deben agruparse en carpetas por módulo
- Los archivos de página deben usar PascalCase (ej: `Dashboard.tsx`, `Forms.tsx`)

### Estructura de una página

```tsx
export function NombrePagina() {
  return (
    <div className="space-y-6">
      {/* Header con título y acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Título</h1>
          <p className="text-muted-foreground">Descripción</p>
        </div>
        {/* Botones de acción */}
      </div>

      {/* Contenido principal */}
      <div className="grid gap-4">
        {/* Tu contenido aquí */}
      </div>
    </div>
  );
}
```

## Agregar una nueva página

### 1. Crear el archivo de la página

```bash
# Para una página de módulo existente
src/pages/settings/NuevaPagina.tsx

# Para un nuevo módulo
src/pages/nuevo-modulo/Pagina.tsx
```

### 2. Crear el componente

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function NuevaPagina() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Nueva Página</h1>
      {/* Tu contenido */}
    </div>
  );
}
```

### 3. Agregar la ruta en `/src/routes/index.tsx`

```tsx
import { NuevaPagina } from "@/pages/settings/NuevaPagina";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // ... rutas existentes
      {
        path: "settings/nueva-pagina",
        element: <NuevaPagina />,
      },
    ],
  },
]);
```

### 4. Agregar el item al sidebar en `/src/config/sidebar.config.ts`

```tsx
{
  title: "Nueva Página",
  url: "/settings/nueva-pagina",
  icon: IconoQueElijas,
}
```

## Módulos actuales

### Dashboard (`/`)
Página principal con estadísticas y resumen general del sistema.

### Settings (`/settings`)
Módulo de configuración con las siguientes páginas:
- **Forms** (`/settings/forms`) - Gestión de formularios

## Tips

- **Usa componentes reutilizables**: Aprovecha los componentes de `@/components/ui`
- **Mantén la consistencia**: Sigue el mismo estilo de diseño en todas las páginas
- **Layout consistente**: Usa la estructura de header + contenido
- **Spacing**: Usa `space-y-6` para el contenedor principal
- **Grid responsive**: Usa `grid gap-4 md:grid-cols-2 lg:grid-cols-3` para layouts de tarjetas
