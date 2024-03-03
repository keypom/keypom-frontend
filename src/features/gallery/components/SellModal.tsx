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
        <Image src={event.img} alt={event.title} />
        <ModalHeader> Sell Modal </ModalHeader>
        <Text color="gray" textAlign={'left'}>
          Event on {event.date}
        </Text>
        <Text color="gray" textAlign={'left'}>
          Event in {event.location}
        </Text>
        <Text my="2" textAlign={'left'}>
          {event.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit anim id est laborum.
        </Text>

        <ModalCloseButton />
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
          <HStack justifyContent="space-between">
            <Button type="submit">List Ticket</Button>
            <Button variant={'secondary'} onClick={onClose}>
              Close
            </Button>
          </HStack>
        </Form>
      </ModalContent>
    </Modal>
  );
};
