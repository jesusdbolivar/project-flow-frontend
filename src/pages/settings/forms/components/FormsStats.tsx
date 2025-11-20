import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function FormsStats() {
  return (
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
  );
}
