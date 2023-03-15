import { inputAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(parts.keys);

export const InputTheme = helpers.defineMultiStyleConfig({
  sizes: {
    md: {
      field: {
        borderRadius: '6xl',
        h: '12',
      },
      addon: {
        h: '12',
        borderRadius: '6xl',
      },
    },
  },
  variants: {
    outline: {
      field: {
        _invalid: {
          borderColor: 'red.300',
        },
      },
    },
  },
});
