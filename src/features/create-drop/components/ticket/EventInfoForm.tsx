import { Input, HStack, VStack, Heading, Show, Hide } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { FormControl } from '@/components/FormControl';
import CustomDateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import { ImageFileInput } from '@/components/ImageFileInput';
import CustomDateRangePickerMobile from '@/components/DateRangePicker/MobileDateRangePicker';

import { type CreateTicketFieldsSchema } from '../../contexts/CreateTicketDropContext';

export const EventInfoForm = () => {
  const { control, watch } = useFormContext<CreateTicketFieldsSchema>();
  // Watch start and end dates to pass to the CustomDateRangePicker
  const date = watch('date');

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePlaceholer, setDatePlaceholder] = useState('Select date and time');

  useEffect(() => {
    let datePlaceholder = 'Select date and time';
    if (date?.startDate) {
      const start = new Date(date.startDate);
      datePlaceholder = start.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZoneName: 'short',
      });
      if (date.startTime) {
        datePlaceholder += ` (${date.startTime})`;
      }
    }

    if (date?.endDate) {
      const end = new Date(date.endDate);
      datePlaceholder += ` - ${end.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZoneName: 'short',
      })}`;
      if (date.endTime) {
        datePlaceholder += ` (${date.endTime})`;
      }
    }

    setDatePlaceholder(datePlaceholder);
  }, [date]);

  const datePickerCTA = (
    <VStack align="start" width="100%">
      <Heading fontFamily="body" fontSize="base" fontWeight="medium">
        Date*
      </Heading>
      <Input
        readOnly
        placeholder={datePlaceholer}
        style={{ cursor: 'pointer' }}
        sx={{
          '::placeholder': {
            color: 'gray.400', // Placeholder text color
          },
        }}
        type="text"
        onClick={() => {
          setIsDatePickerOpen(true);
        }}
      />
    </VStack>
  );

  return (
    <HStack justifyContent="space-between">
      <VStack spacing="4" w="50%">
        <Controller
          control={control}
          name="eventName"
          render={({ field, fieldState: { error } }) => {
            return (
              <FormControl errorText={error?.message} label="Event name*" marginBottom="0">
                <Input
                  isInvalid={Boolean(error?.message)}
                  placeholder="Vandelay Industries Networking Event"
                  sx={{
                    '::placeholder': {
                      color: 'gray.400', // Placeholder text color
                    },
                  }}
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
                  placeholder="Meet with the best latex salesmen in the industry."
                  sx={{
                    '::placeholder': {
                      color: 'gray.400', // Placeholder text color
                    },
                  }}
                  type="text"
                  {...field}
                />
              </FormControl>
            );
          }}
        />
        <Controller
          control={control}
          name="eventLocation"
          render={({ field }) => {
            return (
              <FormControl label="Event location">
                <Input
                  placeholder="129 West 81st Street, Apartment 5A"
                  sx={{
                    '::placeholder': {
                      color: 'gray.400', // Placeholder text color
                    },
                  }}
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
              <>
                <Show above="md">
                  <CustomDateRangePicker
                    ctaComponent={datePickerCTA}
                    endDate={endDate}
                    endTime={endTime}
                    error={error}
                    isDatePickerOpen={isDatePickerOpen}
                    setIsDatePickerOpen={setIsDatePickerOpen}
                    startDate={startDate}
                    startTime={startTime}
                    onDateChange={(startDate, endDate) => {
                      field.onChange({ ...field.value, startDate, endDate });
                    }}
                    onTimeChange={(startTime, endTime) => {
                      field.onChange({ ...field.value, startTime, endTime });
                    }}
                  />
                </Show>
                <Hide above="md">
                  <CustomDateRangePickerMobile
                    ctaComponent={datePickerCTA}
                    endDate={endDate}
                    endTime={endTime}
                    error={error}
                    isDatePickerOpen={isDatePickerOpen}
                    setIsDatePickerOpen={setIsDatePickerOpen}
                    startDate={startDate}
                    startTime={startTime}
                    onDateChange={(startDate, endDate) => {
                      field.onChange({ ...field.value, startDate, endDate });
                    }}
                    onTimeChange={(startTime, endTime) => {
                      field.onChange({ ...field.value, startTime, endTime });
                    }}
                  />
                </Hide>
              </>
            );
          }}
          rules={{ required: 'A date range is required.' }}
        />
        <Controller
          control={control}
          name="eventArtwork"
          render={({ field }) => {
            return (
              <FormControl
                helperText="Customize the header for your the event page"
                label="Event artwork*"
              >
                <ImageFileInput buttonText="Browse" ctaText="Browse your image here" />
              </FormControl>
            );
          }}
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
                  placeholder="Meet with some of the best latex salesmen in the industry"
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
