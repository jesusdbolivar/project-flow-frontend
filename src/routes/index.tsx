import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/components/layout/app-layout';
import { Dashboard } from '@/pages/Dashboard';
import { FormsListPage, FormEditPage } from '@/pages/settings';

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
