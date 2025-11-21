import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  createForm,
  type FormSummary,
  listForms,
} from '@/services/forms.api';

export function useFormsList() {
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await listForms();
        if (mounted) setForms(data);
      } catch (err) {
        if (mounted) setError('No se pudieron cargar los formularios');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Mantener la función original (creación rápida) por compatibilidad si se reutiliza en otro sitio
  const handleCreateForm = useCallback(async () => {
    try {
      const newForm = await createForm({ title: 'Nuevo formulario' });
      setForms(prev => [newForm, ...prev]);
    } catch (err) {
      console.error('Error creating form', err);
    }
  }, []);

  // Nueva función para permitir que un modal u otro componente añada un formulario ya creado
  const appendForm = useCallback((form: FormSummary) => {
    setForms(prev => [form, ...prev]);
  }, []);

  // Actualiza un formulario existente en la lista (por id)
  const updateFormInList = useCallback((updated: FormSummary) => {
    setForms(prev => prev.map(f => (f.id === updated.id ? updated : f)));
  }, []);

  // Elimina un formulario por id de la lista
  const removeFormInList = useCallback((id: string) => {
    setForms(prev => prev.filter(f => f.id !== id));
  }, []);

  return { forms, loading, error, createForm: handleCreateForm, appendForm, updateFormInList, removeFormInList };
}
