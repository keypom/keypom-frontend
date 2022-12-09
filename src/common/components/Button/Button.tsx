import React from 'react';
import { Button as CButton } from '@chakra-ui/react';

interface ButtonProps {
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return (
    <CButton borderRadius="12px" bgColor="gray.800" color="white">
      {children}
    </CButton>
  );
};
