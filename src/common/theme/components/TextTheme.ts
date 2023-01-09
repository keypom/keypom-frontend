import { defineStyleConfig } from '@chakra-ui/react';

export const TextTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: 'normal',
    color: 'gray.600',
  },
  sizes: {
    md: {
      fontSize: { base: 'sm', md: 'base' },
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
