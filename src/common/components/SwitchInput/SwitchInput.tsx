import { Switch, SwitchProps } from '@chakra-ui/react';

import { FormControl, FormControlProps } from '../FormControl';

interface SwitchInputProps extends FormControlProps {
  switchProps: SwitchProps;
}

export const SwitchInput = ({ switchProps, ...props }: SwitchInputProps) => {
  return (
    <FormControl
      alignItems="center"
      display="flex"
      justifyContent="space-between"
      labelProps={{ color: 'gray.600' }}
      {...props}
    >
      <Switch {...switchProps} />
    </FormControl>
  );
};
