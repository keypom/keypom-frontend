import { Navbar } from '@/common/components/Navbar/Navbar';
import { Box } from '@chakra-ui/react';

export const CoreLayout = ({ children }) => {
  return (
    <Box minH="100vh" bgColor="#EFFAFD">
      <Navbar>{children}</Navbar>
    </Box>
  );
};
