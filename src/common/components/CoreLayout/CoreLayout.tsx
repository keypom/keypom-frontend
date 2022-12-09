import { Navbar } from '@/common/components/Navbar/Navbar';
import { Box } from '@chakra-ui/react';

export const CoreLayout = ({ children }) => {
  return (
    <Box
      minH="100vh"
      bg="url(.png), linear-gradient(180deg, rgba(239, 250, 253, 0.4) 0%, rgba(239, 250, 253, 0.6) 27.41%), #FFFFFF;"
      bgBlendMode="overlay, normal, normal"
    >
      <Navbar>{children}</Navbar>
    </Box>
  );
};
