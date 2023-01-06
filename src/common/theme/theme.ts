import { extendTheme } from '@chakra-ui/react';

import {
  ModalTheme,
  ButtonTheme,
  TableTheme,
  MenuTheme,
  BadgeTheme,
  InputTheme,
  TextTheme,
  CheckboxTheme,
} from './components';
import { colors } from './colors';
import { radii } from './sizes';
import { fontSizes, fonts } from './typo';

export const theme = extendTheme({
  components: {
    Modal: ModalTheme,
    Button: ButtonTheme,
    Table: TableTheme,
    Menu: MenuTheme,
    Badge: BadgeTheme,
    Input: InputTheme,
    Checkbox: CheckboxTheme,
    Text: TextTheme,
  },
  colors,
  fontSizes,
  fonts,
  radii,
});
