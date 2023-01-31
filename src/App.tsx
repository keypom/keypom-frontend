import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import TopBarProgress from 'react-topbar-progress-indicator';

import { router } from './router';

export const App = () => {
  return (
    <ChakraProvider>
      <React.Suspense fallback={<TopBarProgress />}>
        <RouterProvider router={router} />
      </React.Suspense>
    </ChakraProvider>
  );
};
