import { Global } from '@emotion/react';

export const Fonts = () => (
  <Global
    styles={`
      /* Archia */
      @font-face {
        font-family: 'Archia';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(./assets/fonts/archia/archia-regular-webfont.woff2) format('woff2')
      }
      @font-face {
        font-family: 'Archia';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url(./assets/fonts/archia/archia-medium-webfont.woff2) format('woff2')
      }
      @font-face {
        font-family: 'Archia';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url(./assets/fonts/archia/archia-semibold-webfont.woff2) format('woff2')
      }

      /* Inter */
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-display: swap;
        src: url(./assets/fonts/inter/Inter-Regular.woff2) format('woff2')
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 500;
        font-display: swap;
        src: url(./assets/fonts/inter/Inter-Medium.woff2) format('woff2')
      }
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-display: swap;
        src: url(./assets/fonts/inter/Inter-SemiBold.woff2) format('woff2')
      }
      `}
  />
);
