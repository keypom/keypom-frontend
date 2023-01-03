import { extendTheme } from '@chakra-ui/react';

import { ButtonTheme, TableTheme, MenuTheme, BadgeTheme, Modal } from './components';
import { colors } from './colors';

export const theme = extendTheme({
  components: {
    Button: ButtonTheme,
    Table: TableTheme,
    Menu: MenuTheme,
    Badge: BadgeTheme,
    Modal,
  },
  colors,
});
