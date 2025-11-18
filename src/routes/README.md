# Routes

Esta carpeta contiene la configuración de rutas de la aplicación usando React Router v6.

## Estructura

```
routes/
└── index.tsx    # Configuración principal del router
```

## Configuración actual

El router usa `createBrowserRouter` de React Router v6 con las siguientes características:

- **Layout anidado**: Usa `AppLayout` como contenedor principal con `<Outlet />` para renderizar las rutas hijas
- **Rutas anidadas**: Soporta estructura jerárquica de rutas
- **Lazy loading**: Preparado para cargar componentes de forma diferida

## Agregar una nueva ruta

### Ruta simple

```tsx
{
  path: "/nueva-ruta",
  element: <NuevaPagina />,
}
```

### Ruta con parámetros

```tsx
{
  path: "/proyectos/:id",
  element: <ProyectoDetalle />,
}
```

### Rutas anidadas

```tsx
{
  path: "configuracion",
  children: [
    {
      index: true,  // /configuracion
      element: <ConfiguracionIndex />,
    },
    {
      path: "usuarios",  // /configuracion/usuarios
      element: <Usuarios />,
    },
    {
      path: "permisos",  // /configuracion/permisos
      element: <Permisos />,
    },
  ],
}
```

### Ruta con layout diferente

```tsx
{
  path: "/login",
  element: <AuthLayout />,
  children: [
    {
      index: true,
      element: <Login />,
    },
    {
      path: "registro",
      element: <Registro />,
    },
  ],
}
```

## Navegación en la aplicación

### Usando Link

```tsx
import { Link } from "react-router-dom";

<Link to="/settings/forms">Ir a Formularios</Link>
```

### Usando useNavigate (navegación programática)

```tsx
import { useNavigate } from "react-router-dom";

function MiComponente() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/settings/forms");
  };
  
  return <button onClick={handleClick}>Ir</button>;
}
```

### Acceder a parámetros de ruta

```tsx
import { useParams } from "react-router-dom";

function ProyectoDetalle() {
  const { id } = useParams();
  
  return <div>Proyecto ID: {id}</div>;
}
```

## Protección de rutas

Para agregar rutas protegidas, crea un componente wrapper:

```tsx
// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuth(); // Tu lógica de autenticación
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// En routes/index.tsx
{
  path: "/admin",
  element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
}
```

## 404 - Página no encontrada

Agrega al final del array de rutas:

```tsx
{
  path: "*",
  element: <NotFound />,
}
```

## Redirecciones

```tsx
import { Navigate } from "react-router-dom";

{
  path: "/old-path",
  element: <Navigate to="/new-path" replace />,
}
```

## Tips

- **Usa rutas relativas** cuando trabajes con rutas anidadas
- **index: true** para la ruta por defecto de un grupo
- **replace** en Navigate para no agregar al historial
- **Lazy loading** para optimizar carga inicial:
  ```tsx
  const Dashboard = lazy(() => import("@/pages/Dashboard"));
  ```
