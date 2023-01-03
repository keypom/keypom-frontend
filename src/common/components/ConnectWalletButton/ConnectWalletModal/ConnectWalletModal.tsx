import { LinkIcon } from '@chakra-ui/icons';
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

import { RoundIcon } from '@/common/components/IconBox/RoundIcon';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const icon = <LinkIcon h={{ base: '8', md: '10' }} w={{ base: '8', md: '10' }} />;

export const ConnectWalletModal = ({ isOpen, onClose }: ConnectWalletModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <Box left="50%" position="absolute" top="0" transform="translate(-50%, -50%)">
          <RoundIcon icon={icon} />
        </Box>
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
