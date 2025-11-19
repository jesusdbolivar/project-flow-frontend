import { useState } from 'react';

import { v4 as uuidv4 } from 'uuid';

import type {
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
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
import type {
  DraggableComponentType,
  FormField,
} from './types';
import { COMPONENT_TYPES } from './types';

interface FormBuilderProps {
  initialFields?: FormField[];
  onChange?: (fields: FormField[]) => void;
}

export function FormBuilder({ initialFields = [], onChange }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>(initialFields);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<FormField | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Si es un nuevo componente desde el sidebar
    if (active.data.current && 'type' in active.data.current) {
      const componentData = active.data.current as DraggableComponentType;
      
      const newField: FormField = {
        id: uuidv4(),
        name: null,
        label: `Nuevo ${componentData.label}`,
        type: componentData.type,
        required: false,
        hidden: false,
        placeholder: null,
        colSpan: 12, // Ancho completo por defecto
        options: null,
        dataSource: null,
        searchable: false,
      };

      // Si es select o radio, agregar opciones por defecto
      if (componentData.type === 'select' || componentData.type === 'radio') {
        newField.options = [
          { label: 'Opción 1', value: 'option1' },
          { label: 'Opción 2', value: 'option2' },
        ];
      }

      // Si es botón, configurar valores por defecto
      if (componentData.type === 'button') {
        newField.buttonVariant = 'default';
        newField.buttonAction = 'submit';
        newField.buttonAlign = 'center';
        newField.label = 'Enviar';
      }

      const newFields = [...fields, newField];
      setFields(newFields);
      onChange?.(newFields);
      return;
    }

    // Si es reordenamiento de campos existentes
    if (active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newFields = arrayMove(fields, oldIndex, newIndex);
        setFields(newFields);
        onChange?.(newFields);
      }
    }
  };

  const handleEditField = (field: FormField) => {
    setEditingField(field);
    setIsEditorOpen(true);
  };

  const handleSaveField = (updatedField: FormField) => {
    const newFields = fields.map((f) =>
      f.id === updatedField.id ? updatedField : f
    );
    setFields(newFields);
    onChange?.(newFields);
  };

  const handleDeleteField = (id: string) => {
    const newFields = fields.filter((f) => f.id !== id);
    setFields(newFields);
    onChange?.(newFields);
  };

  return (
    <div className="flex h-full overflow-hidden border rounded-lg">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <FormBuilderSidebar components={COMPONENT_TYPES} />
        <FormBuilderCanvas
          fields={fields}
          onEditField={handleEditField}
          onDeleteField={handleDeleteField}
        />

        <DragOverlay>
          {activeId ? (
            <div className="bg-card border rounded-lg p-4 shadow-lg">
              Arrastrando...
            </div>
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
