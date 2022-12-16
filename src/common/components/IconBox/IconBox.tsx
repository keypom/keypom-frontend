import { Box, BoxProps, useToken } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

import { RoundIcon } from './RoundIcon';

interface IconBoxProps extends BoxProps {
  icon: React.ReactNode;
}

export const IconBox = ({ children, icon, ...props }: PropsWithChildren<IconBoxProps>) => {
  const borderBgColor = useToken('colors', 'border.box');

  return (
    <Box
      // https://dev.to/rumansaleem/gradient-borders-with-css-3mnk
      bg={`linear-gradient(white, white) padding-box, ${borderBgColor} border-box`}
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
