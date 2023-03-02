import { type Control, Controller } from 'react-hook-form';

import { TextInput } from '@/components/TextInput';

import { type CreateNftDropFormFieldTypes } from '../CreateNftDropForm';

interface NumberInputProps {
  control: Control<CreateNftDropFormFieldTypes, any>;
}

const FIELD_NAME = 'number';

export const NumberInput = ({ control }: NumberInputProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field: { ref, value, ...fieldProps }, fieldState: { error } }) => (
        <TextInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Number"
          type="number"
          value={value || ''}
          {...fieldProps}
        />
      )}
    />
  );
};
