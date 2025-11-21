import {
  FolderPlus,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface ProjectsEmptyStateProps {
  variant?: 'empty' | 'filters';
  onCreateProject: () => void;
  onClearFilters?: () => void;
}

export function ProjectsEmptyState({
  variant = 'empty',
  onCreateProject,
  onClearFilters,
}: ProjectsEmptyStateProps) {
  const isFilterVariant = variant === 'filters';
  const Icon = isFilterVariant ? Search : FolderPlus;
  const actionLabel = isFilterVariant ? 'Limpiar filtros' : 'Nuevo proyecto';
  const description = isFilterVariant
    ? 'No encontramos resultados con los criterios actuales. Ajusta la búsqueda para ver otros proyectos.'
    : 'Aún no tienes proyectos registrados. Crea el primero para comenzar a organizar contratos, equipos y entregables.';

  return (
    <Empty className="border border-dashed bg-muted/10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="size-6" />
        </EmptyMedia>
        <EmptyTitle>
          {isFilterVariant ? 'Sin coincidencias' : 'No hay proyectos todavía'}
        </EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button
          variant={isFilterVariant ? 'outline' : 'default'}
          onClick={isFilterVariant ? onClearFilters : onCreateProject}
          disabled={isFilterVariant && !onClearFilters}
        >
          {actionLabel}
        </Button>
      </EmptyContent>
    </Empty>
  );
}
