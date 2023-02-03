import { Box, Input } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormControl } from '@/components/FormControl';
import { type CreateTicketFieldsSchema } from '@/features/create-drop/contexts/CreateTicketDropContext/CreateTicketDropContext';

export const EventInfoForm = () => {
  const { control } = useFormContext<CreateTicketFieldsSchema>();

  return (
    <Box>
      <Controller
        control={control}
        name="eventName"
        render={({ field, fieldState: { error } }) => {
          return (
            <FormControl
              errorText={error?.message}
              helperText="Will be shown on the claim page"
              label="Event name"
            >
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
            <FormControl
              errorText={error?.message}
              helperText="How many links will be generated?"
              label="Number of tickets"
            >
              <Input
                isInvalid={Boolean(error?.message)}
                placeholder="1 - 10,000"
                type="number"
                {...field}
                onChange={(e) => {
                  field.onChange(parseInt(e.target.value), 10);
                }}
              />
            </FormControl>
          );
        }}
      />
    </Box>
  );
};
