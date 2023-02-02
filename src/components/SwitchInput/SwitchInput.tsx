import { Switch, type SwitchProps } from '@chakra-ui/react';

import { FormControl, type FormControlProps } from '../FormControl';

interface SwitchInputProps extends FormControlProps {
  switchProps: SwitchProps;
}

export const SwitchInput = ({ switchProps, ...props }: SwitchInputProps) => {
  return (
    <FormControl
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      labelProps={{ color: 'gray.600', mt: '1.5', fontSize: { base: 'sm', md: 'base' } }}
      {...props}
    >
      <Switch {...switchProps} mt="0" />
    </FormControl>
  );
};
