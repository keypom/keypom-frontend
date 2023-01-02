import { Button, Text, Heading, Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWalletModal = ({ isOpen, onClose }: ConnectWalletModalProps) => {
  return (
    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        bg="border.box"
        border="2px solid transparent"
        borderRadius="3xl"
        boxShadow="0px 100px 80px rgba(1, 133, 195, 0.05), 0px 12.5216px 10.0172px rgba(1, 133, 195, 0.025)"
        p="16"
        pb="8"
        position="relative"
        textAlign="center"
      >
        <Heading color="gray.900" fontWeight="500" letterSpacing="-0.02em">
          Sign In
        </Heading>
        <Text color="gray.600" mt="4">
          Sign in with a NEAR Wallet to create and manage drops.
        </Text>
        <Button mt="6" size={{ base: 'sm', md: 'md' }} variant="primary" w="auto">
          Connect Wallet
        </Button>
      </ModalContent>
    </Modal>
  );
};
