import { Input } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormControl } from '@/components/FormControl';

export const EventInfoForm = () => {
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    getValues,
    formState: { isDirty, isValid, errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name="eventName"
      render={({ field, fieldState: { error } }) => {
        return (
          <FormControl errorText={error?.message} label="Event name">
            <Input
              isInvalid={Boolean(error?.message)}
              placeholder="NEARCon 2023"
              type="text"
              {...field}
            />
          </FormControl>
        );
      }}
    />
  );
};
