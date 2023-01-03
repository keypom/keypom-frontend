import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWalletModal = ({ isOpen, onClose }: ConnectWalletModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign In</ModalHeader>
        <ModalBody>Sign in with a NEAR Wallet to create and manage drops.</ModalBody>
        <ModalFooter>
          <Button size={{ base: 'sm', md: 'md' }} variant="primary">
            Connect Wallet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
