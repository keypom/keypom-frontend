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
        <ModalCloseButton />
        <Text textAlign="left" color="black">
          Ticket Name
        </Text>
        <Text textAlign="left">{event.name}</Text>
        <Text textAlign="left" mt="4" color="black">
          Description
        </Text>
        <Text textAlign="left">{event.description}</Text>
        <Text textAlign="left" mt="4" color="black">
          Date
        </Text>
        <Text textAlign="left">{event.date}</Text>
        <Text textAlign="left" mt="4" color="black">
          Location
        </Text>
        <Text textAlign="left">{event.location}</Text>

        <Form>
          {event.tickets > 1 ? (
            <>
              <Text textAlign="left" mt="4" color="black">
                Ticket Amount
              </Text>
              <NumberInput
                mt="2"
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
            <Text textAlign="left" mt="4" color="black">
              Email
            </Text>
            <Input mt="2" type="email" value={email} onChange={handleInputChange} />
            {!isError ? (
              <FormHelperText>
                No account will be created, ensure your email is correct
              </FormHelperText>
            ) : (
              <FormErrorMessage> Email is required. </FormErrorMessage>
            )}
          </FormControl>

          <Button w="100%" mt="4" isDisabled={isError} colorScheme="green" onClick={onSubmit}>
            Proceed to checkout
          </Button>
        </Form>
        <ModalFooter>
          <Button w="100%" variant={'secondary'} onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
