import { useCallback } from 'react';

import { useNavigate } from 'react-router-dom';

import { FormCard } from './components/FormCard';
import { FormsHeader } from './components/FormsHeader';
import { FormsStats } from './components/FormsStats';
import { useFormsList } from './hooks/use-forms-list';

export function FormsListPage() {
  const navigate = useNavigate();
  const { forms, loading, error, createForm } = useFormsList();

  const handleEdit = useCallback((id: string) => {
    navigate(`/settings/forms/${id}/edit`);
  }, [navigate]);

  return (
    <div className="space-y-6">
      <FormsHeader onCreate={createForm} />

      {loading && <p className="text-sm text-muted-foreground">Cargando...</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {forms.map(form => (
            <FormCard key={form.id} form={form} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <FormsStats />
    </div>
  );
}
