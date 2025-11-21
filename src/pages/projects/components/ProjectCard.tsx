import {
  formatDistanceToNow,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarClock,
  FolderKanban,
  MoreHorizontal,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Project } from '@/state/projects.store';

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const updatedLabel = formatDistanceToNow(parseISO(project.updatedAt), {
    addSuffix: true,
    locale: es,
  });

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <div className="space-y-1.5 pr-10">
          <CardTitle className="text-xl leading-tight">{project.name}</CardTitle>
          <CardDescription>
            {project.description || 'Define el alcance, equipo y entregables para este proyecto.'}
          </CardDescription>
        </div>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem disabled>Ver detalle</DropdownMenuItem>
              <DropdownMenuItem disabled>Duplicar</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(project.id)}>
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2 font-medium text-foreground">
            <FolderKanban className="size-4 text-primary" />
            {project.code ? (
              <Badge variant="secondary">{project.code}</Badge>
            ) : (
              <Badge variant="outline">SIN-CÓDIGO</Badge>
            )}
          </span>
          <span className="flex items-center gap-2 text-xs uppercase tracking-wide">
            <CalendarClock className="size-4" />
            Actualizado {updatedLabel}
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t pt-4">
        <Button variant="outline" size="sm" disabled>
          Abrir proyecto
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => onDelete?.(project.id)}>
          Eliminar
        </Button>
      </CardFooter>
    </Card>
  );
}
