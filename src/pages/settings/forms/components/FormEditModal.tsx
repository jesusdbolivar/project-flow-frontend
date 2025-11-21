import { Pencil } from 'lucide-react';

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
import { Textarea } from '@/components/ui/textarea';
import type { FormSummary } from '@/services/forms.api';

import { useEditForm } from '../hooks/use-edit-form';

interface FormEditModalProps {
  form: FormSummary;
  onUpdated?: (form: FormSummary) => void;
  className?: string; // permitir pasar estilos extra
}

// Componente de presentación: icono lápiz en esquina y modal de edición
export function FormEditModal({ form, onUpdated, className }: FormEditModalProps) {
  const {
    open,
    setOpen,
    title,
    setTitle,
    description,
    setDescription,
    loading,
    error,
    dirty,
    canSubmit,
    handleSubmit,
    resetLocal,
  } = useEditForm({ form, onUpdated });

  return (
    <div className={className}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Editar formulario"
        className="h-8 w-8 p-0 absolute top-2 right-2 opacity-70 hover:opacity-100"
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={(o) => { if (!o) resetLocal(); setOpen(o); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar formulario</DialogTitle>
            <DialogDescription>
              Modifica los metadatos del formulario. Solo título y descripción.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor={`edit-form-title-${form.id}`} className="text-sm font-medium">Título</label>
              <Input
                id={`edit-form-title-${form.id}`}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                aria-invalid={title.trim().length > 0 && title.trim().length < 3}
              />
              {title.trim().length > 0 && title.trim().length < 3 && (
                <p className="text-xs text-destructive">Mínimo 3 caracteres</p>
              )}
            </div>
            <div className="space-y-1">
              <label htmlFor={`edit-form-description-${form.id}`} className="text-sm font-medium">Descripción</label>
              <Textarea
                id={`edit-form-description-${form.id}`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {!error && dirty && (
              <p className="text-xs text-muted-foreground">Hay cambios sin guardar.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setOpen(false); resetLocal(); }} disabled={loading}>Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit}>
              {loading ? 'Guardando…' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
