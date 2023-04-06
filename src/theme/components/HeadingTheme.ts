import { defineStyleConfig } from '@chakra-ui/react';

export const HeadingTheme = defineStyleConfig({
  baseStyle: {
    fontWeight: 'medium',
  },
  sizes: {
    sm: {
      fontSize: { base: 'xl', md: '2xl' },
    },
    md: {
      fontSize: { base: '2xl', md: '4xl' },
    },
  },
  defaultProps: {
    size: 'md',
  },
});
