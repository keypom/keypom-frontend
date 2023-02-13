import { type Control, Controller } from 'react-hook-form';

import { TextInput } from '@/components/TextInput';

import { type ClaimTicketFormFieldTypes } from '../ClaimTicketForm';

interface EmailFieldProps {
  control: Control<ClaimTicketFormFieldTypes, unknown>;
}

const FIELD_NAME = 'email';

export const EmailField = ({ control }: EmailFieldProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field, fieldState: { error } }) => (
        <TextInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Email"
          placeholder="johndoe@mail.com"
          {...field}
        />
      )}
    />
  );
};
