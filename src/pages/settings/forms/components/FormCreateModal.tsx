import { useEffect } from 'react';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FormSummary } from '@/services/forms.api';

import { useCreateForm } from '../hooks/use-create-form';

interface FormCreateModalProps {
  onCreated?: (form: FormSummary) => void;
}

// Componente puramente de render que consume la lógica del hook
export function FormCreateModal({ onCreated }: FormCreateModalProps) {
  const {
    open,
    setOpen,
    title,
    setTitle,
    description,
    setDescription,
    loading,
    error,
    canSubmit,
    handleSubmit,
  } = useCreateForm({ onCreated });

  // Al abrir el modal enfocar el input principal (accesibilidad)
  useEffect(() => {
    if (open) {
      const el = document.getElementById('create-form-title');
      el?.focus();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Formulario
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear formulario</DialogTitle>
          <DialogDescription>
            Define el título y una descripción opcional para tu nuevo formulario.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="create-form-title" className="text-sm font-medium">Título</label>
            <Input
              id="create-form-title"
              value={title}
              placeholder="Ej: Registro de cliente"
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={title.trim().length > 0 && title.trim().length < 3}
            />
            {title.trim().length > 0 && title.trim().length < 3 && (
              <p className="text-xs text-destructive">Mínimo 3 caracteres</p>
            )}
          </div>
          <div className="space-y-1">
            <label htmlFor="create-form-description" className="text-sm font-medium">Descripción</label>
            <Textarea
              id="create-form-description"
              value={description}
              placeholder="Describe el propósito del formulario (opcional)."
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? 'Creando…' : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
