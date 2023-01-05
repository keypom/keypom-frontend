import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import { ChakraProvider } from '@chakra-ui/react';

import { CoreLayout } from '@/common/components/CoreLayout';
import { PageHead } from '@/common/components/PageHead';
import { theme } from '@/common/theme';

export const App = ({ Component, pageProps }) => {
  const Layout = Component.layout ? Component.layout : CoreLayout;
  return (
    <ChakraProvider theme={theme}>
      <PageHead />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  );
};

export default App;
