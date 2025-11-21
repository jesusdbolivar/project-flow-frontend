import type {
  FormField,
  FormSchema,
} from '@/pages/settings/forms/FormBuilder/types';

export interface FormDetails {
  id: string;
  title: string;
  description?: string;
  updatedAt?: string;
  fields: FormField[];
}

const BASE = '/api/forms';

function json<T>(res: Response): Promise<T> { return res.json(); }
function ensureOk(res: Response, message: string) { if (!res.ok) throw new Error(message); }

export async function getFormDetails(id: string): Promise<FormDetails> {
  const res = await fetch(`${BASE}/${id}/schema`);
  if (res.status === 404) throw new Error('Formulario no encontrado');
  ensureOk(res, 'Error obteniendo detalles del formulario');
  return json<FormDetails>(res);
}

export async function listFormFields(formId: string): Promise<FormField[]> {
  const res = await fetch(`${BASE}/${formId}/fields`);
  if (res.status === 404) throw new Error('Formulario no encontrado');
  ensureOk(res, 'Error listando campos');
  return json<FormField[]>(res);
}

export async function addFormField(formId: string, field: Omit<FormField, 'id'>): Promise<FormField> {
  const res = await fetch(`${BASE}/${formId}/fields`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(field),
  });
  if (res.status === 404) throw new Error('Formulario no encontrado');
  ensureOk(res, 'Error agregando campo');
  return json<FormField>(res);
}

export async function updateFormField(formId: string, fieldId: string, data: Partial<FormField>): Promise<FormField> {
  const res = await fetch(`${BASE}/${formId}/fields/${fieldId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (res.status === 404) throw new Error('Campo o formulario no encontrado');
  ensureOk(res, 'Error actualizando campo');
  return json<FormField>(res);
}

export async function deleteFormField(formId: string, fieldId: string): Promise<void> {
  const res = await fetch(`${BASE}/${formId}/fields/${fieldId}`, { method: 'DELETE' });
  if (res.status === 404) throw new Error('Campo o formulario no encontrado');
  ensureOk(res, 'Error eliminando campo');
}

export async function reorderFormFields(formId: string, orderedIds: string[]): Promise<FormField[]> {
  const res = await fetch(`${BASE}/${formId}/fields/reorder`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order: orderedIds }),
  });
  if (res.status === 404) throw new Error('Formulario no encontrado');
  ensureOk(res, 'Error reordenando campos');
  return json<FormField[]>(res);
}

export async function replaceFormSchema(formId: string, schema: FormSchema): Promise<FormDetails> {
  const res = await fetch(`${BASE}/${formId}/schema`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schema),
  });
  if (res.status === 404) throw new Error('Formulario no encontrado');
  ensureOk(res, 'Error reemplazando schema');
  return json<FormDetails>(res);
}
