import { defineStyleConfig } from '@chakra-ui/react';

export const CheckboxTheme = defineStyleConfig({
  baseStyle: {
    border: '1px solid',
    borderColor: 'gray.100',

    _checked: {
      bgColor: 'red',
    },
  },
});
