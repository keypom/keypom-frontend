import { Box, BoxProps } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';
import { RoundIcon } from './RoundIcon';

interface IconBoxProps extends BoxProps {
  icon: React.ReactNode;
  outerBoxProps?: BoxProps;
  boxContentProps?: BoxProps;
}

export const IconBox = ({
  w,
  outerBoxProps,
  boxContentProps,
  icon,
  children,
}: PropsWithChildren<IconBoxProps>) => {
  return (
    <Box
      borderRadius="3xl"
      padding="0.5"
      position="relative"
      background="border.box"
      w={w}
      {...outerBoxProps}
    >
      {/* Icon */}
      <Box
        position="absolute"
        top="0"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <RoundIcon icon={icon} />
      </Box>

      {/* Box Content */}
      <Box
        borderRadius="3xl"
        bgColor="white"
        p="16"
        pb="8"
        {...boxContentProps}
        w="initial"
      >
        {children}
      </Box>
    </Box>
  );
};
