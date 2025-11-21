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
    id: 'f-projects',
    title: 'Proyectos',
    description: 'Campos base para describir un proyecto y hacer seguimiento.',
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'fld-project-name',
        name: 'projectName',
        label: 'Nombre del proyecto',
        type: 'text',
        required: true,
        hidden: false,
        placeholder: 'Implementación CRM LATAM',
        colSpan: 12,
        options: null,
        dataSource: null,
        searchable: true,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
        description: 'Identificador legible del proyecto',
        validation: { min: 3, message: 'Debe tener al menos 3 caracteres' },
      },
      {
        id: 'fld-project-code',
        name: 'projectCode',
        label: 'Código',
        type: 'text',
        required: false,
        hidden: false,
        placeholder: 'PRJ-2045',
        colSpan: 6,
        options: null,
        dataSource: null,
        searchable: true,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
        description: 'Código interno o comercial',
      },
      {
        id: 'fld-project-owner',
        name: 'projectOwner',
        label: 'Líder',
        type: 'text',
        required: false,
        hidden: false,
        placeholder: 'María Pérez',
        colSpan: 6,
        options: null,
        dataSource: null,
        searchable: true,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
        description: 'Responsable principal del proyecto',
      },
      {
        id: 'fld-project-status',
        name: 'projectStatus',
        label: 'Estado',
        type: 'select',
        required: false,
        hidden: false,
        placeholder: null,
        colSpan: 6,
        options: [
          { label: 'Planeación', value: 'planning' },
          { label: 'En ejecución', value: 'active' },
          { label: 'En pausa', value: 'on_hold' },
          { label: 'Cerrado', value: 'closed' },
        ],
        dataSource: null,
        searchable: false,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
        description: 'Estado operativo actual',
      },
      {
        id: 'fld-project-budget',
        name: 'projectBudget',
        label: 'Presupuesto (USD)',
        type: 'number',
        required: false,
        hidden: false,
        placeholder: '500000',
        colSpan: 6,
        options: null,
        dataSource: null,
        searchable: false,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
        description: 'Monto asignado',
      },
    ],
  },
  {
    id: 'f-contracts',
    title: 'Contratos',
    description: 'Plantilla para documentar contratos vinculados a proyectos.',
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'fld-contract-name',
        name: 'contractName',
        label: 'Nombre del contrato',
        type: 'text',
        required: true,
        hidden: false,
        placeholder: 'Contrato marco 2025',
        colSpan: 12,
        options: null,
        dataSource: null,
        searchable: true,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
      },
      {
        id: 'fld-contract-code',
        name: 'contractCode',
        label: 'Código',
        type: 'text',
        required: false,
        hidden: false,
        placeholder: 'CNT-01',
        colSpan: 4,
        options: null,
        dataSource: null,
        searchable: false,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
      },
      {
        id: 'fld-contract-type',
        name: 'contractType',
        label: 'Tipo',
        type: 'select',
        required: false,
        hidden: false,
        placeholder: null,
        colSpan: 4,
        options: [
          { label: 'Servicio', value: 'service' },
          { label: 'Suministro', value: 'supply' },
          { label: 'Consultoría', value: 'consulting' },
        ],
        dataSource: null,
        searchable: false,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
      },
      {
        id: 'fld-contract-amount',
        name: 'contractAmount',
        label: 'Valor (USD)',
        type: 'number',
        required: false,
        hidden: false,
        placeholder: '150000',
        colSpan: 4,
        options: null,
        dataSource: null,
        searchable: false,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
      },
      {
        id: 'fld-contract-date',
        name: 'signatureDate',
        label: 'Fecha de firma',
        type: 'date',
        required: false,
        hidden: false,
        placeholder: null,
        colSpan: 6,
        options: null,
        dataSource: null,
        searchable: false,
        buttonVariant: undefined,
        buttonAction: undefined,
        buttonRedirectUrl: null,
        buttonAlign: undefined,
      },
    ],
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
