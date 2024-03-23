import {
  Box,
  FormControl as CFormControl,
  type FormControlProps as CFormControlProps,
  FormLabel,
  type FormLabelProps,
  Text,
} from '@chakra-ui/react';
import React, { type PropsWithChildren } from 'react';

export interface FormControlProps extends CFormControlProps {
  label?: string;
  helperText?: string;
  errorText?: string;
  labelProps?: FormLabelProps;
  helperTextProps?: Record<string, unknown>;
  marginY?: string;
}

export const FormControlComponent = ({
  label,
  helperText,
  errorText,
  children,
  labelProps,
  helperTextProps,
  marginY = '5',
  ...props
}: PropsWithChildren<FormControlProps>) => {
  return (
    <CFormControl my={marginY} textAlign="left" {...props}>
      <FormLabel color="gray.800" fontSize={{ base: 'sm', md: 'base' }} m="0" {...labelProps}>
        {label}
      </FormLabel>
      {helperText && (
        <Text color="gray.400" mt="0.5" {...helperTextProps}>
          {helperText}
        </Text>
      )}
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
