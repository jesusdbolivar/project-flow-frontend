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

  const handleCreateForm = useCallback(async () => {
    try {
      const newForm = await createForm({ title: 'Nuevo formulario' });
      setForms(prev => [newForm, ...prev]);
    } catch (err) {
      console.error('Error creating form', err);
      // Aquí se podría añadir un toast de error
    }
  }, []);

  return { forms, loading, error, createForm: handleCreateForm };
}
