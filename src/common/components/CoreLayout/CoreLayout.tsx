import { PropsWithChildren } from 'react';
import { Flex } from '@chakra-ui/react';
import { Navbar } from '@/common/components/Navbar';
import { Footer } from '@/common/components/Footer';

interface CoreLayoutProps {}

export const CoreLayout = ({
  children,
}: PropsWithChildren<CoreLayoutProps>) => {
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
