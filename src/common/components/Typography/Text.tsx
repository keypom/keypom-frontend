import React, { PropsWithChildren } from 'react';
import { Text as CText, TextProps as CTextProps } from '@chakra-ui/react';

interface Text extends CTextProps {
  children: React.ReactNode;
}

export const Text = ({ children, ...props }: PropsWithChildren<Text>) => {
  return (
    <CText
      color="gray.600"
      fontSize={{ base: 'sm', md: 'md' }}
      fontWeight="normal"
      {...props}
    >
      {children}
    </CText>
  );
};
