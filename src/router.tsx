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

const AllEventsPage = React.lazy(
  async () => await import('./features/all-events/routes/AllEventsPage'),
);
const TicketPage = React.lazy(async () => await import('@/features/ticket-qr/TicketPage'));
const SpecialTicketPage = React.lazy(async () => await import('@/features/ticket-qr/SpecialTicketPage'));
const ConferencePage = React.lazy(
  async () => await import('@/features/conference-app/ConferencePageManager'),
);
const EventManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/events/EventManagerPage'),
);
const TicketDropManagerPage = React.lazy(
  async () => await import('@/features/drop-manager/routes/ticket/TicketDropManagerPage'),
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
        loader: () => {
          import('@/lib/keypom').then(async (keypomLib) => {
            await keypomLib.default.init();
          });
          return null;
        },
        children: [
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
            path: 'tickets',
            children: [
              {
                path: 'ticket/:id', // Match /events/event/:id
                element: <TicketPage />,
              },
              {
                path: 'special/:id',
                element: <SpecialTicketPage />,
              },
            ],
          },
          {
            path: 'conference',
            children: [
              {
                path: 'app/:id', // Match /events/event/:id
                element: <ConferencePage />,
              },
            ],
          },
          //  claim structure should be claim/:contractId#secretKey
          {
            path: 'scan',
            children: [
              {
                path: 'event/:funderAndEventId',
                element: <ScannerPage />,
              },
            ],
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
