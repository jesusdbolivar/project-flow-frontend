import {
  format,
  formatDistanceToNow,
  parseISO,
} from 'date-fns';
import { es } from 'date-fns/locale';
import {
  CalendarClock,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { FormField } from '@/pages/settings/forms/FormBuilder/types';
import type { Project } from '@/state/projects.store';

interface ProjectsListProps {
  projects: Project[];
  fields: FormField[];
  onDeleteProject?: (id: string) => void;
}

const numberFormatter = new Intl.NumberFormat('es-CO', {
  maximumFractionDigits: 2,
});

const getFieldKey = (field: FormField) => field.name ?? field.id;

const resolveOptionLabel = (field: FormField, value: unknown) => {
  if (!field.options || value === undefined || value === null) return value;
  const option = field.options.find((opt) => opt.value === value);
  return option?.label ?? value;
};

const renderFieldValue = (field: FormField, project: Project) => {
  const key = getFieldKey(field);
  const value = project.attributes?.[key];

  if (value === undefined || value === null || value === '') {
    return <span className="text-muted-foreground">Sin valor</span>;
  }

  if (field.type === 'checkbox' || field.type === 'switch') {
    const isActive = Boolean(value);
    return (
      <Badge variant={isActive ? 'default' : 'outline'}>{isActive ? 'Sí' : 'No'}</Badge>
    );
  }

  if (field.type === 'select' || field.type === 'radio') {
    const label = resolveOptionLabel(field, value);
    return <span className="font-medium text-foreground">{String(label)}</span>;
  }

  if (field.type === 'number') {
    return (
      <span className="tabular-nums font-medium">
        {numberFormatter.format(Number(value))}
      </span>
    );
  }

  if (field.type === 'date') {
    try {
      const date = new Date(String(value));
      if (Number.isNaN(date.getTime())) throw new Error('Invalid date');
      return <span>{format(date, 'dd MMM yyyy', { locale: es })}</span>;
    } catch {
      return <span>{String(value)}</span>;
    }
  }

  return <span className="text-foreground">{String(value)}</span>;
};

export function ProjectsList({ projects, fields, onDeleteProject }: ProjectsListProps) {
  return (
    <div className="rounded-2xl border bg-card p-2 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {fields.map((field) => (
              <TableHead key={field.id}>{field.label || field.name || 'Campo sin nombre'}</TableHead>
            ))}
            <TableHead>Actualizado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              {fields.map((field) => (
                <TableCell key={`${project.id}-${field.id}`} className="max-w-[240px]">
                  {renderFieldValue(field, project)}
                </TableCell>
              ))}
              <TableCell>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarClock className="size-4" />
                  {formatDistanceToNow(parseISO(project.updatedAt), { addSuffix: true, locale: es })}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() => onDeleteProject?.(project.id)}
                >
                  <Trash2 className="size-4" />
                  Eliminar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
