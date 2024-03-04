import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Image,
  Input,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Form } from 'react-router-dom';

interface PurchaseModalProps {
  input: string;
  setInput: (input: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  event: any;
}

export const SellModal = ({
  input,
  setInput,
  isOpen,
  onClose,
  onSubmit,
  event,
}: PurchaseModalProps) => {
  // price input
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const isError = input === '';
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

        <Form action="/" onSubmit={onSubmit}>
          <FormControl isInvalid={isError}>
            <FormLabel>Price in NEAR</FormLabel>
            <Input type="number" value={input} onChange={handleInputChange} />
            {!isError ? (
              <FormHelperText>
                This ticket will be listed on the secondary market for {input} NEAR
              </FormHelperText>
            ) : (
              <FormErrorMessage> Must be a valid number </FormErrorMessage>
            )}
          </FormControl>

          <Box my="5"></Box>
          <Button w="100%" type="submit">
            Put Ticket For Sale
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
