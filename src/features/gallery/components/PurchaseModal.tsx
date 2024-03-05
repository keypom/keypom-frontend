import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';

import { TicketIncrementer } from './TicketIncrementer';

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: any;
  onSubmit: () => void;
  setEmail: (email: string) => void;
  email: string;
  setTicketAmount: (ticketAmount: number) => void;
  amount: number;
  decrementAmount: () => void;
  incrementAmount: () => void;
}

export const PurchaseModal = ({
  isOpen,
  onClose,
  event,
  onSubmit,
  setEmail,
  email,
  decrementAmount,
  incrementAmount,
  amount,
}: PurchaseModalProps) => {
  // email input
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };
  const isError = email === '';
  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
      <ModalOverlay />
      <ModalContent p="8">
        <ModalCloseButton />
        <Text as="h2" color="black.800" fontSize="xl" fontWeight="medium" mt="8px" textAlign="left">
          Ticket Name
        </Text>
        <Text textAlign="left">{event.name}</Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" mt="8px" textAlign="left">
          Description
        </Text>
        <Text textAlign="left">{event.description}</Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" mt="8px" textAlign="left">
          Date
        </Text>
        <Text textAlign="left">{event.date}</Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" mt="8px" textAlign="left">
          Location
        </Text>
        <Text textAlign="left">{event.location}</Text>

        <Form>
          {event.tickets > 1 ? (
            <TicketIncrementer
              amount={amount}
              decrementAmount={decrementAmount}
              incrementAmount={incrementAmount}
            />
          ) : (
            <> </>
          )}
          <FormControl isInvalid={isError}>
            <Text color="black" mt="4" textAlign="left">
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

          <Button colorScheme="green" isDisabled={isError} mt="4" w="100%" onClick={onSubmit}>
            Proceed to checkout
          </Button>
        </Form>
        <ModalFooter>
          <Button variant={'secondary'} w="100%" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
