import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

export const baseStyle = definePartsStyle({
  header: {
    color: 'gray.900',
    fontWeight: '500',
    letterSpacing: '-0.02em',
    fontSize: '2.25rem',
    p: 0,
  },
  dialog: {
    bg: 'border.box',
    border: '2px solid transparent',
    borderRadius: '8xl',
    boxShadow:
      '0px 100px 80px rgba(1, 133, 195, 0.05), 0px 12.5216px 10.0172px rgba(1, 133, 195, 0.025)',
    mx: { base: 6, md: 0 },
    p: '16',
    pb: '8',
    position: 'relative',
    textAlign: 'center',
  },
  overlay: {
    bgColor: 'rgba(148, 163, 184, 0.1)',
    backdropFilter: 'auto',
    backdropBlur: '10px',
  },
  body: { p: 0, color: 'gray.600', mt: { base: 2, md: 4 } },
  footer: {
    justifyContent: 'center',
    p: 0,
    mt: { base: 4, md: 6 },
  },
});

type defaultProps = ReturnType<typeof defineMultiStyleConfig>['defaultProps'];

const modalDefaultProps = {
  isCentered: true,
}; // type casting is necessary because defaultProps is not accepting ModalProps

export const ModalTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: modalDefaultProps as defaultProps,
});
