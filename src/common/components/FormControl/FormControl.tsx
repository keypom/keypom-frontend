import { Box, FormControl as CFormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { Text } from '@/common/components/Typography';

interface FormControlProps {
  label?: string;
  helperText?: string;
  errorText?: string;
}

export const FormControl = ({
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
      {helperText && (
        <Text color="gray.600" mt="0.5">
          {helperText}
        </Text>
      )}
      <Box mt="1.5">{children}</Box>
      {errorText && <FormErrorMessage>{errorText}</FormErrorMessage>}
    </CFormControl>
  );
};
