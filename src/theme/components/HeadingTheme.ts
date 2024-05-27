import { defineStyleConfig } from '@chakra-ui/react';

export const HeadingTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: 'medium',
    color: 'gray.800',
  },
  sizes: {
    md: {
      fontSize: { base: '2xl', md: '4xl' },
    },
  },
  defaultProps: {
    size: 'md',
  },
});
