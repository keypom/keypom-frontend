import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSuccess: boolean;
  isLoading: boolean;
  errorText: string;
}

export const ResultModal = ({
  isOpen,
  onClose,
  isSuccess,
  isLoading,
  errorText,
}: ResultModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalBody>
          {isSuccess && <Text>Ticket is valid!</Text>}
          {errorText !== '' && <Text variant="error">{errorText}</Text>}
          {isLoading && <Spinner size="lg" />}
        </ModalBody>

        <ModalFooter>{!isLoading && <Button onClick={onClose}>Ok</Button>}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};
