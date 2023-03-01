import { type Control, Controller } from 'react-hook-form';

import { TextAreaInput } from '@/components/TextAreaInput';
import { type CreateNftDropFormFieldTypes } from '@/features/create-drop/components/nft/CreateNftDropForm';

interface DescriptionProps {
  control: Control<CreateNftDropFormFieldTypes, unknown>;
}

const FIELD_NAME = 'description';

export const DescriptionInput = ({ control }: DescriptionProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field: { ref, ...fieldProps }, fieldState: { error } }) => (
        <TextAreaInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Description"
          placeholder="A commemorative NFT for attending the Vandelay Industries networking event."
          {...fieldProps}
        />
      )}
    />
  );
};
