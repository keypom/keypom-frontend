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
import { useState } from 'react';

import { FormControl } from '@/components/FormControl';

export const CreateTicketModal = ({ isOpen, onClose }) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([new Date(), new Date()]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="14" pb="8">
        <ModalHeader>
          <Heading size="sm">Add a new ticket type</Heading>
        </ModalHeader>
        <ModalBody>
          <FormControl errorText="" label="Ticket name">
            <Input
              // isInvalid={Boolean(error?.message)}
              placeholder="Early bird admission"
              type="text"
              onChange={() => {}}
            />
          </FormControl>
          <FormControl
            errorText=""
            helperText="Leave empty if the party can host infinite number of guests"
            label="Description"
          >
            <Input
              // isInvalid={Boolean(error?.message)}
              placeholder="3000"
              type="number"
              onChange={() => {}}
            />
          </FormControl>
          <FormControl
            errorText=""
            helperText="Let attendees know what this ticket has to offer "
            label="Description"
          >
            <Textarea
              // isInvalid={Boolean(error?.message)}
              placeholder="Get exclusive plushie when you buy an early bird ticket"
              onChange={() => {}}
            />
          </FormControl>
          <FormControl errorText="" label="Sales start date">
            <Input placeholder={new Date().toString()} type="datetime-local" />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button mr={3} variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button>Add</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
