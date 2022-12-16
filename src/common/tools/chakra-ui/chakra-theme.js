import { extendTheme } from '@chakra-ui/react';

import { Button } from './components';
import { colors } from './colors';

export const theme = extendTheme({
  components: {
    Button,
  },
  colors,
});
