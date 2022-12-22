import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

// This function creates a set of function that helps us create multipart component styles.
const helpers = createMultiStyleConfigHelpers(['field']);

export const InputTheme = helpers.defineMultiStyleConfig({
  sizes: {
    md: {
      field: {
        borderRadius: 'xl',
      },
    },
  },
});
