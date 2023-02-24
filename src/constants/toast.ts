import { type UseToastOptions } from '@chakra-ui/react';

export const UNAUTHORIZED_TOAST: UseToastOptions = {
  title: 'User is not authorized',
  description: 'Please connect to your wallet.',
  status: 'error',
  duration: 2000,
  isClosable: true,
};
