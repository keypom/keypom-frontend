import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

interface RoundIconProps extends BoxProps {
  icon: React.ReactNode;
}

export const RoundIcon = ({ icon = null, ...props }: RoundIconProps) => {
  return (
    <Box
      {...props}
      display="flex"
      alignItems="center"
      justifyContent="center"
      w={{ base: '16', md: '20' }}
      h={{ base: '16', md: '20' }}
      borderRadius="50%"
      position="relative"
      padding="0.5"
      bg="border.round"
    >
      <Box
        borderRadius="100%"
        bgColor="blue.200"
        w="full"
        h="full"
        display="grid"
        placeItems="center"
        {...props}
      >
        {icon}
      </Box>
    </Box>
  );
};
