import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { CoreLayout } from '@/components/CoreLayout';

import { ProtectedRoute } from './components/ProtectedRoutes';

const AllDropsPage = React.lazy(
  async () => await import('./features/all-drops/routes/AllDropsPage'),
);
const LandingPage = React.lazy(async () => await import('@/features/landing/routes/LandingPage'));
const ClaimPage = React.lazy(async () => await import('@/features/claim/routes/ClaimPage'));
const ClaimTokenPage = React.lazy(
  async () => await import('@/features/claim/routes/TokenClaimPage'),
);
const ClaimNftPage = React.lazy(async () => await import('@/features/claim/routes/NFTClaimPage'));
const ClaimGiftPage = React.lazy(async () => await import('@/features/claim/routes/GiftClaimPage'));
const ClaimTicketPage = React.lazy(
  async () => await import('@/features/claim/routes/ticket/TicketClaimPage'),
);
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

const ScannerPage = React.lazy(async () => await import('@/features/scanner/routes/ScannerPage'));

export const router = createBrowserRouter([
  {
    element: <CoreLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: 'drops',
        element: (
          <ProtectedRoute>
            <AllDropsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'drop',
        element: <ProtectedRoute />,
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
        ],
      },
      {
        path: 'claim',
        element: <ProtectedRoute />,
        children: [
          {
            path: 'token/:secretKey',
            element: <ClaimTokenPage />,
          },
          {
            path: 'nft/:contractId/:secretKey',
            element: <ClaimNftPage />,
          },
          {
            path: 'gift',
            element: <ClaimGiftPage />,
          },
          {
            path: 'ticket/:contractId/:secretKey',
            element: <ClaimTicketPage />,
          },
          {
            path: ':contractId/:secretKey',
            element: <ClaimPage />,
          },
        ],
      },
      {
        path: 'scanner',
        element: <ScannerPage />,
      },
    ],
  },
]);
