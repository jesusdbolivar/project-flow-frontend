import { ArrowLeft } from 'lucide-react';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function FormEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/settings/forms')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editar Formulario {id}
          </h1>
          <p className="text-muted-foreground">
            Configura y personaliza tu formulario
          </p>
        </div>
      </div>

      {/* Aquí va tu contenido de edición */}
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">
          Contenido del editor de formulario
        </p>
      </div>
    </div>
  );
}
