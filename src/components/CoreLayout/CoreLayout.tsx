import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const CoreLayout = () => {
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
        <Outlet />
      </Box>
      <Footer w="full" />
    </Flex>
  );
};
