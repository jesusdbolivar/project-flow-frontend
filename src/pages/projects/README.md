````markdown
# Projects Module

Módulo central para la gestión de proyectos dentro de Project Flow. Está pensado para crecer hacia operaciones más complejas (contratos, equipos, reportes y automatizaciones) manteniendo una estructura clara y fácilmente extensible.

## Estructura

```
projects/
├── README.md                # Guía rápida del módulo
├── index.ts                 # Punto de entrada del módulo
├── ProjectsPage.tsx         # Página principal (listado)
│
├── components/              # UI específica del dominio
│   ├── ProjectCard.tsx
│   ├── ProjectsHeader.tsx
│   ├── ProjectsList.tsx
│   └── ProjectsEmptyState.tsx
│
└── hooks/
    └── use-projects-list.ts # Lógica de presentación (filtros, orden, vista)
```

> Cuando el módulo crezca puedes agregar subcarpetas como `services/`, `forms/`, `modals/` o `widgets/` siguiendo el mismo patrón.

## Convenciones

- **Páginas** terminan en `Page` y exponen todo desde `index.ts` para un import limpio (`@/pages/projects`).
- **Componentes** son UI pura y reciben sus dependencias vía props (sin side effects).
- **Hooks** encapsulan la lógica de negocio/UI y pueden reutilizar stores, servicios o queries.
- **Estado**: Para persistencia local reutilizamos `useProjectsStore`. Si luego se conecta una API, el hook puede intercambiar la fuente sin tocar la UI.

## Extender el módulo

1. Crear la carpeta correspondiente (`forms/`, `details/`, etc.).
2. Añadir la página/componente.
3. Exportar desde `index.ts` si debe ser pública.
4. Registrar la ruta en `src/routes/index.tsx` y, si aplica, en el sidebar.

## Roadmap sugerido

- Listado + filtros (✅)
- Vista de detalle del proyecto (`/projects/:id`)
- Gestión avanzada (contratos, presupuesto, cronogramas)
- Automatizaciones & reportes

````