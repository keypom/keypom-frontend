import { Box, type ResponsiveValue, type BoxProps } from '@chakra-ui/react';
import { type PropsWithChildren, type ReactNode } from 'react';

import { RoundIcon } from './RoundIcon';

interface IconBoxProps extends BoxProps {
  icon?: ReactNode;
  bg?: ResponsiveValue<string>;
  iconBg?: string;
  iconBorder?: string;
}

export const IconBox = ({
  children,
  icon,
  bg = 'border.box',
  iconBg = 'blue.100',
  iconBorder = 'border.round',
  ...props
}: PropsWithChildren<IconBoxProps>) => {
  return (
    <Box
      // https://dev.to/rumansaleem/gradient-borders-with-css-3mnk
      bg={bg}
      border="2px solid transparent"
      borderRadius="8xl"
      p={{ base: '6', md: '16' }}
      pb={{ base: '6', md: '8' }}
      position="relative"
      textAlign="center"
      {...props}
    >
      {icon !== undefined && (
        <Box left="50%" position="absolute" top="0" transform="translate(-50%, -50%)" zIndex="11">
          <RoundIcon bg={iconBg} border={iconBorder} icon={icon} />
        </Box>
      )}
      {children}
    </Box>
  );
};
