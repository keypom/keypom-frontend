import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { initKeypom } from 'keypom-js';

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
  // Initialize the SDK on testnet.
  React.useEffect(() => {
    const initializeKeypom = async () => {
      await initKeypom({
        network: process.env.NEXT_PUBLIC_KEYPOM_NETWORK ?? 'testnet',
        funder: {
          accountId: process.env.NEXT_PUBLIC_KEYPOM_ACC_ID ?? '',
          secretKey: process.env.NEXT_PUBLIC_KEYPOM_SEC_KEY ?? '',
        },
      });
    };
    initializeKeypom().catch(console.error); // eslint-disable-line no-console
  }, []);

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
