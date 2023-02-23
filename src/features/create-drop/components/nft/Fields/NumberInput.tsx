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
      render={({ field, fieldState: { error } }) => (
        <TextInput
          defaultValue={1}
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Number"
          type="number"
          {...field}
        />
      )}
    />
  );
};
