import { Box, FormControl as CFormControl, FormLabel, Text } from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

interface FormControlProps {
  label?: string;
  helperText?: string;
  errorText?: string;
}

export const FormControlComponent = ({
  label,
  helperText,
  errorText,
  children,
}: PropsWithChildren<FormControlProps>) => {
  return (
    <CFormControl my="5" textAlign="left">
      <FormLabel color="gray.800" m="0">
        {label}
      </FormLabel>
      {helperText && <Text mt="0.5">{helperText}</Text>}
      <Box mt="1.5">{children}</Box>
      {errorText && (
        <Text fontSize={{ base: 'xs', md: 'sm' }} mt="6px" variant="error">
          {errorText}
        </Text>
      )}
    </CFormControl>
  );
};

export const FormControl = React.memo(FormControlComponent);
