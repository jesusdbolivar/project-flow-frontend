import {
  useCallback,
  useState,
} from 'react';

import {
  createForm,
  type FormSummary,
} from '@/services/forms.api';

interface UseCreateFormOptions {
  onCreated?: (form: FormSummary) => void;
}

interface UseCreateForm {
  open: boolean;
  setOpen: (v: boolean) => void;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  loading: boolean;
  error: string | null;
  canSubmit: boolean;
  handleSubmit: () => Promise<void>;
  reset: () => void;
}

// Hook de lógica aislada para creación de formularios vía modal
export function useCreateForm(options: UseCreateFormOptions = {}): UseCreateForm {
  const { onCreated } = options;
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setTitle('');
    setDescription('');
    setError(null);
  }, []);

  const canSubmit = title.trim().length >= 3 && !loading;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const form = await createForm({ title: title.trim(), description: description.trim() || undefined });
      onCreated?.(form);
      // Cerrar y limpiar
      setOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      setError('No se pudo crear el formulario');
    } finally {
      setLoading(false);
    }
  }, [canSubmit, description, onCreated, reset, title]);

  return {
    open,
    setOpen,
    title,
    setTitle,
    description,
    setDescription,
    loading,
    error,
    canSubmit,
    handleSubmit,
    reset,
  };
}
