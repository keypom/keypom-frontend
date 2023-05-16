import { tableAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(parts.keys);

export const TableTheme = helpers.defineMultiStyleConfig({
  baseStyle: {
    table: {
      bg: 'border.box',
      border: '2px solid white',
      borderRadius: '8xl',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      overflow: 'hidden',
    },
    tr: {
      borderBottom: '1px solid',
      borderBottomColor: 'gray.100',
      borderStyle: 'solid',
    },
  },
  sizes: {
    sm: {
      table: {
        borderRadius: '6xl',
      },
      tr: {
        borderBottom: '2px solid',
        borderBottomColor: 'gray.100',
        height: '80px',
      },
      th: {
        fontSize: 'sm',
        height: '44px',
        textTransform: 'capitalize',
        _first: {
          borderTopLeftRadius: '4px',
          pl: '4',
        },
        _last: {
          borderTopRightRadius: '4px',
        },
        p: '0',
      },
      td: {
        fontSize: 'sm',
      },
    },
    md: {
      td: {
        fontSize: 'md',
        py: { base: '6', md: '9' },
        px: { base: '5', md: '8' },
      },
      th: {
        fontSize: 'md',
        py: '5',
        pl: '8',
        textTransform: 'capitalize',
        _first: {
          borderTopLeftRadius: '26px',
        },
        _last: {
          borderTopRightRadius: '26px',
        },
      },
    },
  },
  variants: {
    primary: {
      th: {
        bg: 'gray.100',
        color: 'gray.600',
        fontWeight: 'medium',
        overflow: 'hidden',
      },
    },
    secondary: {
      th: {
        bg: 'inherit',
        color: 'gray.800',
        fontWeight: 'semibold',
        overflow: 'hidden',
        height: '88px',
      },
    },
    tertiary: {
      th: {
        bg: 'gray.100',
        color: 'gray.900',
        fontWeight: 'medium',
        overflow: 'hidden',
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
});
