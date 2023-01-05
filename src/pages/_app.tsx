import { ChakraProvider } from '@chakra-ui/react';
import { Inter } from '@next/font/google';

import { CoreLayout } from '@/common/components/CoreLayout';
import { PageHead } from '@/common/components/PageHead';
import { theme } from '@/common/theme';

const inter = Inter({ weight: 'variable' });

export const App = ({ Component, pageProps }) => {
  const Layout = Component.layout ? Component.layout : CoreLayout;
  return (
    <ChakraProvider theme={theme}>
      <main className={inter.className}>
        <PageHead />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </main>
    </ChakraProvider>
  );
};

export default App;
