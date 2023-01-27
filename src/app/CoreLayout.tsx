'use client';
import { PropsWithChildren } from 'react';
import { Box, Flex } from '@chakra-ui/react';

import { Navbar } from '@/common/components/Navbar';
import { Footer } from '@/common/components/Footer';

interface CoreLayoutProps {}

export const CoreLayout = ({ children }: PropsWithChildren<CoreLayoutProps>) => {
  const layoutBg =
    'url(.png), linear-gradient(180deg, rgba(239, 250, 253, 0.4) 0%, rgba(239, 250, 253, 0.6) 27.41%), #FFFFFF;';
  return (
    <Flex
      alignItems="flex-start"
      bg={layoutBg}
      bgBlendMode="overlay, normal, normal"
      flexDir="column"
      minH="100vh"
    >
      <Navbar w="full" />
      <Box as="main" flex="1" maxW="75rem" mx="auto" px="5" w="full">
        {children}
      </Box>
      <Footer w="full" />
    </Flex>
  );
};
