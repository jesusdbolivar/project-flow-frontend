import {
  http,
  HttpResponse,
} from 'msw';

import type {
  FormField,
  FormSchema,
} from '@/pages/settings/forms/FormBuilder/types';

import {
  findForm,
  genId,
  updateTimestamp,
} from './forms.handlers';

interface CreateFieldBody extends Omit<FormField, 'id'> {}
interface UpdateFieldBody extends Partial<FormField> {}
interface ReorderBody { order: string[]; }

export const formBuilderHandlers = [
  // Full schema
  http.get('/api/forms/:id/schema', ({ params }) => {
    const form = findForm(params.id as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json({ ...form });
  }),
  http.put('/api/forms/:id/schema', async ({ params, request }) => {
    const form = findForm(params.id as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const raw = await request.json();
    if (!raw || typeof raw !== 'object') return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    const body = raw as FormSchema;
    form.title = body.title?.trim() || form.title;
    form.description = body.description?.trim() || form.description;
    form.fields = body.fields.map(f => ({ ...f }));
    updateTimestamp(form);
    return HttpResponse.json({ ...form });
  }),
  // List fields
  http.get('/api/forms/:id/fields', ({ params }) => {
    const form = findForm(params.id as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(form.fields);
  }),
  // Create field
  http.post('/api/forms/:id/fields', async ({ params, request }) => {
    const form = findForm(params.id as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const raw = await request.json();
    if (!raw || typeof raw !== 'object') return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    const body = raw as CreateFieldBody;
    const field: FormField = {
      id: genId('fld'),
      name: body.name || null,
      label: body.label || null,
      type: body.type,
      required: body.required ?? false,
      hidden: body.hidden ?? false,
      placeholder: body.placeholder || null,
      colSpan: body.colSpan ?? 12,
      options: body.options ?? null,
      dataSource: body.dataSource ?? null,
      searchable: body.searchable ?? false,
      buttonVariant: body.buttonVariant,
      buttonAction: body.buttonAction,
      buttonRedirectUrl: body.buttonRedirectUrl || null,
      buttonAlign: body.buttonAlign,
      description: body.description,
      validation: body.validation,
    };
    form.fields.push(field);
    updateTimestamp(form);
    return HttpResponse.json(field, { status: 201 });
  }),
  // Update field
  http.put('/api/forms/:formId/fields/:fieldId', async ({ params, request }) => {
    const form = findForm(params.formId as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const idx = form.fields.findIndex(f => f.id === params.fieldId);
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const raw = await request.json();
    if (!raw || typeof raw !== 'object') return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    const body = raw as UpdateFieldBody;
    form.fields[idx] = { ...form.fields[idx], ...body };
    updateTimestamp(form);
    return HttpResponse.json(form.fields[idx]);
  }),
  // Delete field
  http.delete('/api/forms/:formId/fields/:fieldId', ({ params }) => {
    const form = findForm(params.formId as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const before = form.fields.length;
    form.fields = form.fields.filter(f => f.id !== params.fieldId);
    if (before === form.fields.length) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    updateTimestamp(form);
    return new HttpResponse(null, { status: 204 });
  }),
  // Reorder fields
  http.patch('/api/forms/:id/fields/reorder', async ({ params, request }) => {
    const form = findForm(params.id as string);
    if (!form) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    const raw = await request.json();
    if (!raw || typeof raw !== 'object') return HttpResponse.json({ message: 'Invalid body' }, { status: 400 });
    const body = raw as ReorderBody;
    const idSet = new Set(body.order);
    // Validación rápida: todos existen
    if (form.fields.some(f => !idSet.has(f.id))) {
      return HttpResponse.json({ message: 'Order contiene ids inválidos' }, { status: 400 });
    }
    const map = new Map(form.fields.map(f => [f.id, f]));
    form.fields = body.order.map(id => map.get(id)!);
    updateTimestamp(form);
    return HttpResponse.json(form.fields);
  }),
];
