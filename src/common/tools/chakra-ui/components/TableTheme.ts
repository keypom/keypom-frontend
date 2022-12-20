import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(['table', 'th', 'td']);

export const TableTheme = helpers.defineMultiStyleConfig({
  baseStyle: {
    table: {
      bg: 'border.box',
      border: '2px solid transparent',
      borderRadius: '3xl',
      variant: 'unstyled',
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    // table header row
    th: {
      textTransform: 'capitalize',
      _first: {
        borderTopLeftRadius: '22px',
      },
      _last: {
        borderTopRightRadius: '22px',
      },
    },
  },
  sizes: {
    sm: {
      td: {
        fontSize: 'sm',
      },
      th: {
        fontSize: 'sm',
      },
    },
    md: {
      td: {
        fontSize: 'md',
        py: '9',
        pl: '8',
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
      },
    },
  },
  defaultProps: {
    variant: 'primary',
  },
});
