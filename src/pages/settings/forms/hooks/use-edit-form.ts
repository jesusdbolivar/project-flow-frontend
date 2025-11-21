import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  type FormSummary,
  updateForm,
} from '@/services/forms.api';

interface UseEditFormOptions {
  form: FormSummary;
  onUpdated?: (form: FormSummary) => void;
}

interface UseEditFormResult {
  open: boolean;
  setOpen: (v: boolean) => void;
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  loading: boolean;
  error: string | null;
  dirty: boolean;
  canSubmit: boolean;
  handleSubmit: () => Promise<void>;
  resetLocal: () => void;
}

// Hook de edición de metadatos de formulario (solo título/description)
export function useEditForm({ form, onUpdated }: UseEditFormOptions): UseEditFormResult {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(form.title);
  const [description, setDescription] = useState(form.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Si cambian props form desde fuera, sincronizar cuando el modal no esté abierto
  useEffect(() => {
    if (!open) {
      setTitle(form.title);
      setDescription(form.description ?? '');
    }
  }, [form.description, form.title, open]);

  const resetLocal = useCallback(() => {
    setTitle(form.title);
    setDescription(form.description ?? '');
    setError(null);
  }, [form.description, form.title]);

  const dirty = title.trim() !== form.title.trim() || (description.trim() || '') !== (form.description?.trim() || '');
  const canSubmit = dirty && title.trim().length >= 3 && !loading;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    try {
      const updated = await updateForm(form.id, { title: title.trim(), description: description.trim() || undefined });
      onUpdated?.(updated);
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError('No se pudo actualizar el formulario');
    } finally {
      setLoading(false);
    }
  }, [canSubmit, description, form.id, onUpdated, title]);

  return {
    open,
    setOpen,
    title,
    setTitle,
    description,
    setDescription,
    loading,
    error,
    dirty,
    canSubmit,
    handleSubmit,
    resetLocal,
  };
}
