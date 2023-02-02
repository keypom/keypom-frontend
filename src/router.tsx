import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { CoreLayout } from '@/components/CoreLayout';

const HomePage = React.lazy(async () => await import('./pages/Home'));
const AboutPage = React.lazy(async () => await import('./pages/About'));
const LandingPage = React.lazy(async () => await import('./features/landing'));

export const router = createBrowserRouter([
  {
    element: <CoreLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/landing',
        element: <LandingPage />,
      },
    ],
  },
]);
