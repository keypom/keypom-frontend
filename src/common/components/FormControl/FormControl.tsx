import {
  Box,
  FormControl as CFormControl,
  FormControlProps as CFormControlProps,
  FormLabel,
  FormLabelProps,
  Text,
} from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

export interface FormControlProps extends CFormControlProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  labelProps?: FormLabelProps;
}

export const FormControlComponent = ({
  label,
  helperText,
  errorText,
  children,
  labelProps,
  ...props
}: PropsWithChildren<FormControlProps>) => {
  return (
    <CFormControl my="5" textAlign="left" {...props}>
      <FormLabel color="gray.800" m="0" {...labelProps}>
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
