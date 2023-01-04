import { extendTheme } from '@chakra-ui/react';

import { ModalTheme, ButtonTheme, TableTheme, MenuTheme, BadgeTheme } from './components';
import { colors } from './colors';

export const theme = extendTheme({
  components: {
    Modal: ModalTheme,
    Button: ButtonTheme,
    Table: TableTheme,
    Menu: MenuTheme,
    Badge: BadgeTheme,
  },
  colors,
});
