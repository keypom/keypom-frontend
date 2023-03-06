import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '@/theme';
import { router } from '@/router';
import { Loading } from '@/components/Loading';

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

import('@/lib/keypom').then(async (keypomLib) => {
  await keypomLib.default.init();
});

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
