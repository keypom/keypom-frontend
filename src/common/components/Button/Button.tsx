import React from 'react';
import { Button as CButton, ChakraProps } from '@chakra-ui/react';

interface ButtonProps extends ChakraProps {
  type?: 'primary' | 'secondary';
  light?: boolean;
  dark?: boolean;
  children: React.ReactNode;
}

const getBgColor = (type, light, dark) => {
  switch (type) {
    case 'secondary':
      if (light) return 'white';
      if (dark) return 'gray.200';
    case 'primary':
    default:
      if (light) return 'gray.800';
      if (dark) return 'gray.900';
      return 'gray.900';
  }
};

/**
 * Base button component for Primary and Secondary buttons
 */
export const Button = ({
  type = 'primary',
  dark = true,
  light = false,
  children,
  ...props
}: ButtonProps) => {
  const bgColor = getBgColor(type, light, dark);

  return (
    <CButton
      borderRadius="12px"
      border="2px solid"
      // border={type === 'primary' ? '2px solid' : '1px solid'} <- 1px solid might affect layout flicker on hover
      borderColor={type === 'primary' ? 'transparent' : 'gray.200'}
      _hover={{ border: '2px solid', borderColor: 'blue.400' }}
      bgColor={bgColor}
      color={type === 'primary' ? 'white' : 'gray.800'}
      fontWeight="fontWeight.500"
      {...props}
    >
      {children}
    </CButton>
  );
};
