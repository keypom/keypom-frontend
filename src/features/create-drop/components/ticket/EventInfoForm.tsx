import { Input, HStack, VStack, Show, Hide } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import CustomDateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import { ImageFileInput } from '@/components/ImageFileInput';
import CustomDateRangePickerMobile from '@/components/DateRangePicker/MobileDateRangePicker';
import { FormControlComponent } from '@/components/FormControl';

import { type EventStepFormProps } from '../../routes/CreateTicketDropPage';

import EventPagePreview from './EventPagePreview';

const EventInfoForm = (props: EventStepFormProps) => {
  const { formData, setFormData } = props;

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePlaceholer, setDatePlaceholder] = useState('Select date and time');
  const [datePreviewText, setDatePreviewText] = useState<string>('');

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState<string>();

  useEffect(() => {
    if (selectedFile === undefined) {
      setPreview(undefined);
      setFormData({ ...formData, eventArtwork: { value: '' } });
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile[0]);
    setPreview(objectUrl);
    setFormData({ ...formData, eventArtwork: { value: objectUrl } });

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile, name]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files);
  };

  useEffect(() => {
    let datePlaceholder = 'Select date and time';
    let datePreviewText = '';
    if (formData.date.value.startDate) {
      const start = new Date(formData.date.value.startDate);
      datePlaceholder = start.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZoneName: 'short',
      });
      datePreviewText = start.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZoneName: 'short',
      });
      if (formData.date.value.startTime) {
        datePlaceholder += ` (${formData.date.value.startTime})`;
        datePreviewText += ` (${formData.date.value.startTime})`;
      }
    }

    if (formData.date.value.endDate) {
      const end = new Date(formData.date.value.endDate);
      datePlaceholder += ` - ${end.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZoneName: 'short',
      })}`;
      datePreviewText += ` - ${end.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZoneName: 'short',
      })}`;

      if (formData.date.value.endTime) {
        datePlaceholder += ` (${formData.date.value.endTime})`;
        datePreviewText += ` (${formData.date.value.endTime})`;
      }
    }

    setDatePlaceholder(datePlaceholder);
    setDatePreviewText(datePreviewText);
  }, [formData.date]);

  const datePickerCTA = (
    <FormControlComponent errorText={formData.date.error} label="Date*">
      <Input
        readOnly
        isInvalid={!!formData.date.error}
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
        onClick={() => {
          setIsDatePickerOpen(true);
        }}
      />
    </FormControlComponent>
  );

  return (
    <HStack align="top" justifyContent="space-between">
      <VStack spacing="4" w="100%">
        <FormControlComponent errorText={formData.eventName.error} label="Event name*">
          <Input
            isInvalid={!!formData.eventName.error}
            placeholder="Vandelay Industries Networking Event"
            sx={{
              '::placeholder': {
                color: 'gray.400', // Placeholder text color
              },
            }}
            type="text"
            onChange={(e) => {
              setFormData({ ...formData, eventName: { value: e.target.value } });
            }}
          />
        </FormControlComponent>
        <FormControlComponent
          errorText={formData.eventDescription.error}
          label="Event description*"
        >
          <Input
            isInvalid={!!formData.eventDescription.error}
            placeholder="Meet with the best latex salesmen in the industry."
            sx={{
              '::placeholder': {
                color: 'gray.400', // Placeholder text color
              },
            }}
            type="text"
            onChange={(e) => {
              setFormData({ ...formData, eventDescription: { value: e.target.value } });
            }}
          />
        </FormControlComponent>
        <FormControlComponent errorText={formData.eventLocation.error} label="Event location*">
          <Input
            isInvalid={!!formData.eventLocation.error}
            placeholder="129 West 81st Street, Apartment 5A"
            sx={{
              '::placeholder': {
                color: 'gray.400', // Placeholder text color
              },
            }}
            type="text"
            onChange={(e) => {
              setFormData({ ...formData, eventLocation: { value: e.target.value } });
            }}
          />
        </FormControlComponent>
        <Show above="md">
          <CustomDateRangePicker
            ctaComponent={datePickerCTA}
            endDate={formData.date.value.endDate}
            endTime={formData.date.value.endTime}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
            startDate={formData.date.value.startDate}
            startTime={formData.date.value.startTime}
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
            endTime={formData.date.value.endTime}
            isDatePickerOpen={isDatePickerOpen}
            setIsDatePickerOpen={setIsDatePickerOpen}
            startDate={formData.date.value.startDate}
            startTime={formData.date.value.startTime}
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
        <FormControlComponent helperText="Customize your event page" label="Event artwork">
          <ImageFileInput
            accept=" image/jpeg, image/png, image/gif"
            errorMessage={formData.eventArtwork.error}
            isInvalid={!!formData.eventArtwork.error}
            preview={preview}
            selectedFile={selectedFile}
            onChange={(e) => {
              onSelectFile(e);
            }}
          />
        </FormControlComponent>
      </VStack>
      <Hide below="md">
        <VStack align="start" paddingTop={5} w="100%">
          <EventPagePreview
            eventArtwork={formData.eventArtwork.value}
            eventDate={datePreviewText}
            eventDescription={formData.eventDescription.value}
            eventLocation={formData.eventLocation.value}
            eventName={formData.eventName.value}
          />
        </VStack>
      </Hide>
    </HStack>
  );
};

export { EventInfoForm };
