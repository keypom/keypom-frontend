import { defineStyleConfig } from '@chakra-ui/react';

export const BadgeTheme = defineStyleConfig({
  baseStyle: {
    textTransform: 'initial',
    py: '1.5',
    px: '3',
  },
  sizes: {
    sm: {
      fontSize: 'xs',
    },
    md: {
      fontSize: 'sm',
    },
  },
  variants: {
    lightgreen: {
      color: 'green.600',
      bgColor: 'green.50',
      fontWeight: 'medium',
    },
    blue: {
      color: 'blue.600',
      bgColor: 'blue.50',
      fontWeight: 'medium',
    },
    pink: {
      color: 'pink.600',
      bgColor: 'pink.50',
      fontWeight: 'medium',
    },
    gray: {
      color: 'gray.600',
      bgColor: 'gray.50',
      fontWeight: 'medium',
    },
  },
  defaultProps: {
    size: 'md',
  },
});
