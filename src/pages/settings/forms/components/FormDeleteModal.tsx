import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { FormSummary } from '@/services/forms.api';

import { useDeleteForm } from '../hooks/use-delete-form';

interface FormDeleteModalProps {
  form: FormSummary;
  onDeleted?: (id: string) => void;
}

// Componente de presentación: botón icono + modal confirmación
export function FormDeleteModal({ form, onDeleted }: FormDeleteModalProps) {
  const { open, setOpen, loading, error, confirmDelete } = useDeleteForm({ form, onDeleted });

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Eliminar formulario"
        className="h-8 w-8 p-0 absolute top-2 right-10 opacity-70 hover:opacity-100 text-destructive"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar formulario</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar "{form.title}"? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>Cancelar</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={loading}>
              {loading ? 'Eliminando…' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
