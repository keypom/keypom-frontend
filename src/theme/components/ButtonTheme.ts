import { defineStyleConfig } from '@chakra-ui/react';

export const ButtonTheme = defineStyleConfig({
  baseStyle: {
    borderRadius: '6xl',
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
        _disabled: {
          bgColor: 'gray.900',
        },
      },
      _focus: {
        bgColor: 'gray.900',
        border: '2px solid',
        borderColor: 'blue.400',
      },
    },
    landing: {
      border: '2px solid transparent',
      color: 'white',
      bg: 'border.landing.800',
      _hover: {
        bgColor: 'border.landing.900',
        _disabled: {
          bgColor: 'border.landing.900',
        },
      },
      _focus: {
        bgColor: 'border.landing.900',
        border: '2px solid',
        borderColor: 'blue.400',
      },
      _disabled: {
        pointerEvents: 'none',
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
    'secondary-content-box': {
      boxSizing: 'content-box',
      h: 'calc(40px - 24px)',
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
    icon: {
      border: '2px solid',
      borderColor: 'gray.200',
      color: 'gray.800',
      bgColor: 'white',
      borderRadius: '100%',
      px: '8px',
      _hover: {
        bgColor: 'gray.200',
      },
      _focus: {
        bgColor: 'gray.200',
        border: '2px solid',
        borderColor: 'blue.400',
      },
    },
    pill: {
      borderRadius: '52px',
      bg: 'border.box',
      border: '1px solid transparent',
    },
  },
  defaultProps: {
    variant: 'primary',
    size: 'md',
  },
});
