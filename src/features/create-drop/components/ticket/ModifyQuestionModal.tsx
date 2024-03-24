import { Button, Input, Modal, ModalContent, ModalOverlay, Text, VStack } from '@chakra-ui/react';

import { EMAIL_QUESTION } from './helpers';

interface ModifyQuestionModalProps {
  allQuestions: Array<{ id: string; isRequired: boolean }>;
  isOpen: boolean;
  onClose: (shouldAdd: boolean, originalQuestion?: string) => void;
  userInput: string;
  setUserInput: (value: string) => void;
  originalQuestion?: string;
}

export const ModifyQuestionModal = ({
  allQuestions,
  isOpen,
  onClose,
  userInput,
  setUserInput,
  originalQuestion,
}: ModifyQuestionModalProps) => {
  let canAddQuestion = !allQuestions.some((question) => question.id === userInput);
  if (userInput === EMAIL_QUESTION) {
    canAddQuestion = false;
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose(false, originalQuestion);
      }}
    >
      <ModalOverlay backdropFilter="blur(0px)" bg="blackAlpha.600" opacity="1" />
      <ModalContent maxH="90vh" overflowY="auto" padding={6}>
        <VStack align="left" spacing={6} textAlign="left">
          <VStack align="left" spacing={0} textAlign="left">
            <Text color="gray.800" fontSize="sm" fontWeight="500">
              {originalQuestion ? 'Edit question' : 'Custom question'}
            </Text>
            <Text color="gray.600" fontSize="sm" fontWeight="400" paddingBottom={2}>
              Add a question you'd like attendees to fill out for this event
            </Text>
            <Input
              maxLength={50}
              placeholder={originalQuestion ? 'Modify question' : 'Enter a question'}
              value={userInput}
              variant="outline"
              onChange={(e) => {
                e.preventDefault();
                setUserInput(e.target.value);
              }}
            />
          </VStack>
          <VStack align="left" spacing={3} textAlign="left">
            <Button
              autoFocus={false}
              isDisabled={!canAddQuestion}
              variant="primary"
              width="full"
              onClick={() => {
                onClose(true, originalQuestion);
              }}
            >
              {originalQuestion ? 'Finish' : 'Add question'}
            </Button>
            <Button
              autoFocus={false}
              variant="secondary"
              width="full"
              onClick={() => {
                onClose(false, originalQuestion);
              }}
            >
              Cancel
            </Button>
          </VStack>
        </VStack>
      </ModalContent>
    </Modal>
  );
};
