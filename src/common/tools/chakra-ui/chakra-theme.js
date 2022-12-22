import { extendTheme } from '@chakra-ui/react';

import {
  ButtonTheme,
  TableTheme,
  MenuTheme,
  BadgeTheme,
  InputTheme,
  CheckboxTheme,
} from './components';
import { colors } from './colors';

export const theme = extendTheme({
  components: {
    Button: ButtonTheme,
    Table: TableTheme,
    Menu: MenuTheme,
    Badge: BadgeTheme,
    Input: InputTheme,
    Checkbox: CheckboxTheme,
  },
  colors,
});
