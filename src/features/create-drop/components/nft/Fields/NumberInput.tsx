import { type Control, Controller } from 'react-hook-form';

import { TextInput } from '@/components/TextInput';

import { type CreateNftDropFormFieldTypes } from '../CreateNftDropForm';

interface NumberInputProps {
  control: Control<CreateNftDropFormFieldTypes, any>;
  label?: string;
}

const FIELD_NAME = 'number';

export const NumberInput = ({ control, label = 'Number' }: NumberInputProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field: { ref, value, ...fieldProps }, fieldState: { error } }) => (
        <TextInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label={label}
          type="number"
          value={value || ''}
          {...fieldProps}
        />
      )}
    />
  );
};
