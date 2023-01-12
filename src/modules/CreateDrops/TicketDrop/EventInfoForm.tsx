import { Box, Input } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormControl } from '@/common/components/FormControl';

import { CreateTicketFieldsSchema } from './CreateTicketDropContext';

export const EventInfoForm = () => {
  const {
    setValue,
    handleSubmit,
    control,
    watch,
    formState: { isValid, isDirty },
  } = useFormContext<CreateTicketFieldsSchema>();

  return (
    <Box>
      <Controller
        control={control}
        name="eventName"
        render={({ field, fieldState: { error } }) => {
          return (
            <FormControl errorText={error?.message} label="Event name">
              <Input
                isInvalid={Boolean(error?.message)}
                placeholder="Friday night movies"
                type="text"
                {...field}
              />
            </FormControl>
          );
        }}
      />
      <Controller
        control={control}
        name="totalTickets"
        render={({ field, fieldState: { error } }) => {
          return (
            <FormControl errorText={error?.message} label="Number of tickets">
              <Input
                isInvalid={Boolean(error?.message)}
                placeholder="1 - 10,000"
                type="number"
                {...field}
                onChange={(e) => field.onChange(parseInt(e.target.value), 10)}
              />
            </FormControl>
          );
        }}
      />
    </Box>
  );
};
