import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Form } from 'react-router-dom';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSubmit: () => void;
  setEmail: (email: string) => void;
  email: string;
  setTicketAmount: (ticketAmount: number) => void;
  ticketAmount: number;
}

export const PurchaseModal = ({
  isOpen,
  onClose,
  event,
  onSubmit,
  setEmail,
  email,
  setTicketAmount,
  ticketAmount,
}: PurchaseModalProps) => {
  // email input
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };
  const isError = email === '';
  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Purchase Modal </ModalHeader>
        <Text>Event on {event.date}</Text>
        <Text>Event in {event.location}</Text>
        <ModalCloseButton />
        <Form action="/" method="post">
          {event.tickets > 1 ? (
            <>
              <ModalBody>Select number of tickets</ModalBody>
              <FormLabel>Ticket Amount</FormLabel>
              <NumberInput
                max={event.tickets}
                min={1}
                value={ticketAmount}
                onChange={(valueString, valueNumber) => setTicketAmount(valueNumber)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </>
          ) : (
            <> </>
          )}
          <FormControl isInvalid={isError}>
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={handleInputChange} />
            {!isError ? (
              <FormHelperText>
                No account will be created, ensure your email is correct
              </FormHelperText>
            ) : (
              <FormErrorMessage> Email is required. </FormErrorMessage>
            )}
          </FormControl>

          <Button colorScheme="green" onClick={onSubmit}>
            Proceed to checkout
          </Button>
        </Form>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
