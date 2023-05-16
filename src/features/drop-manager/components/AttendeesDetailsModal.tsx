import { Divider, HStack, Text, VStack } from '@chakra-ui/react';

export const setAttendeesDetailsModal = (setAppModal, link, status, questions, answers) => {
  const renderQnaComponent = () =>
    questions.map((_, i) => (
      <VStack key={i} align="flex-start" spacing="0">
        <Text color="black" fontWeight="500" size="sm" textAlign="left">
          {questions[i].text}
        </Text>
        <Text size="sm" textAlign="left">
          {answers[i]}
        </Text>
      </VStack>
    ));

  const renderBodyComponent = () => {
    return (
      <>
        <HStack justify="space-between">
          <VStack align="flex-start" spacing="0">
            <Text fontWeight="500" size="sm">
              Link
            </Text>
            <Text size="sm" textAlign="left">
              {link}
            </Text>
          </VStack>
          {status}
        </HStack>
        <Divider bgColor="gray.100" marginBlock="6" orientation="horizontal" w="full" />
        <VStack align="flex-start" spacing="6">
          <Text color="black" fontWeight="500" size="lg" textAlign="left">
            Attendee questions and responses
          </Text>
          {renderQnaComponent()}
        </VStack>
      </>
    );
  };

  setAppModal({
    isOpen: true,
    contentProps: { p: '8', maxW: { base: 'inherit', md: '584px' } },
    headerProps: { alignItems: 'flex-start' },
    bodyProps: { mt: 6 },
    header: 'Attendee details',
    options: [
      {
        label: 'Close',
        buttonProps: {
          width: 'full',
          variant: 'secondary',
        },
      },
    ],
    bodyComponent: renderBodyComponent(),
  });
};
