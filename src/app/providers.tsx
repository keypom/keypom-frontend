'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { theme } from '@/common/theme';
import { AuthWalletContextProvider } from '@/common/contexts/AuthWalletContext';

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthWalletContextProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>;
    </AuthWalletContextProvider>
  );
};
