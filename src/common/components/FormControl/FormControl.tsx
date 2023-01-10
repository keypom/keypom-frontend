import {
  Box,
  FormControl as CFormControl,
  FormControlProps as CFormControlProps,
  FormLabel,
  FormLabelProps,
} from '@chakra-ui/react';
import React, { PropsWithChildren } from 'react';

import { Text } from '@/common/components/Typography';

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
      {helperText && (
        <Text color="gray.600" mt="0.5">
          {helperText}
        </Text>
      )}
      <Box mt="1.5">{children}</Box>
      {errorText && (
        <Text color="red.600" fontSize={{ base: 'xs', md: 'sm' }} mt="6px">
          {errorText}
        </Text>
      )}
    </CFormControl>
  );
};

export const FormControl = React.memo(FormControlComponent);
