// =============================
// Tipos Públicos del Servicio (Forms CRUD)
// =============================
export interface FormSummary {
  id: string;
  title: string;
  description?: string;
  updatedAt?: string;
}

const BASE = '/api/forms';

function json<T>(res: Response): Promise<T> { return res.json(); }
function ensureOk(res: Response, message: string) { if (!res.ok) throw new Error(message); }

// CRUD básico (sin campos / builder)
export async function listForms(): Promise<FormSummary[]> {
  const res = await fetch(BASE);
  ensureOk(res, 'Error listando formularios');
  return json<FormSummary[]>(res);
}

export async function getForm(id: string): Promise<FormSummary> {
  const res = await fetch(`${BASE}/${id}`);
  if (res.status === 404) throw new Error('Formulario no encontrado');
  ensureOk(res, 'Error obteniendo formulario');
  return json<FormSummary>(res);
}

export async function createForm(data: { title: string; description?: string }): Promise<FormSummary> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ensureOk(res, 'Error creando formulario');
  return json<FormSummary>(res);
}

export async function updateForm(id: string, data: Partial<{ title: string; description: string }>): Promise<FormSummary> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  ensureOk(res, 'Error actualizando formulario');
  return json<FormSummary>(res);
}

export async function deleteForm(id: string): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (res.status === 404) throw new Error('Formulario no encontrado');
  ensureOk(res, 'Error eliminando formulario');
}

