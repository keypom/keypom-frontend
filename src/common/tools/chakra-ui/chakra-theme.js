import { extendTheme } from '@chakra-ui/react';

import { Button, Table } from './components';
import { colors } from './colors';

export const theme = extendTheme({
  components: {
    Button,
    Table,
  },
  colors,
});
