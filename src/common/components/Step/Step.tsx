import { Box, HStack, Text } from '@chakra-ui/react';

export interface StepItem {
  title: string;
  name: string;
  component: React.ReactNode;
}
export const Step = ({ index, stepItem, isActive }) => {
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
