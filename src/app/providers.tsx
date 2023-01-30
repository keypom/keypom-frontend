'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';
import dynamic from 'next/dynamic';

import { theme } from '@/common/theme';

const AuthWalletContextProvider = dynamic(() =>
  import('@/common/contexts/AuthWalletContext').then((mod) => mod.AuthWalletContextProvider),
);

export const Providers = ({ children }: PropsWithChildren) => {
  return (
    <AuthWalletContextProvider>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>;
    </AuthWalletContextProvider>
  );
};
