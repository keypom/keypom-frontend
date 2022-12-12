import { Navbar } from '@/common/components/Navbar/Navbar';
import { Box, Flex } from '@chakra-ui/react';
import { Footer } from '@/common/components/Footer/Footer';

export const CoreLayout = ({ children }) => {
  return (
    <Flex
      minH="100vh"
      flexDir="column"
      bg="url(.png), linear-gradient(180deg, rgba(239, 250, 253, 0.4) 0%, rgba(239, 250, 253, 0.6) 27.41%), #FFFFFF;"
      bgBlendMode="overlay, normal, normal"
    >
      <Navbar />
      {children}
      <Footer mt="auto" />
    </Flex>
  );
};
