import {
  EyeOff,
  Globe,
  GripVertical,
  Search,
  Settings,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import type { FormField } from './types';

interface DraggableFieldProps {
  field: FormField;
  onEdit: (field: FormField) => void;
  onDelete: (id: string) => void;
}

export function DraggableField({ field, onEdit, onDelete }: DraggableFieldProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-4 mb-2 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <button
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">
                {field.label || 'Sin etiqueta'}
              </span>
              {field.type === 'button' && field.buttonVariant && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  {field.buttonVariant}
                </Badge>
              )}
              {field.type !== 'button' && field.required && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                  Obligatorio
                </Badge>
              )}
              {field.hidden && (
                <Badge variant="secondary" className="text-xs px-1.5 py-0">
                  <EyeOff className="h-3 w-3 mr-1" />
                  Oculto
                </Badge>
              )}
              {field.dataSource?.url && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  <Globe className="h-3 w-3 mr-1" />
                  API
                </Badge>
              )}
              {field.searchable && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  <Search className="h-3 w-3 mr-1" />
                  Búsqueda
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {field.type}
              </Badge>
              {field.type === 'button' && (
                <>
                  {field.buttonAction && (
                    <span className="text-muted-foreground">
                      {field.buttonAction === 'submit' && '📤 Enviar'}
                      {field.buttonAction === 'reset' && '🔄 Limpiar'}
                      {field.buttonAction === 'back' && '⬅️ Volver'}
                      {field.buttonAction === 'redirect' && '🔗 Ir a'}
                    </span>
                  )}
                  {field.buttonAlign && field.buttonAlign !== 'center' && (
                    <span className="text-muted-foreground">
                      {field.buttonAlign === 'left' && '← Izquierda'}
                      {field.buttonAlign === 'right' && 'Derecha →'}
                    </span>
                  )}
                </>
              )}
              {field.type !== 'button' && field.name && (
                <span className="font-mono bg-muted px-2 py-0.5 rounded">
                  {field.name}
                </span>
              )}
              {field.colSpan && field.colSpan < 12 && (
                <span className="text-muted-foreground">
                  Ancho: {field.colSpan}/12
                </span>
              )}
            </div>
            {field.type !== 'button' && field.placeholder && (
              <div className="text-xs text-muted-foreground mt-1">
                "{field.placeholder}"
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(field)}
              title="Configurar campo"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(field.id)}
              title="Eliminar campo"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
