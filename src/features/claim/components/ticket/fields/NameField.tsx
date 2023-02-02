import { type Control, Controller } from 'react-hook-form';

import { type ClaimTicketFormFieldTypes } from '../ClaimTicketForm';

import { TextInput } from '@/components/TextInput';

interface NameFieldProps {
  control: Control<ClaimTicketFormFieldTypes, any>;
}

const FIELD_NAME = 'name';

export const NameField = ({ control }: NameFieldProps) => {
  return (
    <Controller
      control={control}
      name={FIELD_NAME}
      render={({ field, fieldState: { error } }) => (
        <TextInput
          errorMessage={error?.message}
          isInvalid={!!error?.message}
          label="Name"
          placeholder="John Doe"
          {...field}
        />
      )}
    />
  );
};
