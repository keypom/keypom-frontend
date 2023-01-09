import { Box, Button, Divider, HStack, Text } from '@chakra-ui/react';
import { useState } from 'react';

export interface StepItem {
  title: string;
  name: string;
  component: React.ReactNode;
}

interface MultiStepFormProps {
  steps: StepItem[];
}

export const MultiStepForm = ({ steps }: MultiStepFormProps) => {
  const [currentIndex, setIndex] = useState(0);
  const stepsDisplay = steps.map((step) => <Text key={step.name}>{step.title}</Text>);

  const onNext = () => {
    if (currentIndex + 1 < steps.length) {
      setIndex(currentIndex + 1);
    }
  };

  const onPrevious = () => {
    if (currentIndex - 1 >= 0) {
      setIndex(currentIndex - 1);
    }
  };

  return (
    <Box>
      <HStack>{stepsDisplay}</HStack>
      {steps[currentIndex].component}
      <Divider />
      <HStack>
        <Button onClick={onPrevious}>Go back</Button>
        <Button onClick={onNext}>Skip this step</Button>
      </HStack>
    </Box>
  );
};
