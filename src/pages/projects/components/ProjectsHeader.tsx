import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { type ProjectsSort } from '../hooks/use-projects-list';

interface ProjectsHeaderProps {
  total: number;
  query: string;
  onQueryChange: (value: string) => void;
  sortBy: ProjectsSort;
  onSortByChange: (sort: ProjectsSort) => void;
  onCreateProject: () => void;
}

export function ProjectsHeader({
  total,
  query,
  onQueryChange,
  sortBy,
  onSortByChange,
  onCreateProject,
}: ProjectsHeaderProps) {
  return (
    <div className="space-y-4 rounded-2xl border bg-card p-4 shadow-sm lg:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-primary/80">Operaciones</p>
          <h1 className="text-3xl font-semibold tracking-tight">Proyectos</h1>
          <p className="text-sm text-muted-foreground">Administra iniciativas, contratos y roadmaps en un solo lugar.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">{total} proyectos</span>
          <Button onClick={onCreateProject}>
            <Plus className="size-4" />
            Nuevo proyecto
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex w-full flex-col gap-3 md:flex-row">
          <div className="w-full md:max-w-sm">
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Buscar por nombre, código o descripción"
              aria-label="Buscar proyectos"
            />
          </div>
          <Select value={sortBy} onValueChange={(value) => onSortByChange(value as ProjectsSort)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Orden" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Más recientes</SelectItem>
              <SelectItem value="alphabetical">A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
