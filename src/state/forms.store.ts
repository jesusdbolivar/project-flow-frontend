import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Tipos base para el builder (simplificados). Ajusta según tu modelo real.
export interface FormFieldDraft {
  id: string;
  type: string;
  label?: string;
  name?: string;
  required?: boolean;
  hidden?: boolean;
  colSpan?: number;
  options?: Array<{ label: string; value: string }>;
}

export interface FormDraft {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldDraft[];
  updatedAt: string;
}

interface FormsState {
  forms: Record<string, FormDraft>;
  currentFormId: string | null;
  createForm: (title?: string, description?: string) => string;
  setCurrentForm: (id: string | null) => void;
  updateFormMeta: (id: string, data: Partial<Pick<FormDraft, 'title' | 'description'>>) => void;
  addField: (formId: string, field: FormFieldDraft) => void;
  updateField: (formId: string, fieldId: string, data: Partial<FormFieldDraft>) => void;
  removeField: (formId: string, fieldId: string) => void;
  deleteForm: (id: string) => void;
  exportForm: (id: string) => FormDraft | null;
}

export const useFormsStore = create<FormsState>()(
  persist(
    (set, get) => ({
      forms: {},
      currentFormId: null,
      createForm: (title = 'Nuevo Formulario', description) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const draft: FormDraft = {
          id,
          title,
          description,
          fields: [],
          updatedAt: now,
        };
        set(state => ({ forms: { ...state.forms, [id]: draft }, currentFormId: id }));
        return id;
      },
      setCurrentForm: (id) => set({ currentFormId: id }),
      updateFormMeta: (id, data) => {
        set(state => {
          const form = state.forms[id];
          if (!form) return state;
          return {
            forms: {
              ...state.forms,
              [id]: { ...form, ...data, updatedAt: new Date().toISOString() },
            },
          };
        });
      },
      addField: (formId, field) => {
        set(state => {
          const form = state.forms[formId];
          if (!form) return state;
          return {
            forms: {
              ...state.forms,
              [formId]: { ...form, fields: [...form.fields, field], updatedAt: new Date().toISOString() },
            },
          };
        });
      },
      updateField: (formId, fieldId, data) => {
        set(state => {
          const form = state.forms[formId];
          if (!form) return state;
          return {
            forms: {
              ...state.forms,
              [formId]: {
                ...form,
                fields: form.fields.map(f => (f.id === fieldId ? { ...f, ...data } : f)),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      removeField: (formId, fieldId) => {
        set(state => {
          const form = state.forms[formId];
          if (!form) return state;
          return {
            forms: {
              ...state.forms,
              [formId]: {
                ...form,
                fields: form.fields.filter(f => f.id !== fieldId),
                updatedAt: new Date().toISOString(),
              },
            },
          };
        });
      },
      deleteForm: (id) => {
        set(state => {
          const { [id]: _, ...rest } = state.forms;
          return { forms: rest, currentFormId: state.currentFormId === id ? null : state.currentFormId };
        });
      },
      exportForm: (id) => {
        const form = get().forms[id];
        return form ? { ...form } : null;
      },
    }),
    { name: 'forms-store' }
  )
);
