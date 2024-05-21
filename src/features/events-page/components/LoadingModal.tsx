import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';

interface LoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // Optional title
  subtitle?: string; // Optional subtitle
  text?: string; // Optional text
}

export const LoadingModal = ({ isOpen, onClose, title, subtitle, text }: LoadingModalProps) => {
  const modalSize = { base: 'sm', md: 'md' };
  const modalPadding = { base: '6', md: '8' };
  const spinnerSize = { base: 'lg', md: 'xl' };

  return (
    <Modal
      isCentered
      closeOnOverlayClick={false}
      isOpen={isOpen}
      size={modalSize}
      onClose={onClose}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent boxShadow="lg" mx={3} p={modalPadding} textAlign="center">
        {title && (
          <ModalHeader>
            <Text fontSize="xl" fontWeight="semibold">
              {title}
            </Text>
          </ModalHeader>
        )}
        <ModalBody>
          <VStack spacing={4}>
            <Spinner
              color="blue.500"
              emptyColor="gray.300"
              size={spinnerSize}
              speed="0.8s"
              thickness="3px"
            />
            {subtitle && (
              <Text fontSize="lg" fontWeight="medium">
                {subtitle}
              </Text>
            )}
            {text && (
              <Text color="gray.600" fontSize="md">
                {text}
              </Text>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
