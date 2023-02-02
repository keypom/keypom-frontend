import React from 'react';
import { type Control, Controller } from 'react-hook-form';

import { type ClaimTicketFormFieldTypes } from '../ClaimTicketForm';

import { TextInput } from '@/components/TextInput';

interface EmailFieldProps {
  control: Control<ClaimTicketFormFieldTypes, any>;
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
