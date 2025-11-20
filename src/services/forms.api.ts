export interface FormSummary {
  id: string;
  title: string;
  description?: string;
}

const BASE = '/api/forms';

export async function listForms(): Promise<FormSummary[]> {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Error listando formularios');
  return res.json();
}

export async function getForm(id: string): Promise<FormSummary> {
  const res = await fetch(`${BASE}/${id}`);
  if (res.status === 404) throw new Error('Formulario no encontrado');
  if (!res.ok) throw new Error('Error obteniendo formulario');
  return res.json();
}

export async function createForm(data: { title: string; description?: string }): Promise<FormSummary> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error creando formulario');
  return res.json();
}

export async function updateForm(id: string, data: Partial<{ title: string; description: string }>): Promise<FormSummary> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error actualizando formulario');
  return res.json();
}

export async function deleteForm(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (res.status === 404) throw new Error('Formulario no encontrado');
  if (!res.ok) throw new Error('Error eliminando formulario');
}
