import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { CoreLayout } from '@/components/CoreLayout';

const HomePage = React.lazy(async () => await import('./pages/Home'));
const AboutPage = React.lazy(async () => await import('./pages/About'));
const AllDropsPage = React.lazy(
  async () => await import('./features/all-drops/routes/AllDropsPage'),
);
const LandingPage = React.lazy(async () => await import('@/features/landing/routes/LandingPage'));
const ClaimTokenPage = React.lazy(async () => await import('@/features/claim/routes/token'));
const ClaimNftPage = React.lazy(async () => await import('@/features/claim/routes/nft'));
const ClaimGiftPage = React.lazy(async () => await import('@/features/claim/routes/gift'));
const ClaimTicketPage = React.lazy(async () => await import('@/features/claim/routes/ticket/[id]'));
const CreateTokenDropPage = React.lazy(
  async () => await import('@/features/create-drop/routes/CreateTokenDropPage'),
);
const CreateNftDropPage = React.lazy(
  async () => await import('@/features/create-drop/routes/CreateNftDropPage'),
);
const CreateTicketDropPage = React.lazy(
  async () => await import('@/features/create-drop/routes/CreateTicketDropPage'),
);

const TokenDropManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/token/[id]'),
);
const NFTDropManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/nft/[id]'),
);
const TicketDropManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/ticket/[id]'),
);

export const router = createBrowserRouter([
  {
    element: <CoreLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'landing',
        element: <LandingPage />,
      },
      {
        path: 'drops',
        element: <AllDropsPage />,
      },
      {
        path: 'drop',
        children: [
          {
            path: 'token',
            children: [
              {
                path: 'new',
                element: <CreateTokenDropPage />,
              },
              {
                path: ':id',
                element: <TokenDropManagerPage />,
              },
            ],
          },
          {
            path: 'nft',
            children: [
              {
                path: 'new',
                element: <CreateNftDropPage />,
              },
              {
                path: ':id',
                element: <NFTDropManagerPage />,
              },
            ],
          },
          {
            path: 'ticket',
            children: [
              {
                path: 'new',
                element: <CreateTicketDropPage />,
              },
              {
                path: ':id',
                element: <TicketDropManagerPage />,
              },
            ],
      },
      {
        path: 'claim',
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
