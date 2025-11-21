import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { FormField } from '@/pages/settings/forms/FormBuilder/types';
import type { FormDetails } from '@/services/form-builder.api';
import {
  addFormField,
  deleteFormField,
  getFormDetails,
  reorderFormFields,
  replaceFormSchema,
  updateFormField,
} from '@/services/form-builder.api';

interface FormBuilderState {
  currentForm: FormDetails | null;
  loading: boolean;
  error: string | null;
  loadForm: (id: string) => Promise<void>;
  addField: (field: Omit<FormField, 'id'>) => Promise<FormField | null>;
  updateField: (fieldId: string, data: Partial<FormField>) => Promise<FormField | null>;
  removeField: (fieldId: string) => Promise<boolean>;
  reorderFields: (orderedIds: string[]) => Promise<FormField[] | null>;
  replaceSchema: (schema: { title: string; description?: string; fields: FormField[] }) => Promise<FormDetails | null>;
  setLocalFields: (fields: FormField[]) => void; // para edición local antes de persistir
}

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (set, get) => ({
      currentForm: null,
      loading: false,
      error: null,
      async loadForm(id) {
        set({ loading: true, error: null });
        try {
          const details = await getFormDetails(id);
          set({ currentForm: details, loading: false });
        } catch (e: any) {
          set({ error: e.message || 'Error cargando formulario', loading: false });
        }
      },
      async addField(field) {
        const form = get().currentForm;
        if (!form) return null;
        try {
          const created = await addFormField(form.id, field);
          set({ currentForm: { ...form, fields: [...form.fields, created] } });
          return created;
        } catch (e) {
          set({ error: (e as any).message || 'Error agregando campo' });
          return null;
        }
      },
      async updateField(fieldId, data) {
        const form = get().currentForm;
        if (!form) return null;
        try {
          const updated = await updateFormField(form.id, fieldId, data);
          set({
            currentForm: {
              ...form,
              fields: form.fields.map(f => (f.id === fieldId ? updated : f)),
            },
          });
          return updated;
        } catch (e) {
          set({ error: (e as any).message || 'Error actualizando campo' });
          return null;
        }
      },
      async removeField(fieldId) {
        const form = get().currentForm;
        if (!form) return false;
        try {
          await deleteFormField(form.id, fieldId);
          set({ currentForm: { ...form, fields: form.fields.filter(f => f.id !== fieldId) } });
          return true;
        } catch (e) {
          set({ error: (e as any).message || 'Error eliminando campo' });
          return false;
        }
      },
      async reorderFields(orderedIds) {
        const form = get().currentForm;
        if (!form) return null;
        try {
          const reordered = await reorderFormFields(form.id, orderedIds);
          set({ currentForm: { ...form, fields: reordered } });
          return reordered;
        } catch (e) {
          set({ error: (e as any).message || 'Error reordenando campos' });
          return null;
        }
      },
      async replaceSchema(schema) {
        const form = get().currentForm;
        if (!form) return null;
        try {
          const replaced = await replaceFormSchema(form.id, schema);
          set({ currentForm: replaced });
          return replaced;
        } catch (e) {
          set({ error: (e as any).message || 'Error reemplazando schema' });
          return null;
        }
      },
      setLocalFields(fields) {
        const form = get().currentForm;
        if (!form) return;
        set({ currentForm: { ...form, fields } });
      },
    }),
    { name: 'form-builder-store' }
  )
);
