import { defineStyleConfig } from '@chakra-ui/react';

export const TextTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: 'normal',
    color: 'gray.600',
  },
  sizes: {
    xs: {
      fontSize: 'xs',
      lineHeight: '16px',
    },
    sm: {
      fontSize: 'sm',
      lineHeight: '20px',
    },
    md: {
      fontSize: { base: 'sm', md: 'base' },
      lineHeight: '24px',
    },
    lg: {
      fontSize: 'lg',
      lineHeight: '28px',
    },
    xl: {
      fontSize: 'xl',
      lineHeight: '28px',
    },
    '2xl': {
      fontSize: '2xl',
      lineHeight: '32px',
    },
    '3xl': {
      fontSize: '3xl',
      lineHeight: '36px',
    },
    '4xl': {
      fontSize: '4xl',
      lineHeight: '43px',
    },
    '5xl': {
      fontSize: '5xl',
      lineHeight: '58px',
    },
    '6xl': {
      fontSize: '6xl',
      lineHeight: '72px',
    },
    '7xl': {
      fontSize: '7xl',
      lineHeight: '86px',
    },
    '8xl': {
      fontSize: '8xl',
      lineHeight: '115px',
    },
  },
  variants: {
    error: {
      color: 'red.600',
    },
  },
  defaultProps: {
    size: 'md',
  },
});
