import {
  http,
  HttpResponse,
} from 'msw';

// Tipos para los cuerpos de requests de formularios
interface CreateFormBody {
  title?: string;
  description?: string;
}
interface UpdateFormBody {
  title?: string;
  description?: string;
}

// In-memory mock forms
let forms: Array<{ id: string; title: string; description?: string }> = [
  { id: 'f-1', title: 'Registro Usuario', description: 'Formulario de registro básico' },
  { id: 'f-2', title: 'Encuesta Satisfacción' },
];

export const formsHandlers = [
  http.get('/api/forms', () => {
    return HttpResponse.json(forms);
  }),
  http.post('/api/forms', async ({ request }) => {
    const raw = await request.json();
    if (!raw || typeof raw !== 'object') {
      return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    }
    const body = raw as CreateFormBody;
    const id = `f-${Date.now()}`;
    const form = {
      id,
      title: body.title?.trim() || 'Sin título',
      description: body.description?.trim() || undefined,
    };
    forms.push(form);
    return HttpResponse.json(form, { status: 201 });
  }),
  http.get('/api/forms/:id', ({ params }) => {
    const form = forms.find(f => f.id === params.id);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(form);
  }),
  http.put('/api/forms/:id', async ({ params, request }) => {
    const idx = forms.findIndex(f => f.id === params.id);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const raw = await request.json();
    if (!raw || typeof raw !== 'object') {
      return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    }
    const body = raw as UpdateFormBody;
    const current = forms[idx];
    forms[idx] = {
      ...current,
      ...(body.title !== undefined ? { title: body.title.trim() || current.title } : {}),
      ...(body.description !== undefined
        ? { description: body.description.trim() || undefined }
        : {}),
    };
    return HttpResponse.json(forms[idx]);
  }),
  http.delete('/api/forms/:id', ({ params }) => {
    const before = forms.length;
    forms = forms.filter(f => f.id !== params.id);
    if (forms.length === before) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return new HttpResponse(null, { status: 204 });
  }),
];
