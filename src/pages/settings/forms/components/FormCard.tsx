import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { FormSummary } from '@/services/forms.api';

interface FormCardProps {
  form: FormSummary;
  onEdit: (id: string) => void;
}

export function FormCard({ form, onEdit }: FormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{form.title}</CardTitle>
        {form.description && (
          <CardDescription>{form.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            ID: {form.id}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(form.id)}
          >
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
