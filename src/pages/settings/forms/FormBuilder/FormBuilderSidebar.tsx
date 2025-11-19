import * as LucideIcons from 'lucide-react';

import { Card } from '@/components/ui/card';
import { useDraggable } from '@dnd-kit/core';

import type { DraggableComponentType } from './types';

interface ComponentButtonProps {
  component: DraggableComponentType;
}

export function ComponentButton({ component }: ComponentButtonProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: component.id,
    data: component,
  });

  // Obtener el icono dinámicamente
  const IconComponent = (LucideIcons as any)[component.icon] || LucideIcons.Square;

  return (
    <Card
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <span className="font-medium text-sm">{component.label}</span>
      </div>
    </Card>
  );
}

interface FormBuilderSidebarProps {
  components: DraggableComponentType[];
}

export function FormBuilderSidebar({ components }: FormBuilderSidebarProps) {
  return (
    <div className="w-80 border-r bg-background flex flex-col overflow-hidden max-h-[calc(100vh-16rem)]">
      <div className="p-6 border-b shrink-0">
        <h3 className="text-lg font-semibold mb-2">Componentes</h3>
        <p className="text-sm text-muted-foreground">
          Arrastra para agregar al formulario
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-2">
          {components.map((component) => (
            <ComponentButton key={component.id} component={component} />
          ))}
        </div>
      </div>
    </div>
  );
}
