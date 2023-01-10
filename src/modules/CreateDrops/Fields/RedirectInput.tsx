import { Control, Controller } from 'react-hook-form';

import { TextInput } from '@/common/components/TextInput';

import { CreateNftDropFormFieldTypes } from '../NftDrop/CreateNftDropForm';

interface Props {
  control: Control<CreateNftDropFormFieldTypes, any>;
}

const FIELD_NAME = 'redirectLink';

export const RedirectInput = ({ control }: Props) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field, fieldState: { error } }) => (
        <TextInput
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
