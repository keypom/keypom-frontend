import { Control, Controller } from 'react-hook-form';

import { TextAreaInput } from '@/common/components/TextAreaInput';

import { CreateNftDropFormFieldTypes } from '../CreateNftDropForm';

interface DescriptionProps {
  control: Control<CreateNftDropFormFieldTypes, any>;
}

const FIELD_NAME = 'description';

export const DescriptionInput = ({ control }: DescriptionProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field, fieldState: { error } }) => (
        <TextAreaInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Description"
          placeholder="A commemorative NFT for the event"
          {...field}
        />
      )}
    />
  );
};
