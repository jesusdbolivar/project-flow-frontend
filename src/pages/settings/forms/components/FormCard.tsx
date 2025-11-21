import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { FormSummary } from '@/services/forms.api';
import { FormEditModal } from './FormEditModal';

interface FormCardProps {
  form: FormSummary;
  onEdit: (id: string) => void; // navegación al editor avanzado
  onUpdated?: (form: FormSummary) => void; // callback para actualizar lista tras edición rápida
}

export function FormCard({ form, onEdit, onUpdated }: FormCardProps) {
  return (
    <Card className="relative">
      <FormEditModal form={form} onUpdated={onUpdated} />
      <CardHeader className="pr-10">{/* espacio para icono */}
        <CardTitle className="line-clamp-1">{form.title}</CardTitle>
        {form.description && (
          <CardDescription className="line-clamp-2">{form.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="truncate max-w-[60%]">ID: {form.id}</span>
          <button
            type="button"
            className="underline-offset-4 hover:underline text-primary"
            onClick={() => onEdit(form.id)}
          >
            Abrir editor
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
