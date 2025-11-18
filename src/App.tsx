import './App.css';

import { AppLayout } from '@/components/layout/app-layout';

const App = () => {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido a Project Flow - Sistema de gestión de proyectos
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-lg font-semibold">Total Proyectos</h3>
            <p className="text-3xl font-bold mt-2">12</p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-lg font-semibold">En Progreso</h3>
            <p className="text-3xl font-bold mt-2">8</p>
          </div>
          
          <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
            <h3 className="text-lg font-semibold">Completados</h3>
            <p className="text-3xl font-bold mt-2">4</p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default App
