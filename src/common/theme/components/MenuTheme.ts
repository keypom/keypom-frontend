import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { menuAnatomy as parts } from '@chakra-ui/anatomy';

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(parts.keys);

export const MenuTheme = helpers.defineMultiStyleConfig({
  baseStyle: {
    item: {
      fontWeight: 'medium',
      lineHeight: 'normal',
      color: 'gray.600',
      borderBottom: '1px solid',
      borderBottomColor: 'gray.100',
      _first: {
        borderTopRadius: 'xl',
      },
      _last: {
        borderBottom: 'none',
        borderBottomRadius: 'xl',
      },
      _hover: {
        color: 'gray.800',
        bgColor: 'gray.100',
      },
    },
    list: {
      p: '0',
      borderRadius: '6xl',
      minW: '177px',
    },
  },
  sizes: {
    md: {
      item: {
        fontSize: 'md',
        px: '6',
        py: '3',
      },
    },
  },
  variants: {},
  defaultProps: {
    size: 'md',
  },
});
