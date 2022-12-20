import { extendTheme } from '@chakra-ui/react';

import { ButtonTheme, TableTheme, MenuTheme } from './components';
import { colors } from './colors';

export const theme = extendTheme({
  components: {
    Button: ButtonTheme,
    Table: TableTheme,
    Menu: MenuTheme,
  },
  colors,
});
