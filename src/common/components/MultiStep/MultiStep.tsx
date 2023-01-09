import { Box, Button, Divider, HStack, Text } from '@chakra-ui/react';

import { useSteps } from '@/common/hooks/useSteps';

export interface StepItem {
  title: string;
  name: string;
  component: React.ReactNode;
}

interface MultiStepFormProps {
  steps: StepItem[];
}

export const MultiStepForm = ({ steps }: MultiStepFormProps) => {
  const { onNext, onPrevious, currentIndex } = useSteps({ maxSteps: steps.length });

  const stepsDisplay = steps.map((step, index) => (
    <Step key={step.name} index={index + 1} isActive={currentIndex === index} stepItem={step} />
  ));

  return (
    <Box>
      <HStack flexWrap="nowrap" justifyContent="center" spacing="4">
        {stepsDisplay}
      </HStack>
      {steps[currentIndex].component}
      <Divider />
      <HStack justifyContent="flex-end" spacing="auto">
        {currentIndex > 0 && (
          <Button variant="secondary" onClick={onPrevious}>
            Go back
          </Button>
        )}
        <Button variant="secondary" onClick={onNext}>
          Skip this step
        </Button>
      </HStack>
    </Box>
  );
};

const Step = ({ index, stepItem, isActive }) => {
  if (isActive) {
    return (
      <HStack key={stepItem.name} alignItems="center">
        <Box bgColor="blue.400" borderRadius="100%" color="white" mr="2" px="2.5" py="0.5">
          {index}
        </Box>
        <Text color="gray.800" whiteSpace="nowrap">
          {stepItem.title}
        </Text>
      </HStack>
    );
  }

  return (
    <HStack key={stepItem.name}>
      <Box bgColor="gray.100" borderRadius="100%" mr="2" px="2.5" py="0.5">
        {index}
      </Box>
      <Text color="gray.600" whiteSpace="nowrap">
        {stepItem.title}
      </Text>
    </HStack>
  );
};
