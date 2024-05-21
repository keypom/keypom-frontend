import { ModalContent, VStack, Text, Progress, Button } from '@chakra-ui/react';

interface CompletionModalContentProps {
  onClose: () => void;
  completionMessage?: string;
}

const CompletionModalContent = ({
  onClose,
  completionMessage = 'Deletion complete.',
}: CompletionModalContentProps) => (
  <ModalContent padding={6}>
    <VStack align="stretch" spacing={4}>
      <Text fontSize="lg" fontWeight="semibold">
        Deletion Complete
      </Text>
      <Progress hasStripe isAnimated value={100} />
      <Text>{completionMessage}</Text>
      <Button autoFocus={false} variant="secondary" width="full" onClick={onClose}>
        Close
      </Button>
    </VStack>
  </ModalContent>
);

export default CompletionModalContent;
