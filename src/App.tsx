import React from 'react';
// import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';

import { router } from './router';
import { Loading } from './common/components/Loading';

const ChakraProvider = React.lazy(
  async () =>
    await import('@chakra-ui/react').then((mod) => {
      return { default: mod.ChakraProvider };
    }),
);

export const App = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </React.Suspense>
  );
};
