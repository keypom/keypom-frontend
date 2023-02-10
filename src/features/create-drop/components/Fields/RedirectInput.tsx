import { type Control, Controller } from 'react-hook-form';

import { TextInput } from '@/components/TextInput';
import { type CreateNftDropFormFieldTypes } from '@/features/create-drop/components/nft/CreateNftDropForm';

interface RedirectInputProps {
  control: Control<CreateNftDropFormFieldTypes, unknown>;
}

const FIELD_NAME = 'redirectLink';

export const RedirectInput = ({ control }: RedirectInputProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field, fieldState: { error } }) => (
        <TextInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Redirect link (optional)"
          placeholder="Enter a link"
          topLeftHelperMessage="Choose which wallet to set people up with."
          {...field}
        />
      )}
    />
  );
};
