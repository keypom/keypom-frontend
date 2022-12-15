import React from 'react';
import {
  Button as CButton,
  ChakraProps,
  useStyleConfig,
} from '@chakra-ui/react';

interface ButtonProps extends ChakraProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button = ({
  variant = 'primary',
  children,
  ...props
}: ButtonProps) => {
  const styles = useStyleConfig('Button', { variant });

  return (
    <CButton
      sx={styles}
      _hover={{
        bgColor: variant === 'primary' ? 'gray.900' : 'gray.200',
      }}
      _focus={{
        bgColor: variant === 'primary' ? 'gray.900' : 'gray.200',
        border: '2px solid',
        borderColor: 'blue.400',
      }}
      {...props}
    >
      {children}
    </CButton>
  );
};
