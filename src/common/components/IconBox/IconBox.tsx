import { Box, BoxProps } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

import { RoundIcon } from './RoundIcon';

interface IconBoxProps extends BoxProps {
  icon: React.ReactNode;
}

export const IconBox = ({ children, icon, ...props }: PropsWithChildren<IconBoxProps>) => {
  return (
    <Box
      // https://dev.to/rumansaleem/gradient-borders-with-css-3mnk
      bg="border.box"
      border="2px solid transparent"
      borderRadius="3xl"
      p="16"
      pb="8"
      position="relative"
      textAlign="center"
      {...props}
    >
      <Box left="50%" position="absolute" top="0" transform="translate(-50%, -50%)">
        <RoundIcon icon={icon} />
      </Box>
      {children}
    </Box>
  );
};
