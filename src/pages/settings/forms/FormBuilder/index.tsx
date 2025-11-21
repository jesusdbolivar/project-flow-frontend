import { useEffect } from 'react';

import { useFormBuilderStore } from '@/state/formBuilder.store';

import { FormBuilderView } from './FormBuilderView';

interface FormBuilderProps {
  formId: string; // Identificador del formulario a editar
}

export function FormBuilder({ formId }: FormBuilderProps) {
  const { loadForm, loading, error, notFound, resetError } = useFormBuilderStore();

  useEffect(() => { loadForm(formId); }, [formId, loadForm]);

  if (loading) {
    return (
      <div className="p-6 text-sm text-muted-foreground animate-pulse">
        Cargando formulario...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-8 border rounded-md bg-muted/30 flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Formulario no encontrado</h3>
          <p className="text-sm text-muted-foreground">El identificador "{formId}" no corresponde a un formulario existente. Puedes crear uno nuevo o volver al listado.</p>
        </div>
        <div className="flex gap-2">
          {/* Botones de acción reales se podrían agregar aquí */}
        </div>
      </div>
    );
  }

  return (
    <div className="relative border rounded-lg">
      {error && (
        <div className="absolute top-2 right-2 text-xs bg-destructive text-destructive-foreground px-2 py-1 rounded">
          {error}
          <button
            className="ml-2 underline"
            onClick={() => resetError()}
          >
            ocultar
          </button>
        </div>
      )}
      <FormBuilderView />
    </div>
  );
}
