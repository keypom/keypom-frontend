import { ChakraProvider } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { theme, archia, inter } from '@/common/theme';
import { AuthWalletContextProvider } from '@/common/contexts/AuthWalletContext';
import { CoreLayout } from '@/common/components/CoreLayout';

import '@near-wallet-selector/modal-ui/styles.css';
import '@/common/components/WalletSelectorModal/WalletSelectorModal.css';

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
