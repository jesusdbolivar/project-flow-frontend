import type { ReactNode } from 'react';

interface FormsHeaderProps {
  action?: ReactNode;
}

export function FormsHeader({ action }: FormsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Formularios</h1>
        <p className="text-muted-foreground">
          Gestiona y configura los formularios de tu aplicación
        </p>
      </div>
      {action}
    </div>
  );
}
