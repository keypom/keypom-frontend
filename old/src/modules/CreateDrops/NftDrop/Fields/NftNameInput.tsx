import { Control, Controller } from 'react-hook-form';

import { TextInput } from '@/common/components/TextInput';

import { CreateNftDropFormFieldTypes } from '../CreateNftDropForm';

interface NftNameInputProps {
  control: Control<CreateNftDropFormFieldTypes, any>;
}

const FIELD_NAME = 'nftName';

export const NftNameInput = ({ control }: NftNameInputProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field, fieldState: { error } }) => (
        <TextInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Name"
          placeholder="Danny Daze"
          {...field}
        />
      )}
    />
  );
};
