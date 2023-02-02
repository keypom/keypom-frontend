import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { CoreLayout } from '@/components/CoreLayout';

const HomePage = React.lazy(async () => await import('./pages/Home'));
const AboutPage = React.lazy(async () => await import('./pages/About'));
const LandingPage = React.lazy(async () => await import('./features/landing/routes/LandingPage'));
const ClaimTokenPage = React.lazy(async () => await import('./features/claim/routes/token'));
const ClaimNftPage = React.lazy(async () => await import('./features/claim/routes/nft'));
const ClaimGiftPage = React.lazy(async () => await import('./features/claim/routes/gift'));
const ClaimTicketPage = React.lazy(async () => await import('./features/claim/routes/ticket/[id]'));

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

      {
        path: '/claim',
        children: [
          {
            path: 'token',
            element: <ClaimTokenPage />,
          },
          {
            path: 'nft',
            element: <ClaimNftPage />,
          },
          {
            path: 'gift',
            element: <ClaimGiftPage />,
          },
          {
            path: 'ticket',
            children: [
              {
                path: ':id',
                element: <ClaimTicketPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
