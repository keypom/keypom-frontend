import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Button,
  Text,
  VStack,
} from '@chakra-ui/react';
import Confetti from 'react-confetti';

interface EventPrizeClaimedModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  body: string;
  showConfetti: boolean;
}

const EventPrizeClaimedModal = ({
  isOpen,
  onClose,
  title,
  body,
  showConfetti,
}: EventPrizeClaimedModalProps) => {
  const modalSize = { base: 'sm', md: 'md' };
  const modalPadding = { base: '6', md: '8' };

  return (
    <Modal isCentered isOpen={isOpen} size={modalSize} onClose={onClose}>
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent boxShadow="lg" mx={3} p={modalPadding} textAlign="center">
        <Text
          color="#844AFF"
          fontFamily="denverBody"
          fontWeight="600"
          size={{ base: '2xl', md: '4xl' }}
          textAlign="center"
        >
          {title}
        </Text>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text>{body}</Text>
            <Button colorScheme="blue" onClick={onClose}>
              Close
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
      {showConfetti && isOpen && <Confetti />}
    </Modal>
  );
};

export default EventPrizeClaimedModal;
