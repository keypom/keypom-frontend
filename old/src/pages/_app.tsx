import { ChakraProvider } from '@chakra-ui/react';
import { initKeypom } from 'keypom-js';

import { CoreLayout } from '@/common/components/CoreLayout';
import { PageHead } from '@/common/components/PageHead';
import { theme, archia, inter } from '@/common/theme';
import { AuthWalletContextProvider } from '@/common/contexts/AuthWalletContext';

import '@near-wallet-selector/modal-ui/styles.css';
import '@/common/components/WalletSelectorModal/WalletSelectorModal.css';

// Initialize the SDK on testnet.
initKeypom({
  network: process.env.NEXT_PUBLIC_KEYPOM_NETWORK,
  funder: {
    accountId: process.env.NEXT_PUBLIC_KEYPOM_ACC_ID,
    secretKey: process.env.NEXT_PUBLIC_KEYPOM_SEC_KEY,
  },
});

export const App = ({ Component, pageProps }) => {
  const Layout = Component.layout ? Component.layout : CoreLayout;
  return (
    <>
      <style global jsx>{`
        :root {
          --archia-font: ${archia.style.fontFamily};
          --inter-font: ${inter.style.fontFamily};
        }
      `}</style>
      <AuthWalletContextProvider>
        <ChakraProvider theme={theme}>
          <PageHead />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </AuthWalletContextProvider>
    </>
  );
};

export default App;
