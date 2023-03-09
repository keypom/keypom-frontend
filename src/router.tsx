import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

const LandingPage = React.lazy(async () => await import('@/features/landing/routes/LandingPage'));

const NotFound404 = React.lazy(
  async () =>
    await import('./components/NotFound404').then((mod) => ({ default: mod.NotFound404 })),
);

const CoreLayout = React.lazy(
  async () => await import('@/components/CoreLayout').then((mod) => ({ default: mod.CoreLayout })),
);

const ProtectedRoute = React.lazy(
  async () =>
    await import('./components/ProtectedRoutes').then((mod) => ({ default: mod.ProtectedRoute })),
);

const AllDropsPage = React.lazy(
  async () => await import('./features/all-drops/routes/AllDropsPage'),
);
const ClaimPage = React.lazy(async () => await import('@/features/claim/routes/ClaimPage'));
const ClaimTokenPage = React.lazy(
  async () => await import('@/features/claim/routes/TokenClaimPage'),
);
const ClaimNftPage = React.lazy(async () => await import('@/features/claim/routes/NFTClaimPage'));
const ClaimGiftPage = React.lazy(async () => await import('@/features/claim/routes/GiftClaimPage'));
const ClaimTicketPage = React.lazy(
  async () => await import('@/features/claim/routes/ticket/TicketClaimPage'),
);
const ClaimTrialPage = React.lazy(
  async () => await import('@/features/claim/routes/TrialClaimPage'),
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
const EthDenverLandingPage = React.lazy(async () => await import('@/pages/EthDenver'));

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
        path: 'ethdenver',
        element: <EthDenverLandingPage />,
      },
      {
        loader: () => {
          import('@/lib/keypom').then(async (keypomLib) => {
            await keypomLib.default.init();
          });
          return null;
        },
        children: [
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
          //  claim structure should be claim/:contractId#secretKey
          {
            path: 'claim',
            children: [
              {
                path: 'token/:contractId',
                element: <ClaimTokenPage />,
              },
              {
                path: 'nft/:contractId',
                element: <ClaimNftPage />,
              },
              {
                path: 'gift/:contractId',
                element: <ClaimGiftPage />,
              },
              {
                path: 'ticket/:contractId',
                element: <ClaimTicketPage />,
              },
              {
                path: 'trial/:contractId',
                element: <ClaimTrialPage />,
              },
              {
                path: ':contractId',
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
      {
        path: '*',
        element: <NotFound404 />,
      },
    ],
  },
]);
