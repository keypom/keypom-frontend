import { Box, HStack, Text } from '@chakra-ui/react';

export interface StepItem {
  title: string;
  name: string;
}

export interface StepProps {
  index?: number;
  stepItem: StepItem;
  isActive?: boolean;
}

// TODO: to refactor separately
export const Step = ({ index, stepItem, isActive }: StepProps) => {
  if (isActive) {
    return (
      <HStack key={stepItem.name} alignItems="center">
        <Box
          bgColor="blue.400"
          borderRadius="100%"
          color="white"
          mr={{ base: '0', md: '2' }}
          px="2.5"
          py="0.5"
        >
          {index}
        </Box>
        <Text color="gray.800" fontSize={{ base: 'xs', md: 'base' }} whiteSpace="nowrap">
          {stepItem.title}
        </Text>
      </HStack>
    );
  }

  return (
    <HStack key={stepItem.name}>
      <Box bgColor="gray.100" borderRadius="100%" mr={{ base: '0', md: '2' }} px="2.5" py="0.5">
        {index}
      </Box>
      <Text color="gray.600" fontSize={{ base: 'xs', md: 'base' }} whiteSpace="nowrap">
        {stepItem.title}
      </Text>
    </HStack>
  );
};
