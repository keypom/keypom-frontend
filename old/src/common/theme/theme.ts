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
import { colors } from './colors';
import { config } from './config';
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
    Heading: HeadingTheme,
  },
  colors,
  config,
  fontSizes,
  fonts,
  radii,
});
