import { RecursiveObject } from '@chakra-ui/react';
import localFont from '@next/font/local';
import { NextFont } from '@next/font/dist/types';
import { Inter } from '@next/font/google';

/**
 * For Chakra Theme
 *
 */
export const fontSizes: RecursiveObject<string> = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
  '5xl': '3rem',
  '6xl': '3.75rem',
  '7xl': '4.5rem',
  '8xl': '6rem',
};

export const fonts: RecursiveObject<string> = {
  heading: 'var(--archia-font), system-ui, sans-serif',
  body: 'var(--inter-font), system-ui, sans-serif',
};

/**
 * Fonts
 */
export const archia: NextFont = localFont({
  src: [
    {
      path: '../../../assets/fonts/archia/archia-regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../assets/fonts/archia/archia-medium-webfont.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../../assets/fonts/archia/archia-semibold-webfont.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
});

export const inter: NextFont = Inter({ subsets: ['latin'], display: 'swap' });
