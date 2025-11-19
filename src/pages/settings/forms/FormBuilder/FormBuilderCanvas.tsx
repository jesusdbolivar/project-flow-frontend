import { Plus } from 'lucide-react';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { DraggableField } from './DraggableField';
import type { FormField } from './types';

interface FormBuilderCanvasProps {
  fields: FormField[];
  onEditField: (field: FormField) => void;
  onDeleteField: (id: string) => void;
}

export function FormBuilderCanvas({
  fields,
  onEditField,
  onDeleteField,
}: FormBuilderCanvasProps) {
  const { setNodeRef } = useDroppable({
    id: 'canvas',
  });

  return (
    <div className="flex-1 flex flex-col bg-muted/20 overflow-hidden max-h-[calc(100vh-16rem)]">
      <div className="p-6 border-b bg-background/50 shrink-0">
        <h3 className="text-lg font-semibold">Canvas de Formulario</h3>
        <p className="text-sm text-muted-foreground">
          Arrastra componentes aquí para construir tu formulario
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div ref={setNodeRef} className="p-6">
          <div className="max-w-3xl mx-auto">
            {fields.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <Plus className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No hay campos aún
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm text-center">
                  Arrastra componentes desde el panel lateral para empezar
                </p>
              </div>
            ) : (
              <SortableContext
                items={fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 pb-6">
                  {fields.map((field) => (
                    <DraggableField
                      key={field.id}
                      field={field}
                      onEdit={onEditField}
                      onDelete={onDeleteField}
                    />
                  ))}
                </div>
              </SortableContext>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
