import { Input, HStack, VStack } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormControl } from '@/components/FormControl';
import CustomDateRangePicker from '@/components/DateRangePicker/DateRangePicker';

import { type CreateTicketFieldsSchema } from '../../contexts/CreateTicketDropContext';

export const EventInfoForm = () => {
  const { control, watch } = useFormContext<CreateTicketFieldsSchema>();

  // Watch start and end dates to pass to the CustomDateRangePicker
  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const startTime = watch('startTime');
  const endTime = watch('endTime');

  return (
    <HStack justifyContent="space-between">
      <VStack w="50%">
        <Controller
          control={control}
          name="eventName"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl errorText={error?.message} label="Event name*">
                <Input
                  isInvalid={Boolean(error?.message)}
                  placeholder="Vandelay Industries Networking Event"
                  type="text"
                  {...field}
                />
              </FormControl>
            );
          }}
        />
        <Controller
          control={control}
          name="eventDescription"
          render={({ field }) => {
            return (
              <FormControl label="Event description">
                <Input
                  placeholder="Meet witht he best latex salesmen in the industry."
                  type="text"
                  {...field}
                />
              </FormControl>
            );
          }}
        />
        <Controller
          control={control}
          name="date" // This should match the structure of your form state
          render={({ field, fieldState: { error } }) => {
            // Destructuring with a default value to avoid undefined access
            const { startDate, endDate, startTime, endTime } = field.value || {
              startDate: null,
              endDate: null,
              startTime: null,
              endTime: null,
            };

            return (
              <CustomDateRangePicker
                endDate={endDate}
                endTime={endTime}
                error={error}
                startDate={startDate}
                startTime={startTime}
                onDateChange={(startDate, endDate) => {
                  field.onChange({ ...field.value, startDate, endDate });
                }}
                onTimeChange={(startTime, endTime) => {
                  field.onChange({ ...field.value, startTime, endTime });
                }}
              />
            );
          }}
          rules={{ required: 'A date range is required.' }}
        />
      </VStack>
      <VStack w="50%">
        <Controller
          control={control}
          name="eventName"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl errorText={error?.message} label="Event name*">
                <Input
                  isInvalid={Boolean(error?.message)}
                  placeholder="Vandelay Industries Networking Event"
                  type="text"
                  {...field}
                />
              </FormControl>
            );
          }}
        />
        <Controller
          control={control}
          name="eventDescription"
          render={({ field }) => {
            return (
              <FormControl label="Event description">
                <Input
                  placeholder="Meet with some of the best latex salesmen in the industry."
                  type="text"
                  {...field}
                  onChange={(e) => {
                    field.onChange(parseInt(e.target.value), 10);
                  }}
                />
              </FormControl>
            );
          }}
        />
      </VStack>
    </HStack>
  );
};
