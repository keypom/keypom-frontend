import {
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';

import { FormControl } from '@/components/FormControl';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketIndex: number;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CreateTicketModal = ({
  isOpen,
  onClose,
  onCancel,
  ticketIndex,
}: CreateTicketModalProps) => {
  const { control } = useFormContext();

  return (
    <Modal closeOnEsc={false} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="14" pb="8">
        <ModalHeader>
          <Heading size="sm">Add a new ticket type</Heading>
        </ModalHeader>
        <ModalBody>
          <Controller
            control={control}
            name={`tickets.${ticketIndex}.name`}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl errorText={error?.message} label="Ticket name">
                  <Input
                    isInvalid={Boolean(error?.message)}
                    placeholder="Early bird admission"
                    type="text"
                    {...field}
                  />
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name={`tickets.${ticketIndex}.numberOfTickets`}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl
                  errorText={error?.message}
                  helperText="Leave empty if the party can host infinite number of guests"
                  label="Number of tickets"
                >
                  <Input
                    isInvalid={Boolean(error?.message)}
                    placeholder="3000"
                    type="number"
                    {...field}
                  />
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name={`tickets.${ticketIndex}.description`}
            render={({ field }) => {
              return (
                <FormControl
                  errorText=""
                  helperText="Let attendees know what this ticket has to offer "
                  label="Description"
                >
                  <Textarea
                    // isInvalid={Boolean(error?.message)}
                    placeholder="Get exclusive plushie when you buy an early bird ticket"
                    {...field}
                  />
                </FormControl>
              );
            }}
          />
          <Controller
            control={control}
            name={`tickets.${ticketIndex}.saleStartDate`}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl
                  errorText={error?.message}
                  isInvalid={Boolean(error?.message)}
                  label="Sales start date"
                >
                  <Input placeholder={new Date().toString()} type="datetime-local" {...field} />
                </FormControl>
              );
            }}
          />

          <Controller
            control={control}
            name={`tickets.${ticketIndex}.saleEndDate`}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormControl
                  errorText={error?.message}
                  isInvalid={Boolean(error?.message)}
                  label="Sales end date"
                >
                  <Input placeholder={new Date().toString()} type="datetime-local" {...field} />
                </FormControl>
              );
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button mr={3} variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={onClose}>Add</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
