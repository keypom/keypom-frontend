import { defineStyleConfig } from '@chakra-ui/react';

export const ButtonTheme = defineStyleConfig({
  baseStyle: {
    borderRadius: '6xl',
    fontWeight: 'medium',
    fontFamily: 'ConsensusHeading',
  },
  sizes: {
    sm: {
      fontSize: 'sm',
      py: '3',
      px: '4',
    },
    md: {
      fontSize: 'md',
      py: '4',
      px: '6',
    },
  },
  variants: {
    primary: {
      bg: '#C936F6',
      color: 'white',
      _hover: {
        bg: '#C936F6',
      },
    },
    secondary: {
      bg: 'gray.200',
      color: 'black',
      _hover: {
        bg: 'gray.300',
      },
    },
  },
  defaultProps: {
    variant: 'primary',
    size: 'md',
  },
});

