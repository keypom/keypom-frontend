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
  HeadingTheme,
} from './components';
import { fontSizes } from './fontSizes';
import { fonts } from './fonts';
import { colors } from './colors';
import { config } from './config';
import { radii } from './sizes';

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
    Heading: HeadingTheme,
  },
  colors,
  config,
  fontSizes,
  fonts,
  radii,
});
