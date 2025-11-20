import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface FormsHeaderProps {
  onCreate: () => void;
}

export function FormsHeader({ onCreate }: FormsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Formularios</h1>
        <p className="text-muted-foreground">
          Gestiona y configura los formularios de tu aplicación
        </p>
      </div>
      <Button onClick={onCreate}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Formulario
      </Button>
    </div>
  );
}
