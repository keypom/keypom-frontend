import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';

export const ModalWrapper = ({ isOpen, onClose, children }) => (
  <Modal isOpen={isOpen} onClose={onClose} size="2xl">
    <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
    <ModalContent maxH="95vh" overflowY="auto" padding={8} paddingY={6}>
      {children}
    </ModalContent>
  </Modal>
);
