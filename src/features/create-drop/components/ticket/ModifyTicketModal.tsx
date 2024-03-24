import {
  Button,
  Hide,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
  Show,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { DateTime } from 'luxon';

import { FormControlComponent } from '@/components/FormControl';
import CustomDateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import CustomDateRangePickerMobile from '@/components/DateRangePicker/MobileDateRangePicker';
import { ImageFileInput } from '@/components/ImageFileInput';

import { type TicketDropFormData, type EventDate } from '../../routes/CreateTicketDropPage';

import { type TicketInfoFormMetadata } from './CreateTicketsForm';
import TicketPriceSelector from './TicketPriceSelector';
import { eventDateToPlaceholder } from './EventInfoForm';

const defaultErrors = {
  name: '',
  description: '',
  salesValidThrough: '',
  passValidThrough: '',
  maxSupply: '',
  price: '',
  artwork: '',
};

export const isValidNonNegativeNumber = (value) => {
  return /^\d*\.?\d+$/.test(value);
};

interface ModifyTicketModalProps {
  isOpen: boolean;
  onClose: (shouldAdd: boolean, editedTicket?: TicketInfoFormMetadata) => void;
  eventDate: EventDate;
  formData: TicketDropFormData;
  allTickets: TicketInfoFormMetadata[];
  currentTicket: TicketInfoFormMetadata;
  setCurrentTicket: (ticket: TicketInfoFormMetadata) => void;
  editedTicket?: TicketInfoFormMetadata;
}

// Function to parse a time string and return a Luxon DateTime object
const parseTime = (timeString) => {
  // Assuming your time string format is "HH:mm" (e.g., "14:00" for 2:00 PM)
  // Adjust the format as necessary to match your input format
  return DateTime.fromFormat(timeString, 'H:mm');
};

export const ModifyTicketModal = ({
  isOpen,
  onClose,
  formData,
  eventDate,
  allTickets,
  currentTicket,
  setCurrentTicket,
  editedTicket,
}: ModifyTicketModalProps) => {
  const [errors, setErrors] = useState(defaultErrors);

  const [isSalesValidModalOpen, setIsSalesValidModalOpen] = useState(false);
  const [isPassValidModalOpen, setIsPassValidModalOpen] = useState(false);
  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const validateForm = () => {
    let isErr = false;
    // Create a new object with the properties of defaultErrors to ensure a new reference
    const newErrors = { ...defaultErrors };
    if (!currentTicket.name) {
      newErrors.name = 'Name is required';
      isErr = true;
    }

    if (!editedTicket && allTickets.some((ticket) => ticket.name === currentTicket.name)) {
      newErrors.name = 'Name must be unique';
      isErr = true;
    }

    if (!currentTicket.description) {
      newErrors.description = 'Description is required';
      isErr = true;
    }

    if (!currentTicket.salesValidThrough.startDate) {
      newErrors.salesValidThrough = 'Sales valid through is required';
      isErr = true;
    }

    if (!currentTicket.passValidThrough.startDate) {
      newErrors.passValidThrough = 'Pass valid through is required';
      isErr = true;
    }

    if (currentTicket.salesValidThrough.endTime && currentTicket.salesValidThrough.startTime) {
      const startTime = parseTime(currentTicket.salesValidThrough.startTime);
      const endTime = parseTime(currentTicket.salesValidThrough.endTime);

      if (endTime <= startTime) {
        newErrors.salesValidThrough = 'End time must be greater than start time';
        isErr = true;
      }
    }

    if (currentTicket.passValidThrough.endTime && currentTicket.passValidThrough.startTime) {
      const startTime = parseTime(currentTicket.passValidThrough.startTime);
      const endTime = parseTime(currentTicket.passValidThrough.endTime);

      // Use Luxon's isAfter method to compare times
      if (endTime <= startTime) {
        newErrors.passValidThrough = 'End time must be greater than start time';
        isErr = true;
      }
    }

    if (currentTicket.maxSupply < 1) {
      newErrors.maxSupply = 'Max supply is required';
      isErr = true;
    }

    if (!isValidNonNegativeNumber(currentTicket.priceNear)) {
      newErrors.price = 'Price is required';
      isErr = true;
    }

    if (!currentTicket.artwork) {
      newErrors.artwork = 'Artwork is required';
      isErr = true;
    }

    // Now newErrors is a new object, so setting it should trigger a re-render
    setErrors(newErrors);
    // eslint-disable-next-line no-console
    console.log('errors', newErrors, isErr, currentTicket);

    if (!isErr) {
      onClose(true, editedTicket);
    }
  };

  const margins = '2';

  const datePickerCTA = (label: string, errorField: string, dateObject: EventDate, onClick) => (
    <FormControlComponent
      errorText={errorField}
      label={label}
      labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
      marginY={margins}
    >
      <Input
        readOnly
        borderRadius="5xl"
        isInvalid={!!errorField}
        maxLength={500}
        placeholder={eventDateToPlaceholder('Event date', dateObject)}
        size="sm"
        style={{ cursor: 'pointer' }}
        sx={{
          '::placeholder': {
            color: 'gray.400', // Placeholder text color
            fontSize: { base: 'xs', md: 'sm' },
          },
          _invalid: {
            borderColor: 'red.300',
            boxShadow: '0 0 0 1px #EF4444 !important',
          },
        }}
        type="text"
        onClick={onClick}
      />
    </FormControlComponent>
  );

  useEffect(() => {
    if (isSalesValidModalOpen) {
      setIsPassValidModalOpen(false);
    }
    if (isPassValidModalOpen) {
      setIsSalesValidModalOpen(false);
    }
  }, [isSalesValidModalOpen, isPassValidModalOpen]);

  useEffect(() => {
    if (currentTicket.salesValidThrough.startDate) {
      setErrors({ ...errors, salesValidThrough: '' });
    }
  }, [currentTicket.salesValidThrough]);

  useEffect(() => {
    if (currentTicket.passValidThrough.startDate) {
      setErrors({ ...errors, passValidThrough: '' });
    }
  }, [currentTicket.passValidThrough]);

  useEffect(() => {
    const selectedFile = currentTicket.artwork;
    if (selectedFile === undefined) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [currentTicket.artwork]);

  useEffect(() => {
    // Reset errors when the modal is closed (i.e., isOpen changes from true to false)
    if (!isOpen) {
      setErrors(defaultErrors);
    }
  }, [isOpen]);

  useEffect(() => {
    const inputEl = inputRef.current;
    const preventScroll = (e: WheelEvent) => {
      e.preventDefault();
    };

    if (inputEl) {
      // Attach the event listener without specifying the passive option
      inputEl.addEventListener('wheel', preventScroll);
    }

    return () => {
      if (inputEl) {
        // Clean up the event listener
        inputEl.removeEventListener('wheel', preventScroll);
      }
    };
  }, []);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setCurrentTicket({ ...currentTicket, artwork: undefined });
      return;
    }

    setCurrentTicket({ ...currentTicket, artwork: e.target.files[0] });
  };

  return (
    <Modal
      isOpen={isOpen}
      size="3xl"
      onClose={() => {
        onClose(false, editedTicket);
      }}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH="90vh" overflowY="auto" padding={6} paddingY={3}>
        <VStack align="left" spacing={0} textAlign="left">
          <FormControlComponent
            errorText={errors.name}
            label="Ticket name*"
            labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
            marginY={margins}
          >
            <Input
              borderRadius="5xl"
              height="35px"
              isInvalid={!!errors.name}
              maxLength={500}
              placeholder="Red Wedding VIP Ticket"
              size="sm"
              sx={{
                '::placeholder': {
                  color: 'gray.400', // Placeholder text color
                  fontSize: { base: 'xs', md: 'sm' },
                },
              }}
              type="text"
              value={currentTicket.name}
              onChange={(e) => {
                setErrors({ ...errors, name: '' });
                setCurrentTicket({ ...currentTicket, name: e.target.value });
              }}
            />
          </FormControlComponent>
          <FormControlComponent
            errorText={errors.description}
            label="Description*"
            labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
            marginY={margins}
          >
            <Textarea
              borderRadius="5xl"
              height="80px"
              isInvalid={!!errors.description}
              maxLength={500}
              placeholder="This ticket includes a complimentary drink and an exclusive 1:1 conversation with Edmure Tully and Roslin Frey."
              size="sm"
              sx={{
                '::placeholder': {
                  textAlign: 'top',
                  color: 'gray.400', // Placeholder text color
                  fontSize: { base: 'xs', md: 'sm' },
                },
              }}
              value={currentTicket.description}
              onChange={(e) => {
                setErrors({ ...errors, description: '' });
                setCurrentTicket({ ...currentTicket, description: e.target.value });
              }}
            />
          </FormControlComponent>
          <Show above="md">
            <CustomDateRangePicker
              ctaComponent={datePickerCTA(
                'Ticket sales valid through*',
                errors.salesValidThrough,
                currentTicket.salesValidThrough,
                () => {
                  setIsSalesValidModalOpen(true);
                },
              )}
              endDate={currentTicket.salesValidThrough.endDate}
              isDatePickerOpen={isSalesValidModalOpen}
              maxDate={eventDate.endDate || eventDate.startDate}
              minDate={new Date()}
              scale="0.85"
              setIsDatePickerOpen={setIsSalesValidModalOpen}
              startDate={currentTicket.salesValidThrough.startDate}
              onDateChange={(startDate, endDate) => {
                setCurrentTicket({
                  ...currentTicket,
                  salesValidThrough: { ...currentTicket.salesValidThrough, startDate, endDate },
                });
              }}
              onTimeChange={(startTime, endTime) => {
                setCurrentTicket({
                  ...currentTicket,
                  salesValidThrough: { ...currentTicket.salesValidThrough, startTime, endTime },
                });
              }}
            />
          </Show>
          <Hide above="md">
            <CustomDateRangePickerMobile
              ctaComponent={datePickerCTA(
                'Ticket sales valid through*',
                errors.salesValidThrough,
                currentTicket.salesValidThrough,
                () => {
                  setIsSalesValidModalOpen(true);
                },
              )}
              endDate={currentTicket.salesValidThrough.endDate}
              isDatePickerOpen={isSalesValidModalOpen}
              maxDate={eventDate.endDate || eventDate.startDate}
              minDate={new Date()}
              scale="0.85"
              setIsDatePickerOpen={setIsSalesValidModalOpen}
              startDate={currentTicket.salesValidThrough.startDate}
              onDateChange={(startDate, endDate) => {
                setCurrentTicket({
                  ...currentTicket,
                  salesValidThrough: { ...currentTicket.salesValidThrough, startDate, endDate },
                });
              }}
              onTimeChange={(startTime, endTime) => {
                setCurrentTicket({
                  ...currentTicket,
                  salesValidThrough: { ...currentTicket.salesValidThrough, startTime, endTime },
                });
              }}
            />
          </Hide>
          <Show above="md">
            <CustomDateRangePicker
              ctaComponent={datePickerCTA(
                'Grants event entry through*',
                errors.passValidThrough,
                currentTicket.passValidThrough,
                () => {
                  setIsPassValidModalOpen(true);
                },
              )}
              endDate={currentTicket.passValidThrough.endDate}
              isDatePickerOpen={isPassValidModalOpen}
              maxDate={eventDate.endDate || eventDate.startDate}
              minDate={eventDate.startDate}
              scale="0.85"
              setIsDatePickerOpen={setIsPassValidModalOpen}
              startDate={currentTicket.passValidThrough.startDate}
              onDateChange={(startDate, endDate) => {
                setCurrentTicket({
                  ...currentTicket,
                  passValidThrough: { ...currentTicket.passValidThrough, startDate, endDate },
                });
              }}
              onTimeChange={(startTime, endTime) => {
                setCurrentTicket({
                  ...currentTicket,
                  passValidThrough: { ...currentTicket.passValidThrough, startTime, endTime },
                });
              }}
            />
          </Show>
          <Hide above="md">
            <CustomDateRangePickerMobile
              ctaComponent={datePickerCTA(
                'Grants event entry through*',
                errors.passValidThrough,
                currentTicket.passValidThrough,
                () => {
                  setIsPassValidModalOpen(true);
                },
              )}
              endDate={currentTicket.passValidThrough.endDate}
              isDatePickerOpen={isPassValidModalOpen}
              maxDate={eventDate.endDate || eventDate.startDate}
              minDate={eventDate.startDate}
              scale="0.85"
              setIsDatePickerOpen={setIsPassValidModalOpen}
              startDate={currentTicket.passValidThrough.startDate}
              onDateChange={(startDate, endDate) => {
                setCurrentTicket({
                  ...currentTicket,
                  passValidThrough: { ...currentTicket.passValidThrough, startDate, endDate },
                });
              }}
              onTimeChange={(startTime, endTime) => {
                setCurrentTicket({
                  ...currentTicket,
                  passValidThrough: { ...currentTicket.passValidThrough, startTime, endTime },
                });
              }}
            />
          </Hide>
          <FormControlComponent
            errorText={errors.maxSupply}
            helperText="The maximum number of guests that can purchase this ticket type"
            helperTextProps={{ fontSize: { base: '2xs', md: 'xs' }, marginY: '-1' }}
            label="Number of tickets*"
            labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
            marginY={margins}
          >
            <Input
              ref={inputRef}
              borderRadius="5xl"
              isInvalid={!!errors.maxSupply}
              marginY="0"
              maxLength={500}
              placeholder="Number of tickets"
              size="sm"
              sx={{
                '::placeholder': {
                  color: 'gray.400', // Placeholder text color
                  fontSize: { base: 'xs', md: 'sm' },
                },
              }}
              type="number"
              value={currentTicket.maxSupply || ''}
              onChange={(e) => {
                let val = e.target.value;
                if (parseInt(e.target.value) < 0) {
                  val = '0';
                }

                setErrors({ ...errors, maxSupply: '' });
                setCurrentTicket({ ...currentTicket, maxSupply: parseInt(val) });
              }}
            />
          </FormControlComponent>
          <TicketPriceSelector
            currentTicket={currentTicket}
            errors={errors}
            formData={formData}
            setCurrentTicket={setCurrentTicket}
          />
          <FormControlComponent
            label="Ticket artwork*"
            labelProps={{ fontSize: { base: 'xs', md: 'md' } }}
            marginY={margins}
          >
            <ImageFileInput
              accept=" image/jpeg, image/png, image/gif"
              ctaText="Upload artwork"
              errorMessage={errors.artwork}
              isInvalid={!!errors.artwork}
              preview={preview}
              selectedFile={currentTicket.artwork}
              onChange={(e) => {
                onSelectFile(e);
              }}
            />
          </FormControlComponent>
          <VStack align="left" spacing={3} textAlign="left">
            <Button
              autoFocus={false}
              isDisabled={isSalesValidModalOpen || isPassValidModalOpen}
              variant="primary"
              width="full"
              onClick={() => {
                validateForm();
              }}
            >
              {currentTicket ? 'Finish' : 'Create'}
            </Button>
            <Button
              autoFocus={false}
              isDisabled={isSalesValidModalOpen || isPassValidModalOpen}
              variant="secondary"
              width="full"
              onClick={() => {
                onClose(false, editedTicket);
              }}
            >
              Cancel
            </Button>
          </VStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
