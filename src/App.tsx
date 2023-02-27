import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { initKeypom } from 'keypom-js';

import { AuthWalletContextProvider } from '@/contexts/AuthWalletContext';
import { AppContextProvider } from '@/contexts/AppContext';
import { Fonts } from '@/components/Fonts';
import { Loading } from '@/components/Loading';
import { theme } from '@/theme';
import { router } from '@/router';
import nearConfig from '@/utils/near';

import '@near-wallet-selector/modal-ui/styles.css';
import '@/components/WalletSelectorModal/WalletSelectorModal.css';
import keypomInstance from './lib/keypom';

const { networkId, contractId } = nearConfig;
// @eslint-disable-next-line typescript-eslint/no-floating-promises
initKeypom({
  network: networkId,
  keypomContractId: contractId,
});

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
        <AppContextProvider>
          <AuthWalletContextProvider>
            <RouterProvider router={router} />
          </AuthWalletContextProvider>
        </AppContextProvider>
      </ChakraProvider>
    </React.Suspense>
  );
};
