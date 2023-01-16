import { Control, Controller } from 'react-hook-form';

import { TextInput } from '@/common/components/TextInput';

import { ClaimTicketFormFieldTypes } from '../ClaimTicketForm';

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
