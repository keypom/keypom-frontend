import { type Control, Controller } from 'react-hook-form';

import { TextInput } from '@/components/TextInput';

import { type CreateNftDropFormFieldTypes } from '../CreateNftDropForm';

interface NftNameInputProps {
  control: Control<CreateNftDropFormFieldTypes, unknown>;
}

const FIELD_NAME = 'title';

export const NftNameInput = ({ control }: NftNameInputProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field: { ref, ...fieldProps }, fieldState: { error } }) => (
        <TextInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Name"
          placeholder="Art Vandelay Official"
          {...fieldProps}
        />
      )}
    />
  );
};
