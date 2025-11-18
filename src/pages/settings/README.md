# Settings Module

Módulo de configuración del sistema con páginas organizadas por submódulos.

## 📂 Estructura

```
settings/
├── index.ts              # Exports de todos los submódulos
├── README.md            # Este archivo
│
├── forms/               # Módulo de formularios
│   ├── index.ts
│   ├── FormsListPage.tsx
│   ├── FormEditPage.tsx
│   ├── README.md
│   └── components/      # (futuro) Componentes específicos
│
└── [otros-modulos]/     # Futuros módulos
    ├── users/
    ├── permissions/
    └── general/
```

## 🎯 Filosofía de organización

Cada submódulo de settings tiene su propia carpeta con:
- ✅ **index.ts** - Exports del módulo
- ✅ **[Nombre]Page.tsx** - Páginas del módulo
- ✅ **README.md** - Documentación específica
- ✅ **components/** - Componentes exclusivos del módulo (opcional)

## 📄 Módulos actuales

### Forms (`/settings/forms`)
Gestión de formularios de la aplicación.

**Páginas:**
- `FormsListPage` - Lista de formularios (`/settings/forms`)
- `FormEditPage` - Editor de formulario (`/settings/forms/:id/edit`)

Ver más: `./forms/README.md`

## ➕ Agregar un nuevo módulo

### Ejemplo: Módulo de Usuarios

1. **Crear la estructura:**
```bash
settings/users/
├── index.ts
├── UsersListPage.tsx
├── UserEditPage.tsx
└── README.md
```

2. **Crear las páginas:**

```tsx
// UsersListPage.tsx
export function UsersListPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Usuarios</h1>
      {/* Contenido */}
    </div>
  );
}

// UserEditPage.tsx
export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <Button onClick={() => navigate('/settings/users')}>
        <ArrowLeft />
      </Button>
      <h1>Editar Usuario {id}</h1>
      {/* Contenido */}
    </div>
  );
}
```

3. **Exportar en index.ts:**

```tsx
// users/index.ts
export { UsersListPage } from './UsersListPage';
export { UserEditPage } from './UserEditPage';
```

4. **Agregar al index principal:**

```tsx
// settings/index.ts
export { FormsListPage, FormEditPage } from './forms';
export { UsersListPage, UserEditPage } from './users';
```

5. **Configurar rutas:**

```tsx
// routes/index.tsx
import { UsersListPage, UserEditPage } from '@/pages/settings';

{
  path: "settings",
  children: [
    // ... rutas existentes
    {
      path: "users",
      element: <UsersListPage />,
    },
    {
      path: "users/:id/edit",
      element: <UserEditPage />,
    },
  ],
}
```

6. **Agregar al sidebar:**

```tsx
// config/sidebar.config.ts
{
  title: "Configuración",
  items: [
    { title: "Formularios", url: "/settings/forms" },
    { title: "Usuarios", url: "/settings/users" },
  ],
}
```

## 🎨 Patrones recomendados

### Nombres consistentes
- Lista: `[Modulo]ListPage.tsx`
- Crear: `[Modulo]CreatePage.tsx`
- Editar: `[Modulo]EditPage.tsx`
- Detalle: `[Modulo]DetailPage.tsx`

### Estructura de rutas
```
/settings/[modulo]              → Lista
/settings/[modulo]/create       → Crear
/settings/[modulo]/:id          → Detalle
/settings/[modulo]/:id/edit     → Editar
```

### Navegación con botón de retorno
```tsx
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

<Button
  variant="ghost"
  size="icon"
  onClick={() => navigate('/settings/[modulo]')}
>
  <ArrowLeft className="h-4 w-4" />
</Button>
```

## 📚 Beneficios de esta estructura

✅ **Escalable** - Fácil agregar nuevos módulos
✅ **Mantenible** - Código organizado y fácil de encontrar
✅ **Modular** - Cada módulo es independiente
✅ **Documentado** - README en cada nivel
✅ **Consistente** - Patrones claros y repetibles
