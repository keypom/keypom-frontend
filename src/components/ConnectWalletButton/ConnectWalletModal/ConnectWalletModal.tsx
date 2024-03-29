import {
  Button,
  Modal,
  ModalContent,
  ModalOverlay,
  Box,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

import { LinkIcon } from '@/components/Icons';
import { RoundIcon } from '@/components/IconBox/RoundIcon';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWalletModal = ({ isOpen, onClose }: ConnectWalletModalProps) => {
  const { modal } = useAuthWalletContext();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Box left="50%" position="absolute" top="0" transform="translate(-50%, -50%)">
          <RoundIcon icon={<LinkIcon h={{ base: '7', md: '8' }} w={{ base: '8', md: '9' }} />} />
        </Box>
        <ModalHeader>Sign In</ModalHeader>
        <ModalBody>Sign in with a NEAR Wallet to create and manage drops.</ModalBody>
        <ModalFooter>
          <Button
            size={{ base: 'sm', md: 'md' }}
            variant="primary"
            onClick={() => {
              modal.show();
            }}
          >
            Connect Wallet
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
