import { ModalContent, VStack, Text, HStack, Button } from '@chakra-ui/react';

interface ConfirmDeletionModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  confirmMessage?: string;
}

const ConfirmDeletionModal = ({
  onConfirm,
  onCancel,
  confirmMessage = 'Are you sure you want to delete this item? This action cannot be undone.',
}: ConfirmDeletionModalProps) => (
  <ModalContent padding={6}>
    <VStack align="stretch" spacing={4}>
      <Text fontSize="lg" fontWeight="semibold">
        Confirm Deletion
      </Text>
      <Text>{confirmMessage}</Text>
      <HStack justify="space-between">
        <Button colorScheme="red" onClick={onConfirm}>
          Delete
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </HStack>
    </VStack>
  </ModalContent>
);

export default ConfirmDeletionModal;
