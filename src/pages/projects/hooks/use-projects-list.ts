import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { FormField } from '@/pages/settings/forms/FormBuilder/types';
import { listFormFields } from '@/services/form-builder.api';
import {
  type FormSummary,
  listForms,
} from '@/services/forms.api';
import {
  type Project,
  type ProjectAttributes,
  useProjectsStore,
} from '@/state/projects.store';

export type ProjectsSort = 'recent' | 'alphabetical';

const PROJECT_FORM_TITLE = 'proyectos';

const SAMPLE_PROJECTS: Array<{ name: string; code: string; description: string; attributes: ProjectAttributes }> = [
  {
    name: 'Project Flow Core',
    code: 'PF-CORE',
    description: 'Implementación del núcleo de Project Flow y los flujos principales.',
    attributes: {
      projectName: 'Project Flow Core',
      projectCode: 'PF-CORE',
      projectOwner: 'Laura Méndez',
      projectStatus: 'active',
      projectBudget: 350000,
    },
  },
  {
    name: 'Onboarding Empresarial',
    code: 'ONB-23',
    description: 'Programa de onboarding para nuevos clientes enterprise.',
    attributes: {
      projectName: 'Onboarding Empresarial',
      projectCode: 'ONB-23',
      projectOwner: 'Equipo CX',
      projectStatus: 'planning',
      projectBudget: 180000,
    },
  },
  {
    name: 'Automatización de Contratos',
    code: 'CNT-AUTO',
    description: 'Motor para gestionar contratos, aprobaciones y firmas digitales.',
    attributes: {
      projectName: 'Automatización de Contratos',
      projectCode: 'CNT-AUTO',
      projectOwner: 'Oficina Legal',
      projectStatus: 'active',
      projectBudget: 420000,
    },
  },
];

const normalize = (value: string | undefined | null) =>
  (value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const generateFallbackCode = (name: string) => {
  const base = name
    .split(' ')
    .slice(0, 2)
    .map((chunk) => chunk.replace(/[^a-zA-Z0-9]/g, '').slice(0, 3).toUpperCase())
    .join('');

  return base || `PRJ-${new Date().getTime().toString().slice(-4)}`;
};

export function useProjectsList() {
  const projectsMap = useProjectsStore((state) => state.projects);
  const createProject = useProjectsStore((state) => state.createProject);
  const deleteProject = useProjectsStore((state) => state.deleteProject);

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<ProjectsSort>('recent');
  const [projectFields, setProjectFields] = useState<FormField[]>([]);
  const [projectForm, setProjectForm] = useState<FormSummary | null>(null);
  const [fieldsLoading, setFieldsLoading] = useState(true);
  const [fieldsError, setFieldsError] = useState<string | null>(null);
  const hasSeeded = useRef(false);

  const projects = useMemo<Project[]>(() => Object.values(projectsMap), [projectsMap]);

  const loadProjectFields = useCallback(async () => {
    setFieldsLoading(true);
    try {
      const forms = await listForms();
      const form = forms.find((item) => item.title?.trim().toLowerCase() === PROJECT_FORM_TITLE);
      if (!form) {
        setProjectForm(null);
        setProjectFields([]);
        setFieldsError('No encontramos un formulario llamado "Proyectos".');
        return;
      }
      const fields = await listFormFields(form.id);
      setProjectForm(form);
      setProjectFields(fields.filter((field) => !field.hidden));
      setFieldsError(null);
    } catch (error) {
      console.error('Error loading project fields', error);
      setProjectForm(null);
      setProjectFields([]);
      setFieldsError('No se pudieron cargar los campos del formulario de proyectos.');
    } finally {
      setFieldsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjectFields();
  }, [loadProjectFields]);

  // Semilla ligera para que el listado no esté vacío la primera vez.
  useEffect(() => {
    if (projects.length === 0 && !hasSeeded.current) {
      SAMPLE_PROJECTS.forEach((project) => {
        createProject(project.name, {
          code: project.code,
          description: project.description,
          attributes: project.attributes,
        });
      });
      hasSeeded.current = true;
    }
  }, [createProject, projects.length]);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = normalize(query);

    const byQuery = !normalizedQuery
      ? projects
      : projects.filter((project) => {
          const name = normalize(project.name);
          const code = normalize(project.code);
          const description = normalize(project.description);
          const attributes = Object.values(project.attributes ?? {})
            .map((value) => {
              if (value === null || value === undefined) return '';
              if (typeof value === 'boolean') return value ? 'true' : 'false';
              return String(value);
            })
            .map(normalize);

          return (
            name.includes(normalizedQuery) ||
            code.includes(normalizedQuery) ||
            description.includes(normalizedQuery) ||
            attributes.some((value) => value.includes(normalizedQuery))
          );
        });

    const sorter = sortBy === 'alphabetical'
      ? (a: Project, b: Project) => a.name.localeCompare(b.name)
      : (a: Project, b: Project) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();

    return [...byQuery].sort(sorter);
  }, [projects, query, sortBy]);

  const handleCreateQuickProject = useCallback(
    (name?: string) => {
      const safeName = name?.trim() || `Proyecto sin nombre ${new Date().toLocaleString()}`;
      return createProject(safeName, {
        code: generateFallbackCode(safeName),
        description: 'Describe aquí el alcance, equipo y entregables.',
        attributes: {
          projectName: safeName,
          projectCode: generateFallbackCode(safeName),
          projectOwner: 'Asignar responsable',
          projectStatus: 'planning',
          projectBudget: 0,
        },
      });
    },
    [createProject],
  );

  const handleDeleteProject = useCallback(
    (id: string) => {
      deleteProject(id);
    },
    [deleteProject],
  );

  return {
    total: projects.length,
    projects: filteredProjects,
    query,
    setQuery,
    sortBy,
    setSortBy,
    projectFields,
    projectForm,
    fieldsLoading,
    fieldsError,
    reloadFields: loadProjectFields,
    createQuickProject: handleCreateQuickProject,
    deleteProject: handleDeleteProject,
  };
}
