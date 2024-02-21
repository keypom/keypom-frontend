import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { Footer } from '@/components/Footer';

const Navbar = React.lazy(
  async () => await import('@/components/Navbar').then((mod) => ({ default: mod.Navbar })),
);

const AppModal = React.lazy(
  async () => await import('@/components/AppModal').then((mod) => ({ default: mod.AppModal })),
);

export const CoreLayout = () => {
  const layoutBg =
    'linear-gradient(0deg,rgba(220,244,251,1) 0%,rgba(251,254,255,1) 95%,rgba(255,255,255,1) 100%)';
  return (
    <Flex
      alignItems="flex-start"
      bg={layoutBg}
      bgBlendMode="overlay, normal, normal"
      flexDir="column"
      minH="100vh"
      overflow="hidden"
      position="relative"
    >
      <Box
        bg="linear-gradient(180deg, rgba(255, 207, 234, 0) 0%, #30c9f34b 100%)"
        bottom="-75"
        filter="blur(100px)"
        h="500px"
        left="calc(50% - 250px)"
        overflow="hidden"
        position="absolute"
        transform="rotate(30deg)"
        w="500px"
        zIndex="0"
      />
      <Navbar w="full" />
      <Box as="main" flex="1" maxW="75rem" mx="auto" px="5" w="full" zIndex="2">
        <Outlet />
      </Box>
      <Footer w="full" />
      <AppModal />
    </Flex>
  );
};
