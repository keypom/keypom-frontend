import localFont from '@next/font/local'

export const archia = localFont({
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
})