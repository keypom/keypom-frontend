import { defineStyleConfig } from '@chakra-ui/react';

export const Button = defineStyleConfig({
  baseStyle: {
    borderRadius: 'xl',
    fontWeight: 'medium',
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
      border: '2px solid transparent',
      color: 'white',
      bgColor: 'gray.800',
      _hover: {
        bgColor: 'gray.900',
      },
      _focus: {
        bgColor: 'gray.900',
        border: '2px solid',
        borderColor: 'blue.400',
      },
    },
    secondary: {
      border: '2px solid',
      borderColor: 'gray.200',
      color: 'gray.800',
      bgColor: 'white',
      _hover: {
        bgColor: 'gray.200',
      },
      _focus: {
        bgColor: 'gray.200',
        border: '2px solid',
        borderColor: 'blue.400',
      },
    },
  },
  defaultProps: {
    variant: 'primary',
    size: 'md',
  },
});
