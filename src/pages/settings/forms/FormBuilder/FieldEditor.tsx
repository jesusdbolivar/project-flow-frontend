import {
  useEffect,
  useState,
} from 'react';

import {
  Plus,
  Trash2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

import type { FormField } from './types';

interface FieldEditorProps {
  field: FormField | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (field: FormField) => void;
}

export function FieldEditor({
  field,
  isOpen,
  onClose,
  onSave,
}: FieldEditorProps) {
  const { register, handleSubmit, watch, setValue, reset } = useForm<FormField>({
    defaultValues: field || undefined,
  });

  const [dataSourceType, setDataSourceType] = useState<'manual' | 'api'>('manual');

  // Resetear el formulario cuando cambia el field
  useEffect(() => {
    if (field) {
      reset(field);
      // Detectar si tiene dataSource configurado
      if (field.dataSource?.url) {
        setDataSourceType('api');
      } else {
        setDataSourceType('manual');
      }
    }
  }, [field, reset]);

  const fieldType = watch('type');
  const options = watch('options') || [];
  const dataSource = watch('dataSource');

  const onSubmit = (data: FormField) => {
    onSave(data);
    onClose();
  };

  const addOption = () => {
    const newOptions = [...options, { label: '', value: '' }];
    setValue('options', newOptions);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setValue('options', newOptions);
  };

  const updateOption = (index: number, field: 'label' | 'value', value: string) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setValue('options', newOptions);
  };

  if (!field) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Campo</DialogTitle>
          <DialogDescription>
            Configura las propiedades del campo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Campo oculto para preservar el ID */}
          <input type="hidden" {...register('id')} />
          <input type="hidden" {...register('type')} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="label">Etiqueta (label) *</Label>
              <Input
                id="label"
                {...register('label', { required: true })}
                placeholder="Nombre completo"
              />
              <p className="text-xs text-muted-foreground">
                Texto visible para el usuario
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nombre (name) *</Label>
              <Input
                id="name"
                {...register('name', { required: true })}
                placeholder="campo_nombre"
              />
              <p className="text-xs text-muted-foreground">
                Identificador único del campo
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="placeholder">Placeholder</Label>
            <Input
              id="placeholder"
              {...register('placeholder')}
              placeholder="Ingresa tu nombre..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Texto de ayuda adicional"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="colSpan">Ancho del campo</Label>
              <Select
                value={watch('colSpan')?.toString() || '12'}
                onValueChange={(value) => setValue('colSpan', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el ancho" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Ancho completo (12/12)</SelectItem>
                  <SelectItem value="6">Medio ancho (6/12)</SelectItem>
                  <SelectItem value="4">Un tercio (4/12)</SelectItem>
                  <SelectItem value="3">Un cuarto (3/12)</SelectItem>
                  <SelectItem value="8">Dos tercios (8/12)</SelectItem>
                  <SelectItem value="9">Tres cuartos (9/12)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Sistema de grid de 12 columnas. Los campos se acomodan automáticamente.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Opciones</Label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="required"
                    checked={watch('required')}
                    onCheckedChange={(checked) => setValue('required', checked)}
                  />
                  <Label htmlFor="required">Campo obligatorio</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="hidden"
                    checked={watch('hidden')}
                    onCheckedChange={(checked) => setValue('hidden', checked)}
                  />
                  <Label htmlFor="hidden">Campo oculto (hidden)</Label>
                </div>

                {fieldType === 'select' && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="searchable"
                      checked={watch('searchable')}
                      onCheckedChange={(checked) => setValue('searchable', checked)}
                    />
                    <Label htmlFor="searchable">Permitir búsqueda</Label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Opciones para select y radio */}
          {(fieldType === 'select' || fieldType === 'radio') && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label>Fuente de Datos</Label>
                <Select value={dataSourceType} onValueChange={(value: 'manual' | 'api') => {
                  setDataSourceType(value);
                  if (value === 'api') {
                    setValue('dataSource', {
                      url: null,
                      method: 'GET',
                      labelPath: 'label',
                      valuePath: 'value',
                    });
                  } else {
                    setValue('dataSource', null);
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la fuente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual (Opciones fijas)</SelectItem>
                    <SelectItem value="api">API (Petición HTTP)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dataSourceType === 'manual' ? (
                <>
                  <div className="flex items-center justify-between">
                    <Label>Opciones Manuales</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addOption}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Agregar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder="Etiqueta"
                          value={option.label}
                          onChange={(e) =>
                            updateOption(index, 'label', e.target.value)
                          }
                        />
                        <Input
                          placeholder="Valor"
                          value={option.value}
                          onChange={(e) =>
                            updateOption(index, 'value', e.target.value)
                          }
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeOption(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="dataSource.url">URL de la API *</Label>
                      <Input
                        id="dataSource.url"
                        {...register('dataSource.url')}
                        placeholder="https://api.ejemplo.com/datos"
                      />
                      <p className="text-xs text-muted-foreground">
                        Endpoint que retorna un array JSON
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="dataSource.method">Método HTTP</Label>
                        <Select 
                          value={dataSource?.method || 'GET'} 
                          onValueChange={(value) => setValue('dataSource.method', value as 'GET' | 'POST')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="dataSource.labelPath">Path Label</Label>
                        <Input
                          id="dataSource.labelPath"
                          {...register('dataSource.labelPath')}
                          placeholder="name"
                        />
                        <p className="text-xs text-muted-foreground">
                          Campo para mostrar
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataSource.valuePath">Path Value</Label>
                        <Input
                          id="dataSource.valuePath"
                          {...register('dataSource.valuePath')}
                          placeholder="id"
                        />
                        <p className="text-xs text-muted-foreground">
                          Campo para el valor
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Configuración de Botones */}
          {fieldType === 'button' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <Label htmlFor="buttonVariant">Estilo del Botón</Label>
                <Select
                  value={watch('buttonVariant') || 'default'}
                  onValueChange={(value) => setValue('buttonVariant', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Primario</SelectItem>
                    <SelectItem value="secondary">Secundario</SelectItem>
                    <SelectItem value="outline">Contorno</SelectItem>
                    <SelectItem value="ghost">Transparente</SelectItem>
                    <SelectItem value="destructive">Peligro/Eliminar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="buttonAction">Acción del Botón</Label>
                <Select
                  value={watch('buttonAction') || 'submit'}
                  onValueChange={(value) => setValue('buttonAction', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Acción" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submit">Enviar formulario</SelectItem>
                    <SelectItem value="reset">Limpiar formulario</SelectItem>
                    <SelectItem value="back">Volver atrás</SelectItem>
                    <SelectItem value="redirect">Ir a una página</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {watch('buttonAction') === 'redirect' && (
                <div className="space-y-2">
                  <Label htmlFor="buttonRedirectUrl">URL de destino</Label>
                  <Input
                    id="buttonRedirectUrl"
                    {...register('buttonRedirectUrl')}
                    placeholder="/dashboard o https://ejemplo.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Ruta relativa o URL completa
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Label htmlFor="buttonAlign">Alineación</Label>
                <Select
                  value={watch('buttonAlign') || 'center'}
                  onValueChange={(value) => setValue('buttonAlign', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alineación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Izquierda</SelectItem>
                    <SelectItem value="center">Centro</SelectItem>
                    <SelectItem value="right">Derecha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Validaciones */}
          {(fieldType === 'text' || fieldType === 'number' || fieldType === 'textarea') && (
            <div className="space-y-3">
              <Label>Validaciones</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="min" className="text-xs">
                    Mínimo
                  </Label>
                  <Input
                    id="min"
                    type="number"
                    {...register('validation.min', { valueAsNumber: true })}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max" className="text-xs">
                    Máximo
                  </Label>
                  <Input
                    id="max"
                    type="number"
                    {...register('validation.max', { valueAsNumber: true })}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
