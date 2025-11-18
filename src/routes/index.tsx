import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/components/layout/app-layout';
import { Dashboard } from '@/pages/Dashboard';
import { FormsPage } from '@/pages/settings/Forms';

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
            element: <FormsPage />,
          },
        ],
      },
    ],
  },
]);
