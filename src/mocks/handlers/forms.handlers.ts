import {
  http,
  HttpResponse,
} from 'msw';

import type { FormField } from '@/pages/settings/forms/FormBuilder/types';

// Tipos para requests de formularios
interface CreateFormBody { title?: string; description?: string; }
interface UpdateFormBody { title?: string; description?: string; }

// Utilidad simple para generar ids (evitar crypto en MSW por compatibilidad)
export function genId(prefix: string) { return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2,8)}`; }
// In-memory mock forms con fields
let forms: Array<{
  id: string;
  title: string;
  description?: string;
  updatedAt: string;
  fields: FormField[];
}> = [
  {
    id: 'f-1',
    title: 'Registro Usuario',
    description: 'Formulario de registro básico',
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'fld-username',
        name: 'username',
        label: 'Usuario',
        type: 'text',
        required: true,
        hidden: false,
        placeholder: 'tu_usuario',
        colSpan: 12,
        options: null,
        dataSource: null,
        searchable: false,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
        description: 'Nombre de usuario único',
        validation: { pattern: '^[a-zA-Z0-9_]{3,}$', message: 'Min 3 caracteres, sin espacios' },
      },
    ],
  },
  {
    id: 'f-2',
    title: 'Encuesta Satisfacción',
    description: undefined,
    updatedAt: new Date().toISOString(),
    fields: [],
  },
];

// Helpers compartidos con handlers de FormBuilder
export function findForm(id: string) { return forms.find(f => f.id === id); }
export function updateTimestamp(form: typeof forms[number]) { form.updatedAt = new Date().toISOString(); }

export const formsHandlers = [
  // List summaries
  http.get('/api/forms', () => {
    return HttpResponse.json(forms.map(({ fields, ...rest }) => rest));
  }),
  // Create form
  http.post('/api/forms', async ({ request }) => {
    const raw = await request.json();
    if (!raw || typeof raw !== 'object') return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    const body = raw as CreateFormBody;
    const id = genId('f');
    const form = {
      id,
      title: body.title?.trim() || 'Sin título',
      description: body.description?.trim() || undefined,
      updatedAt: new Date().toISOString(),
      fields: [] as FormField[],
    };
    forms.push(form);
    return HttpResponse.json({ ...form });
  }),
  // Get summary
  http.get('/api/forms/:id', ({ params }) => {
    const form = findForm(params.id as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const { fields, ...summary } = form;
    return HttpResponse.json(summary);
  }),
  // Update summary
  http.put('/api/forms/:id', async ({ params, request }) => {
    const form = findForm(params.id as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const raw = await request.json();
    if (!raw || typeof raw !== 'object') return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    const body = raw as UpdateFormBody;
    if (body.title !== undefined) form.title = body.title.trim() || form.title;
    if (body.description !== undefined) form.description = body.description.trim() || undefined;
    updateTimestamp(form);
    const { fields, ...summary } = form;
    return HttpResponse.json(summary);
  }),
  // Delete form
  http.delete('/api/forms/:id', ({ params }) => {
    const before = forms.length;
    forms = forms.filter(f => f.id !== params.id);
    if (forms.length === before) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return new HttpResponse(null, { status: 204 });
  }),

  // (Endpoints de FormBuilder movidos a form-builder.handlers.ts)
];
