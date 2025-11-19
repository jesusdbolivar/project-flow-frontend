// Types para el Form Builder
export type FieldType = 
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'switch'
  | 'button';

export interface FormField {
  id: string;
  name: string | null;
  label: string | null;
  type: FieldType;
  required: boolean;
  hidden: boolean;
  placeholder: string | null;
  
  // Layout: sistema de grid de 12 columnas (estándar)
  colSpan?: number; // 1-12, default 12 (ancho completo)
  
  // Para select y radio (null si no aplica)
  options?: Array<{
    label: string;
    value: string;
  }> | null;
  
  // Para cargar opciones desde API
  dataSource?: {
    url: string | null;
    method?: 'GET' | 'POST';
    labelPath?: string;  // Path para extraer el label del JSON (ej: "name", "data.title")
    valuePath?: string;  // Path para extraer el value del JSON (ej: "id", "data.code")
  } | null;
  
  // Para select: permitir búsqueda
  searchable?: boolean;
  
  // Para botones
  buttonVariant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  buttonAction?: 'submit' | 'reset' | 'back' | 'redirect';
  buttonRedirectUrl?: string | null;
  buttonAlign?: 'left' | 'center' | 'right'; // Alineación del botón
  
  // Opcional: descripción adicional
  description?: string;
  
  // Validaciones opcionales
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface DraggableComponentType {
  id: string;
  type: FieldType;
  label: string;
  icon: string;
}

export const COMPONENT_TYPES: DraggableComponentType[] = [
  { id: 'text', type: 'text', label: 'Texto', icon: 'Type' },
  { id: 'email', type: 'email', label: 'Email', icon: 'Mail' },
  { id: 'number', type: 'number', label: 'Número', icon: 'Hash' },
  { id: 'textarea', type: 'textarea', label: 'Área de Texto', icon: 'AlignLeft' },
  { id: 'select', type: 'select', label: 'Selector', icon: 'ChevronDown' },
  { id: 'checkbox', type: 'checkbox', label: 'Casilla', icon: 'CheckSquare' },
  { id: 'radio', type: 'radio', label: 'Radio', icon: 'Circle' },
  { id: 'date', type: 'date', label: 'Fecha', icon: 'Calendar' },
  { id: 'switch', type: 'switch', label: 'Interruptor', icon: 'Toggle' },
  { id: 'button', type: 'button', label: 'Botón', icon: 'MousePointerClick' },
];
