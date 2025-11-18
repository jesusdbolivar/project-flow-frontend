# Forms Module

Módulo de gestión de formularios dentro de Settings.

## Estructura

```
forms/
├── index.ts              # Exports principales
├── FormsListPage.tsx     # Lista/índice de formularios
├── FormEditPage.tsx      # Editor de formulario individual
└── components/           # (futuro) Componentes específicos de formularios
```

## Páginas

### FormsListPage.tsx
**Ruta:** `/settings/forms`

Vista principal con la lista de todos los formularios.

**Características:**
- Grid de tarjetas con formularios
- Botón "Nuevo Formulario"
- Botones de edición por formulario
- Estadísticas generales

### FormEditPage.tsx
**Ruta:** `/settings/forms/:id/edit`

Editor dedicado para un formulario específico.

**Características:**
- Botón de retorno a la lista
- Título con ID del formulario
- Área preparada para contenido de edición

## Uso

```tsx
// Importar desde el módulo
import { FormsListPage, FormEditPage } from '@/pages/settings/forms';

// O importar individualmente
import { FormsListPage } from '@/pages/settings/forms/FormsListPage';
import { FormEditPage } from '@/pages/settings/forms/FormEditPage';
```

## Expandir el módulo

Para agregar nuevas páginas al módulo de formularios:

1. Crea el archivo: `src/pages/settings/forms/TuNuevaPagina.tsx`
2. Exporta en `index.ts`
3. Agrega la ruta en `/src/routes/index.tsx`

### Ejemplo:

```tsx
// FormCreatePage.tsx
export function FormCreatePage() {
  return <div>Crear nuevo formulario</div>;
}

// index.ts
export { FormCreatePage } from './FormCreatePage';

// routes/index.tsx
{
  path: "forms/create",
  element: <FormCreatePage />,
}
```

## Componentes compartidos

Si necesitas componentes específicos para formularios, créalos en:
```
forms/components/
├── FormField.tsx
├── FormPreview.tsx
└── FormSettings.tsx
```

Y expórtalos desde un index:
```tsx
// forms/components/index.ts
export { FormField } from './FormField';
export { FormPreview } from './FormPreview';
export { FormSettings } from './FormSettings';
```
