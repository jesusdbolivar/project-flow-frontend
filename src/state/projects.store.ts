import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProjectValue = string | number | boolean | null;

export interface ProjectAttributes {
  [key: string]: ProjectValue;
}

export interface Project {
  id: string;
  name: string;
  code?: string;
  description?: string;
  updatedAt: string;
  attributes?: ProjectAttributes;
}

interface ProjectsState {
  projects: Record<string, Project>;
  createProject: (name: string, data?: Partial<Omit<Project, 'id' | 'name' | 'updatedAt'>>) => string;
  updateProject: (id: string, data: Partial<Omit<Project, 'id'>>) => void;
  deleteProject: (id: string) => void;
  listProjects: () => Project[];
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: {},
      createProject: (name, data) => {
        const id = crypto.randomUUID();
        const now = new Date().toISOString();
        const project: Project = { id, name, updatedAt: now, ...data };
        set(state => ({ projects: { ...state.projects, [id]: project } }));
        return id;
      },
      updateProject: (id, data) => {
        set(state => {
          const project = state.projects[id];
          if (!project) return state;
          return {
            projects: {
              ...state.projects,
              [id]: { ...project, ...data, updatedAt: new Date().toISOString() },
            },
          };
        });
      },
      deleteProject: (id) => {
        set(state => {
          const { [id]: _, ...rest } = state.projects;
          return { projects: rest };
        });
      },
      listProjects: () => Object.values(get().projects),
    }),
    { name: 'projects-store' }
  )
);
