import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { Loading } from './common/components/Loading';

export const App = () => {
  return (
    <ChakraProvider>
      <React.Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </React.Suspense>
    </ChakraProvider>
  );
};
