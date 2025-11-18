# Pages

Esta carpeta contiene todas las páginas/vistas de la aplicación organizadas por módulos.

## Estructura actual

```
pages/
├── Dashboard.tsx           # Página principal del dashboard
├── README.md              # Este archivo
│
└── settings/              # 📂 Módulo de configuración (modular)
    ├── index.ts           # Exports de todos los submódulos
    ├── README.md          # Documentación del módulo
    │
    └── forms/             # Submódulo de formularios
        ├── index.ts
        ├── FormsListPage.tsx
        ├── FormEditPage.tsx
        └── README.md
```

## Convenciones

### Organización modular
- **Páginas simples** → Archivo directo (ej: `Dashboard.tsx`)
- **Módulos complejos** → Carpeta con submódulos (ej: `settings/`)
- **Submódulos** → Carpeta con páginas relacionadas (ej: `settings/forms/`)
- Los archivos de página deben usar PascalCase terminando en `Page` (ej: `FormsListPage.tsx`)
- Cada módulo/submódulo tiene su `index.ts` y `README.md`

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

### Opción A: Página simple (no requiere submódulo)

```bash
# Para una página independiente
src/pages/NuevaPagina.tsx
```

### Opción B: Página dentro de un submódulo existente

```bash
# Para settings/forms
src/pages/settings/forms/NuevaPagina.tsx

# Luego exportar en:
src/pages/settings/forms/index.ts
src/pages/settings/index.ts
```

### Opción C: Crear un nuevo submódulo completo

```bash
# Crear estructura
src/pages/settings/nuevo-modulo/
├── index.ts
├── NuevoModuloListPage.tsx
├── NuevoModuloEditPage.tsx
└── README.md
```
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
