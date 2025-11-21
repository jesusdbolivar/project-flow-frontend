import { Link } from 'react-router-dom';

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { ProjectsEmptyState } from './components/ProjectsEmptyState';
import { ProjectsHeader } from './components/ProjectsHeader';
import { ProjectsList } from './components/ProjectsList';
import { useProjectsList } from './hooks/use-projects-list';

export function ProjectsPage() {
  const {
    total,
    projects,
    query,
    setQuery,
    sortBy,
    setSortBy,
    projectFields,
    fieldsLoading,
    fieldsError,
    reloadFields,
    createQuickProject,
    deleteProject,
  } = useProjectsList();

  const isInitialEmpty = total === 0;
  const isFilteredEmpty = total > 0 && projects.length === 0;
  const hasSchema = projectFields.length > 0;

  const renderProjectsSection = () => {
    if (isInitialEmpty) {
      return <ProjectsEmptyState onCreateProject={() => createQuickProject()} />;
    }

    if (isFilteredEmpty) {
      return (
        <ProjectsEmptyState
          variant="filters"
          onCreateProject={() => createQuickProject()}
          onClearFilters={() => setQuery('')}
        />
      );
    }

    return (
      <ProjectsList
        projects={projects}
        fields={projectFields}
        onDeleteProject={deleteProject}
      />
    );
  };

  return (
    <div className="space-y-6">
      <ProjectsHeader
        total={total}
        query={query}
        onQueryChange={setQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        onCreateProject={() => createQuickProject()}
      />

      {fieldsLoading && (
        <Skeleton className="h-48 w-full rounded-2xl" />
      )}

      {!fieldsLoading && fieldsError && (
        <Alert variant="destructive" className="rounded-2xl border-dashed">
          <AlertTitle>Error cargando campos</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>{fieldsError}</p>
            <Button size="sm" variant="outline" onClick={reloadFields}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!fieldsLoading && !fieldsError && !hasSchema && (
        <Alert className="rounded-2xl border-dashed">
          <AlertTitle>Configura tu formulario de proyectos</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>
              Ve a <strong>Configuración → Formularios → Proyectos</strong> y agrega los campos que quieras visualizar
              en esta tabla.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/settings/forms">Abrir formularios</Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {!fieldsLoading && !fieldsError && hasSchema && renderProjectsSection()}
    </div>
  );
}
