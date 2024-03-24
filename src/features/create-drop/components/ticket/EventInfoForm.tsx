import { Input, HStack, VStack, Show, Hide, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import CustomDateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import { ImageFileInput } from '@/components/ImageFileInput';
import CustomDateRangePickerMobile from '@/components/DateRangePicker/MobileDateRangePicker';
import { FormControlComponent } from '@/components/FormControl';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';

import {
  type TicketDropFormData,
  type EventStepFormProps,
} from '../../routes/CreateTicketDropPage';

import EventPagePreview from './EventPagePreview';

export const ClearEventInfoForm = () => {
  return {
    eventName: { value: '' },
    eventArtwork: { value: undefined },
    eventDescription: { value: '' },
    eventLocation: { value: '' },
    date: {
      value: {
        startDate: 0,
      },
    },
  };
};

export const EventInfoFormValidation = (formData: TicketDropFormData) => {
  const newFormData = { ...formData };
  let isErr = false;
  return { isErr, newFormData: formData };

  if (formData.eventName.value === '') {
    newFormData.eventName = { ...formData.eventName, error: 'Event name is required' };
    isErr = true;
  }
  if (formData.eventArtwork.value === undefined) {
    newFormData.eventArtwork = { ...formData.eventArtwork, error: 'Event artwork is required' };
    isErr = true;
  }
  if (formData.eventDescription.value === '') {
    newFormData.eventDescription = {
      ...formData.eventDescription,
      error: 'Event description is required',
    };
    isErr = true;
  }
  if (formData.eventLocation.value === '') {
    newFormData.eventLocation = {
      ...formData.eventLocation,
      error: 'Event location is required',
    };
    isErr = true;
  }
  if (formData.date.value.startDate === null) {
    newFormData.date = { ...formData.date, error: 'Event date is required' };
    isErr = true;
  }

  return { isErr, newFormData };
};

const EventInfoForm = (props: EventStepFormProps) => {
  const { formData, setFormData } = props;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePlaceholer, setDatePlaceholder] = useState('Select date and time');
  const [datePreviewText, setDatePreviewText] = useState<string>('');

  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (formData.eventArtwork.value === undefined) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(formData.eventArtwork.value);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [formData.eventArtwork.value]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPreview(undefined);
      setFormData({ ...formData, eventArtwork: { value: undefined } });
      return;
    }

    const file = e.target.files[0];
    setFormData({ ...formData, eventArtwork: { value: file } });
  };

  useEffect(() => {
    const datePlaceholder = dateAndTimeToText(formData.date.value, 'Select date and time');
    const datePreviewText = dateAndTimeToText(formData.date.value);

    setDatePlaceholder(datePlaceholder);
    setDatePreviewText(datePreviewText);
  }, [formData.date]);

  const margins = '2 !important';

  const datePickerCTA = (
    <FormControlComponent errorText={formData.date.error} label="Date*" my={margins}>
      <Input
        readOnly
        isInvalid={!!formData.date.error}
        maxLength={500}
        placeholder={datePlaceholer}
        style={{ cursor: 'pointer' }}
        sx={{
          '::placeholder': {
            color: 'gray.400', // Placeholder text color
          },
          _invalid: {
            borderColor: 'red.300',
            boxShadow: '0 0 0 1px #EF4444 !important',
          },
        }}
        type="text"
        width="100%"
        onClick={() => {
          setIsDatePickerOpen(true);
        }}
      />
    </FormControlComponent>
  );

  return (
    <HStack align="top" justifyContent="space-between">
      <VStack spacing="0" w="100%">
        <FormControlComponent errorText={formData.eventName.error} label="Event name*" my={margins}>
          <Input
            isInvalid={!!formData.eventName.error}
            maxLength={500}
            placeholder="Vandelay Industries Networking Event"
            sx={{
              '::placeholder': {
                color: 'gray.400', // Placeholder text color
              },
            }}
            type="text"
            value={formData.eventName.value}
            onChange={(e) => {
              setFormData({ ...formData, eventName: { value: e.target.value } });
            }}
          />
        </FormControlComponent>
        <FormControlComponent
          errorText={formData.eventDescription.error}
          label="Event description*"
          my={margins}
        >
          <Input
            isInvalid={!!formData.eventDescription.error}
            maxLength={500}
            placeholder="Meet with the best latex salesmen in the industry."
            sx={{
              '::placeholder': {
                color: 'gray.400', // Placeholder text color
              },
            }}
            type="text"
            value={formData.eventDescription.value}
            onChange={(e) => {
              setFormData({ ...formData, eventDescription: { value: e.target.value } });
            }}
          />
        </FormControlComponent>
        <FormControlComponent
          errorText={formData.eventLocation.error}
          label="Event location*"
          my={margins}
        >
          <Input
            isInvalid={!!formData.eventLocation.error}
            maxLength={500}
            placeholder="129 West 81st Street, Apartment 5A"
            sx={{
              '::placeholder': {
                color: 'gray.400', // Placeholder text color
              },
            }}
            type="text"
            value={formData.eventLocation.value}
            onChange={(e) => {
              setFormData({ ...formData, eventLocation: { value: e.target.value } });
            }}
          />
        </FormControlComponent>
        <Show above="md">
          <CustomDateRangePicker
            ctaComponent={datePickerCTA}
            endDate={formData.date.value.endDate}
            isDatePickerOpen={isDatePickerOpen}
            maxDate={null}
            minDate={new Date()}
            setIsDatePickerOpen={setIsDatePickerOpen}
            startDate={formData.date.value.startDate}
            onDateChange={(startDate, endDate) => {
              setFormData({
                ...formData,
                date: { value: { ...formData.date, startDate, endDate } },
              });
            }}
            onTimeChange={(startTime, endTime) => {
              setFormData({
                ...formData,
                date: { value: { ...formData.date.value, startTime, endTime } },
              });
            }}
          />
        </Show>
        <Hide above="md">
          <CustomDateRangePickerMobile
            ctaComponent={datePickerCTA}
            endDate={formData.date.value.endDate}
            isDatePickerOpen={isDatePickerOpen}
            maxDate={null}
            minDate={new Date()}
            openDirection="top-right"
            setIsDatePickerOpen={setIsDatePickerOpen}
            startDate={formData.date.value.startDate}
            onDateChange={(startDate, endDate) => {
              setFormData({
                ...formData,
                date: { value: { ...formData.date.value, startDate, endDate } },
              });
            }}
            onTimeChange={(startTime, endTime) => {
              setFormData({
                ...formData,
                date: { value: { ...formData.date.value, startTime, endTime } },
              });
            }}
          />
        </Hide>
        <FormControlComponent
          helperText="Customize your event page"
          label="Event artwork"
          my={margins}
        >
          <ImageFileInput
            accept="image/jpeg, image/png, image/gif"
            errorMessage={formData.eventArtwork.error}
            isInvalid={!!formData.eventArtwork.error}
            preview={preview}
            selectedFile={formData.eventArtwork.value}
            onChange={(e) => {
              onSelectFile(e);
            }}
          />
        </FormControlComponent>
      </VStack>
      <Hide below="md">
        <VStack align="start" paddingTop={5} w="100%">
          <Box maxW="lg" w="100%">
            <EventPagePreview
              eventArtwork={preview}
              eventDate={datePreviewText}
              eventDescription={formData.eventDescription.value}
              eventLocation={formData.eventLocation.value}
              eventName={formData.eventName.value}
            />
          </Box>
        </VStack>
      </Hide>
    </HStack>
  );
};

export { EventInfoForm };
