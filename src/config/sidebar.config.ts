import type { LucideIcon } from 'lucide-react';
import {
  FolderKanban,
  Home,
  Settings2,
} from 'lucide-react';

export interface SidebarItem {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive?: boolean;
  badge?: string;
  items?: SidebarSubItem[];
}

export interface SidebarSubItem {
  title: string;
  url: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Proyectos",
    url: "/projects",
    icon: FolderKanban,
  },
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings2,
    items: [
      {
        title: "Formularios",
        url: "/settings/forms",
      }
    ],
  },
];
