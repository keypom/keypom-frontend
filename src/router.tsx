import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { eventsLoader } from './pages/Event';

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

const TicketQRCodePage = React.lazy(async () => await import('./features/ticket-qr/TicketQRPage'));
const AllEventsPage = React.lazy(
  async () => await import('./features/all-drops/routes/AllEventsPage'),
);
const ClaimPage = React.lazy(async () => await import('@/features/claim/routes/ClaimRouter'));
const ClaimTokenPage = React.lazy(
  async () => await import('@/features/claim/routes/TokenClaimPage'),
);
const ClaimNftPage = React.lazy(async () => await import('@/features/claim/routes/NFTClaimPage'));
const ClaimTicketPage = React.lazy(
  async () => await import('@/features/claim/routes/TicketClaimPage'),
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
const EventManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/events/EventManagerPage'),
);
const TokenDropManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/token/TokenDropManagerPage'),
);
const NFTDropManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/nft/NFTDropManagerPage'),
);
const TicketDropManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/ticket/TicketDropManagerPage'),
);
const EthDenverLandingPage = React.lazy(async () => await import('@/pages/EthDenver'));

const Gallery = React.lazy(async () => await import('@/pages/Gallery'));

const Event = React.lazy(async () => await import('@/pages/Event'));

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
        path: 'gallery',
        element: <Gallery />,
        loader: () => {
          import('@/lib/keypom').then(async (keypomLib) => {
            await keypomLib.default.init();
          });
          return null;
        },
      },
      {
        path: 'gallery/:eventID',
        element: <Event />,
        loader: eventsLoader,
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
            path: 'tickets',
            children: [
              {
                path: 'ticket/:id', // Match /tickets/ticket/:id
                element: <TicketQRCodePage />,
              },
              // Add other paths as needed...
            ],
          },
          {
            path: 'events',
            element: <ProtectedRoute />, // Wrap the AllEventsPage and its dynamic children with ProtectedRoute
            children: [
              {
                index: true,
                element: <AllEventsPage />, // Display AllEventsPage at /events
              },
              {
                path: 'event/:id', // Match /events/event/:id
                element: <EventManagerPage />,
              },
              {
                path: 'ticket/:id', // Match /events/ticket/:id
                element: <TicketDropManagerPage />,
              },
              // Add other paths as needed...
            ],
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
                element: <ClaimTicketPage />,
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
