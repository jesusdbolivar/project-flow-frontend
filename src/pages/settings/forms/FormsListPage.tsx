import {
  useEffect,
  useState,
} from 'react';

import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  createForm,
  type FormSummary,
  listForms,
} from '@/services/forms.api';

export function FormsListPage() {
  const navigate = useNavigate();
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [loading, SetLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listForms()
      .then(setForms)
      .catch(()=> setError('No se pudieron cargar los formularios'))
      .finally(() => SetLoading(false));
  }, []);

  const handleCreate = async() => {
    const nuevo = await createForm({title: 'Nuevo formulario'});
    setForms(prev => [nuevo, ...prev])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Formularios</h1>
          <p className="text-muted-foreground">
            Gestiona y configura los formularios de tu aplicación
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Formulario
        </Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Cargando...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map(form => (
            <Card key={form.id}>
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
                    onClick={() => navigate(`/settings/forms/${form.id}/edit`)}
                  >
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Formularios</CardTitle>
          <CardDescription>
            Resumen de respuestas recibidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Total de formularios
              </p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Respuestas este mes
              </p>
              <p className="text-2xl font-bold">234</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Tasa de respuesta
              </p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
