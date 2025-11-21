import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { FormField } from '@/pages/settings/forms/FormBuilder/types';
import type { FormDetails } from '@/services/form-builder.api';
import {
  getFormDetails,
  replaceFormSchema,
} from '@/services/form-builder.api';

interface FormBuilderState {
  currentForm: FormDetails | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  dirty: boolean; // cambios locales sin guardar
  loadForm: (id: string) => Promise<void>;
  replaceSchema: (schema: { title: string; description?: string; fields: FormField[] }) => Promise<FormDetails | null>;
  setLocalFields: (fields: FormField[]) => void;
  resetError: () => void;
  resetDirty: () => void;
}

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      currentForm: null,
      loading: false,
      error: null,
      notFound: false,
      dirty: false,
      async loadForm(id) {
        set({ loading: true, error: null, notFound: false, dirty: false });
        try {
          const details = await getFormDetails(id);
          set({ currentForm: details, loading: false, dirty: false });
        } catch (e: any) {
          if (e.code === 'NOT_FOUND' || e.message === 'NOT_FOUND') {
            set({ notFound: true, loading: false, currentForm: null, dirty: false });
          } else {
            set({ error: e.message || 'Error cargando formulario', loading: false });
          }
        }
      },
      async replaceSchema(schema) {
        const form = get().currentForm;
        if (!form) return null;
        try {
          const replaced = await replaceFormSchema(form.id, schema);
          set({ currentForm: replaced, dirty: false });
          return replaced;
        } catch (e) {
          set({ error: (e as any).message || 'Error reemplazando schema' });
          return null;
        }
      },
      setLocalFields(fields) {
        const form = get().currentForm;
        if (!form) return;
        set({ currentForm: { ...form, fields }, dirty: true });
      },
      resetError() { set({ error: null }); },
      resetDirty() { set({ dirty: false }); },
    }),
    { name: 'form-builder-store' }
  )
);
