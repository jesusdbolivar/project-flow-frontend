import { useState } from 'react';

import { v4 as uuid } from 'uuid';

import { useFormBuilderStore } from '@/state/formBuilder.store';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { FieldEditor } from './FieldEditor';
import { FormBuilderCanvas } from './FormBuilderCanvas';
import { FormBuilderSidebar } from './FormBuilderSidebar';
import {
  COMPONENT_TYPES,
  type DraggableComponentType,
  type FormField,
} from './types';

interface FormBuilderViewProps {
  // Mantener firma extensible; formId no usado directamente aquí (lo usa el contenedor)
}

export function FormBuilderView({}: FormBuilderViewProps) {
  const { currentForm, setLocalFields } = useFormBuilderStore();

  const fields = currentForm?.fields || [];
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    if (active.data.current && 'type' in active.data.current) {
      const componentData = active.data.current as DraggableComponentType;
      const baseField: Omit<FormField, 'id'> = {
        name: null,
        label: componentData.type === 'button' ? 'Enviar' : `Nuevo ${componentData.label}`,
        type: componentData.type,
        required: false,
        hidden: false,
        placeholder: null,
        colSpan: 12,
        options:
          componentData.type === 'select' || componentData.type === 'radio'
            ? [
                { label: 'Opción 1', value: 'option1' },
                { label: 'Opción 2', value: 'option2' },
              ]
            : null,
        dataSource: null,
        searchable: false,
        buttonVariant: componentData.type === 'button' ? 'default' : undefined,
        buttonAction: componentData.type === 'button' ? 'submit' : undefined,
        buttonRedirectUrl: null,
        buttonAlign: componentData.type === 'button' ? 'center' : undefined,
        description: undefined,
        validation: undefined,
      };
      // Solo edición local; persistirá en Guardar.
      setLocalFields([...fields, { ...(baseField as FormField), id: uuid() }]);
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = fields.findIndex(f => f.id === active.id);
      const newIndex = fields.findIndex(f => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(fields, oldIndex, newIndex);
        setLocalFields(newFields);
      }
    }
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setIsEditorOpen(true);
  };

  const handleSaveField = (updated: FormField) => {
    setLocalFields(fields.map(f => (f.id === updated.id ? updated : f)));
  };

  const handleDeleteField = (id: string) => {
    setLocalFields(fields.filter(f => f.id !== id));
  };

  return (
    <div className="flex h-full overflow-hidden">
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <FormBuilderSidebar components={COMPONENT_TYPES} />
        <FormBuilderCanvas fields={fields} onEditField={handleEditField} onDeleteField={handleDeleteField} />
        <DragOverlay>
          {activeId ? (
            <div className="bg-card border rounded-lg p-4 shadow-lg">Arrastrando...</div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <FieldEditor
        field={editingField}
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setEditingField(null);
        }}
        onSave={handleSaveField}
      />
    </div>
  );
}
