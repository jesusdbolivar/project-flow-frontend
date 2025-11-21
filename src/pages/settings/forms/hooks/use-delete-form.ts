import {
  useCallback,
  useState,
} from 'react';

import {
  deleteForm,
  type FormSummary,
} from '@/services/forms.api';

interface UseDeleteFormOptions {
  form: FormSummary;
  onDeleted?: (id: string) => void;
}

interface UseDeleteFormResult {
  open: boolean;
  setOpen: (v: boolean) => void;
  loading: boolean;
  error: string | null;
  confirmDelete: () => Promise<void>;
}

// Lógica aislada para confirmar eliminación de un formulario
export function useDeleteForm({ form, onDeleted }: UseDeleteFormOptions): UseDeleteFormResult {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmDelete = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteForm(form.id);
      onDeleted?.(form.id);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError('No se pudo eliminar el formulario');
    } finally {
      setLoading(false);
    }
  }, [form.id, onDeleted]);

  return { open, setOpen, loading, error, confirmDelete };
}
