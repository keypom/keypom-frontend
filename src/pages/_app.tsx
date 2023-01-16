import { ChakraProvider } from '@chakra-ui/react';

import { CoreLayout } from '@/common/components/CoreLayout';
import { WalletSelectorContextProvider } from '@/modules/WalletSelector';
import { PageHead } from '@/common/components/PageHead';
import { theme, archia, inter } from '@/common/theme';

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
      <ChakraProvider theme={theme}>
        {/* <div className={inter.className}> */}

        <WalletSelectorContextProvider>
          <PageHead />
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {/* </div> */}
        </WalletSelectorContextProvider>

      </ChakraProvider>
    </>
  );
};

export default App;
