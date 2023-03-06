import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '@/theme';
import { router } from '@/router';
import { Loading } from '@/components/Loading';

// import keypomInstance from './lib/keypom';

const Fonts = React.lazy(
  async () =>
    await import('@/components/Fonts').then((mod) => {
      return { default: mod.Fonts };
    }),
);

const AuthWalletContextProvider = React.lazy(
  async () =>
    await import('@/contexts/AuthWalletContext').then((mod) => {
      return { default: mod.AuthWalletContextProvider };
    }),
);

const AppContextProvider = React.lazy(
  async () =>
    await import('@/contexts/AppContext').then((mod) => {
      return { default: mod.AppContextProvider };
    }),
);

// const ChakraProvider = React.lazy(
//   async () =>
//     await import('@chakra-ui/react').then((mod) => {
//       return { default: mod.ChakraProvider };
//     }),
// );

// keypomInstance.init();

export const App = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <ChakraProvider theme={theme}>
        <Fonts />
        <AppContextProvider>
          <AuthWalletContextProvider>
            <RouterProvider router={router} />
          </AuthWalletContextProvider>
        </AppContextProvider>
      </ChakraProvider>
    </React.Suspense>
  );
};
