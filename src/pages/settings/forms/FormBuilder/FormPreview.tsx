import {
  useEffect,
  useState,
} from 'react';

import {
  Check,
  ChevronsUpDown,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import type {
  FormField,
  FormSchema,
} from './types';

// Función helper para obtener valor nested del objeto usando path
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

interface FormPreviewProps {
  schema: FormSchema;
}

export function FormPreview({ schema }: FormPreviewProps) {
  const { register, handleSubmit, setValue } = useForm();
  const [dynamicOptions, setDynamicOptions] = useState<Record<string, Array<{label: string, value: string}>>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});
  const [openCombobox, setOpenCombobox] = useState<Record<string, boolean>>({});
  const [viewportSize, setViewportSize] = useState<'full' | 'desktop' | 'tablet' | 'mobile'>('desktop');

  // Cargar opciones desde API para campos con dataSource
  useEffect(() => {
    const loadDynamicOptions = async () => {
      for (const field of schema.fields) {
        if ((field.type === 'select' || field.type === 'radio') && field.dataSource?.url) {
          try {
            setLoading(prev => ({ ...prev, [field.id]: true }));
            
            const response = await fetch(field.dataSource.url, {
              method: field.dataSource.method || 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const dataArray = Array.isArray(data) ? data : [data];

            // Extraer opciones usando los paths configurados
            const options = dataArray.map((item) => ({
              label: getNestedValue(item, field.dataSource?.labelPath || 'label'),
              value: String(getNestedValue(item, field.dataSource?.valuePath || 'value')),
            }));

            setDynamicOptions(prev => ({ ...prev, [field.id]: options }));
          } catch (error) {
            console.error(`Error cargando opciones para ${field.id}:`, error);
            setDynamicOptions(prev => ({ ...prev, [field.id]: [] }));
          } finally {
            setLoading(prev => ({ ...prev, [field.id]: false }));
          }
        }
      }
    };

    loadDynamicOptions();
  }, [schema.fields]);

  const onSubmit = (data: any) => {
    console.log('Form data:', data);
  };

  // Mapeo de tamaños a anchos máximos
  const viewportWidths = {
    full: 'max-w-full',
    desktop: 'max-w-4xl',
    tablet: 'max-w-2xl',
    mobile: 'max-w-sm',
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      id: field.id,
      required: field.required,
    };

    // Mapeo de colSpan a clases de Tailwind (necesario para que Tailwind las incluya en el build)
    const colSpanClasses: Record<number, string> = {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12',
    };
    
    const colSpanClass = colSpanClasses[field.colSpan || 12] || 'col-span-12';

    const fieldContent = (() => {
      switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              {...register(field.id, { required: field.required })}
              type={field.type}
              placeholder={field.placeholder || ''}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              {...register(field.id, { required: field.required })}
              placeholder={field.placeholder || ''}
              rows={4}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'select':
        const selectOptions = field.dataSource?.url 
          ? (dynamicOptions[field.id] || [])
          : (field.options || []);
        const isLoadingSelect = loading[field.id];
        const selectedValue = selectedValues[field.id] || '';

        // Si el campo es searchable, usar Combobox
        if (field.searchable) {
          return (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <Popover 
                open={openCombobox[field.id]} 
                onOpenChange={(open) => setOpenCombobox(prev => ({...prev, [field.id]: open}))}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox[field.id]}
                    className="w-full justify-between"
                    disabled={isLoadingSelect}
                  >
                    {isLoadingSelect ? (
                      'Cargando...'
                    ) : selectedValue ? (
                      selectOptions.find((opt) => opt.value === selectedValue)?.label || 'Seleccionar...'
                    ) : (
                      field.placeholder || 'Seleccionar...'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandList>
                      <CommandEmpty>
                        {isLoadingSelect ? 'Cargando...' : 'Sin resultados'}
                      </CommandEmpty>
                      <CommandGroup>
                        {selectOptions.map((option) => (
                          <CommandItem
                            key={option.value || `opt-${option.label}`}
                            value={option.label}
                            onSelect={() => {
                              const newValue = option.value === selectedValue ? '' : option.value;
                              setSelectedValues(prev => ({...prev, [field.id]: newValue}));
                              setValue(field.id, newValue);
                              setOpenCombobox(prev => ({...prev, [field.id]: false}));
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedValue === option.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {field.dataSource?.url && !isLoadingSelect && (
                <p className="text-xs text-muted-foreground">
                  🌐 {selectOptions.length} opciones desde API
                </p>
              )}
              {field.description && (
                <p className="text-sm text-muted-foreground">{field.description}</p>
              )}
            </div>
          );
        }

        // Select normal sin búsqueda
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Select {...register(field.id, { required: field.required })}>
              <SelectTrigger>
                <SelectValue placeholder={
                  isLoadingSelect 
                    ? 'Cargando...' 
                    : field.placeholder || 'Selecciona una opción'
                } />
              </SelectTrigger>
              <SelectContent>
                {isLoadingSelect ? (
                  <SelectItem value="loading" disabled>
                    Cargando desde API...
                  </SelectItem>
                ) : selectOptions.length > 0 ? (
                  selectOptions.map((option) => (
                    <SelectItem key={option.value || `opt-${option.label}`} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty" disabled>
                    {field.dataSource?.url ? 'Error al cargar opciones' : 'Sin opciones configuradas'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {field.dataSource?.url && !isLoadingSelect && (
              <p className="text-xs text-muted-foreground">
                🌐 {selectOptions.length} opciones desde API
              </p>
            )}
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="flex items-center space-x-2">
            <Checkbox
              {...commonProps}
              {...register(field.id, { required: field.required })}
            />
            <Label htmlFor={field.id} className="text-sm font-normal">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
          </div>
        );

      case 'switch':
        return (
          <div key={field.id} className="flex items-center justify-between">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Switch {...commonProps} {...register(field.id)} />
          </div>
        );

      case 'date':
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            <Input
              {...commonProps}
              {...register(field.id, { required: field.required })}
              type="date"
              placeholder={field.placeholder || ''}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'radio':
        const radioOptions = field.dataSource?.url 
          ? (dynamicOptions[field.id] || [])
          : (field.options || []);
        const isLoadingRadio = loading[field.id];

        return (
          <div key={field.id} className="space-y-3">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {isLoadingRadio ? (
              <p className="text-sm text-muted-foreground">
                🌐 Cargando opciones desde API...
              </p>
            ) : radioOptions.length > 0 ? (
              <>
                <RadioGroup {...register(field.id, { required: field.required })}>
                  {radioOptions.map((option, index) => (
                    <div key={option.value || `radio-${field.id}-${index}`} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${field.id}-${option.value || index}`} />
                      <Label htmlFor={`${field.id}-${option.value || index}`} className="font-normal">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {field.dataSource?.url && (
                  <p className="text-xs text-muted-foreground">
                    🌐 {radioOptions.length} opciones desde API
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {field.dataSource?.url ? 'Error al cargar opciones' : 'Sin opciones configuradas'}
              </p>
            )}
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
          </div>
        );

      case 'button':
        const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
          const action = field.buttonAction;
          
          if (action === 'back') {
            e.preventDefault();
            window.history.back();
          } else if (action === 'redirect' && field.buttonRedirectUrl) {
            e.preventDefault();
            if (field.buttonRedirectUrl.startsWith('http')) {
              window.location.href = field.buttonRedirectUrl;
            } else {
              window.location.pathname = field.buttonRedirectUrl;
            }
          }
          // Para 'submit' y 'reset' el comportamiento es nativo del HTML
        };

        // Determinar el tipo HTML del botón basado en la acción
        const buttonType = field.buttonAction === 'submit' 
          ? 'submit' 
          : field.buttonAction === 'reset' 
          ? 'reset' 
          : 'button';

        // Clases de alineación
        const alignClasses = {
          left: 'justify-start',
          center: 'justify-center',
          right: 'justify-end',
        };
        const alignClass = alignClasses[field.buttonAlign || 'center'];

        return (
          <div className={`flex ${alignClass}`}>
            <Button
              type={buttonType}
              variant={field.buttonVariant || 'default'}
              onClick={handleButtonClick}
            >
              {field.label || 'Botón'}
            </Button>
          </div>
        );

      default:
        return null;
    }
    })();

    // Envolver el field con la clase de grid
    return (
      <div key={field.id} className={colSpanClass}>
        {fieldContent}
      </div>
    );
  };

  return (
    <div className="w-full max-h-[calc(100vh-16rem)] flex flex-col border rounded-lg bg-card">
      <div className="shrink-0 border-b">
        <div className="p-6 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-semibold">{schema.title || 'Vista Previa del Formulario'}</h3>
            {schema.description && (
              <p className="text-sm text-muted-foreground mt-2">{schema.description}</p>
            )}
          </div>
          
          {/* Controles de tamaño de viewport */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-muted-foreground">Vista:</span>
            <div className="inline-flex rounded-md border">
              <button
                type="button"
                onClick={() => setViewportSize('full')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  viewportSize === 'full'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent hover:bg-muted'
                }`}
                title="Ancho completo"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportSize('desktop')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors border-l ${
                  viewportSize === 'desktop'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent hover:bg-muted'
                }`}
                title="Escritorio (1024px)"
              >
                <Monitor className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportSize('tablet')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors border-l ${
                  viewportSize === 'tablet'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent hover:bg-muted'
                }`}
                title="Tablet (768px)"
              >
                <Tablet className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewportSize('mobile')}
                className={`px-3 py-1.5 text-xs font-medium transition-colors border-l ${
                  viewportSize === 'mobile'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-transparent hover:bg-muted'
                }`}
                title="Móvil (375px)"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className={`mx-auto transition-all duration-300 ${viewportWidths[viewportSize]}`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-4">
              {schema.fields.map(renderField)}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
