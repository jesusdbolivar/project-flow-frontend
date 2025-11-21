import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface FormMetaDraft {
  id: string;
  title: string;
  description?: string;
  updatedAt: string;
}

interface FormsState {
  forms: Record<string, FormMetaDraft>;
  currentFormId: string | null;
  createForm: (title?: string, description?: string) => string;
  setCurrentForm: (id: string | null) => void;
  updateFormMeta: (id: string, data: Partial<Pick<FormMetaDraft, 'title' | 'description'>>) => void;
  deleteForm: (id: string) => void;
  exportForm: (id: string) => FormMetaDraft | null;
}

export const useFormsStore = create<FormsState>()(
  persist(
    (set, get) => ({
      forms: {},
      currentFormId: null,
      createForm: (title = 'Nuevo Formulario', description) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const draft: FormMetaDraft = { id, title, description, updatedAt: now };
        set(state => ({ forms: { ...state.forms, [id]: draft }, currentFormId: id }));
        return id;
      },
      setCurrentForm: (id) => set({ currentFormId: id }),
      updateFormMeta: (id, data) => {
        set(state => {
          const form = state.forms[id];
          if (!form) return state;
          return { forms: { ...state.forms, [id]: { ...form, ...data, updatedAt: new Date().toISOString() } } };
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
