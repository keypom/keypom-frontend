'use client';

import localFont from '@next/font/local';
import { NextFont } from '@next/font/dist/types';
import { Inter } from '@next/font/google';
/**
 * Fonts
 */
export const archia: NextFont = localFont({
  src: [
    {
      path: '../../assets/fonts/archia/archia-regular-webfont.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/archia/archia-medium-webfont.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/archia/archia-semibold-webfont.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  display: 'swap',
});

export const inter: NextFont = Inter({ subsets: ['latin'], display: 'swap' });

export const GlobalStyle = () => {
  return (
    <style global jsx>{`
      :root {
        --archia-font: ${archia.style.fontFamily};
        --inter-font: ${inter.style.fontFamily};
      }
    `}</style>
  );
};
