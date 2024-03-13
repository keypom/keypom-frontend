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
import { useEffect, useState } from 'react';

import { FormControlComponent } from '@/components/FormControl';
import CustomDateRangePicker from '@/components/DateRangePicker/DateRangePicker';
import CustomDateRangePickerMobile from '@/components/DateRangePicker/MobileDateRangePicker';
import { ImageFileInput } from '@/components/ImageFileInput';

import { type EventDate } from '../../routes/CreateTicketDropPage';

import { type TicketInfoFormMetadata } from './CreateTicketsForm';
import TicketPriceSelector from './TicketPriceSelector';

import { eventDateToPlaceholder } from '.';

interface ModifyTicketModalProps {
  isOpen: boolean;
  onClose: (shouldAdd: boolean, editedTicket?: TicketInfoFormMetadata) => void;
  currentTicket: TicketInfoFormMetadata;
  setCurrentTicket: (ticket: TicketInfoFormMetadata) => void;
  editedTicket?: TicketInfoFormMetadata;
}

const defaultErrors = {
  name: '',
  description: '',
  salesValidThrough: '',
  passValidThrough: '',
  maxSupply: '',
  price: '',
  artwork: '',
};

export const ModifyTicketModal = ({
  isOpen,
  onClose,
  currentTicket,
  setCurrentTicket,
  editedTicket,
}: ModifyTicketModalProps) => {
  const [errors, setErrors] = useState(defaultErrors);

  const [isSalesValidModalOpen, setIsSalesValidModalOpen] = useState(false);
  const [isPassValidModalOpen, setIsPassValidModalOpen] = useState(false);
  const [preview, setPreview] = useState<string>();

  const validateForm = () => {
    console.log('currentTicket', currentTicket);
    let isErr = false;
    // Create a new object with the properties of defaultErrors to ensure a new reference
    const newErrors = { ...defaultErrors };
    if (!currentTicket.name) {
      newErrors.name = 'Name is required';
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

    if (currentTicket.maxSupply < 1) {
      newErrors.maxSupply = 'Max supply is required';
      isErr = true;
    }

    if (!parseInt(currentTicket.price)) {
      newErrors.price = 'Price is required';
      isErr = true;
    }

    if (!currentTicket.artwork) {
      newErrors.artwork = 'Artwork is required';
      isErr = true;
    }

    // Now newErrors is a new object, so setting it should trigger a re-render
    setErrors(newErrors);
    console.log('errors', newErrors, isErr, currentTicket);

    if (!isErr) {
      onClose(true, editedTicket);
    }
  };

  const datePickerCTA = (label: string, errorField: string, dateObject: EventDate, onClick) => (
    <FormControlComponent errorText={errorField} label={label}>
      <Input
        readOnly
        isInvalid={!!errorField}
        placeholder={eventDateToPlaceholder('Event date', dateObject)}
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
    const objectUrl = URL.createObjectURL(selectedFile[0]);
    setPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [currentTicket.artwork]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setCurrentTicket({ ...currentTicket, artwork: undefined });
      return;
    }

    setCurrentTicket({ ...currentTicket, artwork: e.target.files });
  };

  return (
    <Modal
      isOpen={isOpen}
      size="xl"
      transform="scale(0.85)"
      transformOrigin="center"
      onClose={() => {
        onClose(false, editedTicket);
      }}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH="90vh" overflowY="auto" padding={6} paddingY={1}>
        <VStack align="left" spacing={2} textAlign="left">
          <FormControlComponent errorText={errors.name} label="Ticket name*">
            <Input
              isInvalid={!!errors.name}
              placeholder="Red Wedding VIP Ticket"
              sx={{
                '::placeholder': {
                  color: 'gray.400', // Placeholder text color
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
          <FormControlComponent errorText={errors.description} label="Description*">
            <Textarea
              height="100px"
              isInvalid={!!errors.description}
              placeholder="129 West 81st Street, Apartment 5A"
              sx={{
                '::placeholder': {
                  textAlign: 'top',
                  color: 'gray.400', // Placeholder text color
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
              endTime={currentTicket.salesValidThrough.endTime}
              isDatePickerOpen={isSalesValidModalOpen}
              openDirection="top"
              setIsDatePickerOpen={setIsSalesValidModalOpen}
              startDate={currentTicket.salesValidThrough.startDate}
              startTime={currentTicket.salesValidThrough.startTime}
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
              endTime={currentTicket.salesValidThrough.endTime}
              isDatePickerOpen={isSalesValidModalOpen}
              setIsDatePickerOpen={setIsSalesValidModalOpen}
              startDate={currentTicket.salesValidThrough.startDate}
              startTime={currentTicket.salesValidThrough.startTime}
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
              endTime={currentTicket.passValidThrough.endTime}
              isDatePickerOpen={isPassValidModalOpen}
              setIsDatePickerOpen={setIsPassValidModalOpen}
              startDate={currentTicket.passValidThrough.startDate}
              startTime={currentTicket.passValidThrough.startTime}
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
              endTime={currentTicket.passValidThrough.endTime}
              isDatePickerOpen={isPassValidModalOpen}
              setIsDatePickerOpen={setIsPassValidModalOpen}
              startDate={currentTicket.passValidThrough.startDate}
              startTime={currentTicket.passValidThrough.startTime}
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
            label="Number of tickets*"
          >
            <Input
              isInvalid={!!errors.maxSupply}
              placeholder="Number of tickets"
              sx={{
                '::placeholder': {
                  color: 'gray.400', // Placeholder text color
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
            setCurrentTicket={setCurrentTicket}
          />
          <FormControlComponent label="Ticket artwork*">
            <ImageFileInput
              accept=" image/jpeg, image/png, image/gif"
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
