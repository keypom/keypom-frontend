import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AppModal } from '@/components/AppModal';

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
