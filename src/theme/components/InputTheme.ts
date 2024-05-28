import { inputAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(parts.keys);

export const InputTheme = helpers.defineMultiStyleConfig({
  baseStyle: {
    field: {
      color: 'gray.800',
    },
  },
  sizes: {
    md: {
      field: {
        borderRadius: '6xl',
        h: '12',
      },
    },
  },
  variants: {
    outline: {
      field: {
        borderColor: 'gray.300',
        _focus: {
          borderColor: 'blue.500',
        },
        _invalid: {
          borderColor: 'red.300',
        },
      },
    },
  },
});
