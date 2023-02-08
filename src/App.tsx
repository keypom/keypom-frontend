import React from 'react';
import { RouterProvider } from 'react-router-dom';

import { AuthWalletContextProvider } from '@/contexts/AuthWalletContext';
import { Fonts } from '@/components/Fonts';
import { Loading } from '@/components/Loading';
import { theme } from '@/theme';
import { router } from '@/router';

import '@near-wallet-selector/modal-ui/styles.css';
import '@/components/WalletSelectorModal/WalletSelectorModal.css';
import keypomInstance from './lib/keypom';

const ChakraProvider = React.lazy(
  async () =>
    await import('@chakra-ui/react').then((mod) => {
      return { default: mod.ChakraProvider };
    }),
);

keypomInstance.init();

export const App = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <ChakraProvider theme={theme}>
        <Fonts />
        <AuthWalletContextProvider>
          <RouterProvider router={router} />
        </AuthWalletContextProvider>
      </ChakraProvider>
    </React.Suspense>
  );
};
