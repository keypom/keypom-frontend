import { Center, Text } from '@chakra-ui/react';

interface ErrorBoxProps {
  message: string;
}

export const ErrorBox = ({ message }: ErrorBoxProps) => {
  return (
    <Center h={{ base: '300px', md: '500px' }}>
      <Text variant="error">{message}</Text>
    </Center>
  );
};
