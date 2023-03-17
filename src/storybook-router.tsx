import { Box } from '@chakra-ui/react';
import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';

const StorybookPage = React.lazy(
  async () => await import('@/features/storybook/routes/StorybookPage'),
);

export const router = createBrowserRouter([
  {
    element: (
      <Box px="8" py="16">
        <Outlet />
      </Box>
    ),
    children: [
      {
        index: true,
        element: <StorybookPage />,
      },
    ],
  },
]);
