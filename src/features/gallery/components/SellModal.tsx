import {
  Box,
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

interface SellModalProps {
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
}: SellModalProps) => {
  // price input
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };
  const isError = input === '';
  return (
    <Modal isCentered closeOnOverlayClick={false} isOpen={isOpen} size={'xl'} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent p="8">
        <ModalCloseButton />
        <Text as="h2" color="black.800" fontSize="xl" fontWeight="medium" my="4px" textAlign="left">
          {event.name}
        </Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" my="4px" textAlign="left">
          Description
        </Text>
        <Text textAlign="left">{event.description}</Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" my="4px" textAlign="left">
          Date
        </Text>
        <Text textAlign="left">{event.date}</Text>
        <Text as="h2" color="black.800" fontSize="l" fontWeight="medium" my="4px" textAlign="left">
          Location
        </Text>
        <Text textAlign="left">{event.location}</Text>

        <Form action="/" onSubmit={onSubmit}>
          <FormControl isInvalid={isError}>
            <Text
              as="h2"
              color="black.800"
              fontSize="l"
              fontWeight="medium"
              my="4px"
              textAlign="left"
            >
              Price in NEAR
            </Text>
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
          <Button type="submit" w="100%">
            Put Ticket For Sale
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
