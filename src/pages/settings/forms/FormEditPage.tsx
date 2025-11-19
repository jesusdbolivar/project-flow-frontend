import { useState } from 'react';

import {
  ArrowLeft,
  Code2,
  Eye,
  Save,
} from 'lucide-react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { FormBuilder } from './FormBuilder';
import { FormPreview } from './FormBuilder/FormPreview';
import type {
  FormField,
  FormSchema,
} from './FormBuilder/types';

export function FormEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [fields, setFields] = useState<FormField[]>([]);
  const [formTitle, setFormTitle] = useState('Formulario sin título');

  // Función para limpiar el JSON eliminando propiedades innecesarias
  const cleanFieldForSave = (field: FormField) => {
    const cleaned: any = {
      id: field.id,
      type: field.type,
    };

    // Solo agregar propiedades si tienen valor
    if (field.name) cleaned.name = field.name;
    if (field.label) cleaned.label = field.label;
    if (field.placeholder) cleaned.placeholder = field.placeholder;
    if (field.description) cleaned.description = field.description;
    
    // Booleanos (solo si son true)
    if (field.required) cleaned.required = field.required;
    if (field.hidden) cleaned.hidden = field.hidden;
    if (field.searchable) cleaned.searchable = field.searchable;
    
    // colSpan solo si es diferente de 12 (ancho completo)
    if (field.colSpan && field.colSpan !== 12) {
      cleaned.colSpan = field.colSpan;
    }
    
    // Opciones (solo para select y radio)
    if (field.options && field.options.length > 0) {
      cleaned.options = field.options;
    }
    
    // DataSource (solo si existe)
    if (field.dataSource?.url) {
      cleaned.dataSource = {
        url: field.dataSource.url,
        method: field.dataSource.method || 'GET',
      };
      if (field.dataSource.labelPath) cleaned.dataSource.labelPath = field.dataSource.labelPath;
      if (field.dataSource.valuePath) cleaned.dataSource.valuePath = field.dataSource.valuePath;
    }
    
    // Validaciones (solo si existen)
    if (field.validation) {
      const val: any = {};
      if (field.validation.min !== undefined) val.min = field.validation.min;
      if (field.validation.max !== undefined) val.max = field.validation.max;
      if (field.validation.pattern) val.pattern = field.validation.pattern;
      if (Object.keys(val).length > 0) cleaned.validation = val;
    }
    
    // Propiedades de botones (solo para type: 'button')
    if (field.type === 'button') {
      if (field.buttonVariant) cleaned.buttonVariant = field.buttonVariant;
      if (field.buttonAction) cleaned.buttonAction = field.buttonAction;
      if (field.buttonRedirectUrl) cleaned.buttonRedirectUrl = field.buttonRedirectUrl;
      if (field.buttonAlign && field.buttonAlign !== 'center') {
        cleaned.buttonAlign = field.buttonAlign;
      }
    }
    
    return cleaned;
  };

  const handleSave = () => {
    const cleanedFields = fields.map(cleanFieldForSave);
    
    const schema = {
      title: formTitle,
      fields: cleanedFields,
    };
    
    console.log('Schema guardado:', JSON.stringify(schema, null, 2));
    alert('Formulario guardado exitosamente');
  };

  const currentSchema: FormSchema = {
    title: formTitle,
    description: 'Vista previa del formulario',
    fields: fields,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings/forms')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Formulario {id}</h1>
        </div>
        
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Guardar
        </Button>
      </div>

      <Tabs defaultValue="builder" className="flex-1 flex flex-col overflow-hidden min-h-0">
        <TabsList className="mx-4 mt-4 w-fit shrink-0">
          <TabsTrigger value="builder">
            <Code2 className="h-4 w-4 mr-2" />
            Constructor
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="h-4 w-4 mr-2" />
            Vista Previa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="flex-1 mt-4 mx-4 mb-4 overflow-hidden min-h-0">
          <FormBuilder initialFields={fields} onChange={setFields} />
        </TabsContent>

        <TabsContent value="preview" className="flex-1 mt-4 mx-4 mb-4 overflow-hidden min-h-0 flex flex-col">
          <div className="flex-1 w-full overflow-hidden">
            <FormPreview schema={currentSchema} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
