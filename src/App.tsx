import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { AuthWalletContextProvider } from '@/contexts/AuthWalletContext';
import { AppContextProvider } from '@/contexts/AppContext';
import { Fonts } from '@/components/Fonts';
import { Loading } from '@/components/Loading';
import { theme } from '@/theme';
import { router } from '@/router';

import '@near-wallet-selector/modal-ui/styles.css';
import '@/components/WalletSelectorModal/WalletSelectorModal.css';

const ChakraProvider = React.lazy(
  async () =>
    await import('@chakra-ui/react').then((mod) => {
      return { default: mod.ChakraProvider };
    }),
);

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
