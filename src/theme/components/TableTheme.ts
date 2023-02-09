import { tableAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(parts.keys);

export const TableTheme = helpers.defineMultiStyleConfig({
  baseStyle: {
    table: {
      bg: 'border.box',
      border: '2px solid transparent',
      borderRadius: '8xl',
      borderCollapse: 'collapse',
      borderSpacing: 0,
      overflow: 'hidden',
    },
    th: {
      textTransform: 'capitalize',
      _first: {
        borderTopLeftRadius: '26px',
      },
      _last: {
        borderTopRightRadius: '26px',
      },
    },
    td: {
      pl: '4',
    },
    tr: {
      borderBottom: '1px solid',
      borderBottomColor: 'gray.100',
      borderStyle: 'solid',
    },
  },
  sizes: {
    sm: {
      tr: {
        borderBottom: '2px solid',
        borderBottomColor: 'gray.100',
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
  },
  defaultProps: {
    variant: 'primary',
  },
});
