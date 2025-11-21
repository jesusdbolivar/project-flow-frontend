import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/components/layout/app-layout';
import { Dashboard } from '@/pages/Dashboard';
import { ProjectsPage } from '@/pages/projects';
import {
  FormEditPage,
  FormsListPage,
} from '@/pages/settings';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "settings",
        children: [
          {
            path: "forms",
            element: <FormsListPage />,
          },
          {
            path: "forms/:id/edit",
            element: <FormEditPage />,
          },
        ],
      },
    ],
  },
]);
