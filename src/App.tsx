import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '@/theme';
import './components/DateRangePicker/DatePickerStyle.css'; // Path to your custom CSS
import { router } from '@/router';
import { router as storybookRouter } from '@/storybook-router';
import { Loading } from '@/components/Loading';

const Fonts = React.lazy(
  async () =>
    await import('@/components/Fonts').then((mod) => {
      return { default: mod.Fonts };
    }),
);

const AuthWalletContextProvider = React.lazy(
  async () =>
    await import('@/contexts/AuthWalletContext').then((mod) => {
      return { default: mod.AuthWalletContextProvider };
    }),
);

const AppContextProvider = React.lazy(
  async () =>
    await import('@/contexts/AppContext').then((mod) => {
      return { default: mod.AppContextProvider };
    }),
);

export const App = () => {
  const isStorybook = !!process.env.IS_STORYBOOK_VIEW;

  return (
    <React.Suspense fallback={<Loading />}>
      <ChakraProvider theme={theme}>
        <Fonts />
        {isStorybook ? (
          <RouterProvider router={storybookRouter} />
        ) : (
          <AuthWalletContextProvider>
            <AppContextProvider>
              <RouterProvider router={router} />
            </AppContextProvider>
          </AuthWalletContextProvider>
        )}
      </ChakraProvider>
    </React.Suspense>
  );
};
