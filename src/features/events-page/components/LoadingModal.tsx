import {
  Box,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';

interface LoadingModalProps {
  isOpen;
  onClose;
  text;
}

export const LoadingModal = ({ isOpen, onClose, text }: LoadingModalProps) => {
  const modalSize = 'xs';
  const modalPadding = { base: '4', md: '8' };
  const modalHeight = { base: '30vh', md: '40vh' };
  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size={modalSize}
      onClose={onClose}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH={modalHeight} p={modalPadding}>
        <ModalCloseButton size="lg" />
        <Box borderColor="gray.200" maxW="full">
          <Spinner color="blue.500" emptyColor="gray.200" size="xl" speed="0.65s" thickness="4px" />
          <Text
            as="h2"
            color="black.800"
            fontSize="l"
            fontWeight="medium"
            my="4px"
            pt="4"
            textAlign="center"
          >
            {text}
          </Text>
        </Box>
      </ModalContent>
    </Modal>
  );
};
