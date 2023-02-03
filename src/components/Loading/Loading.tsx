import { Center, Spinner, Text, VStack } from '@chakra-ui/react';

export const Loading = () => {
  return (
    <Center h="100vh" w="100vw">
      <VStack>
        <Spinner size="xl" thickness="10px" />
        <Text fontWeight="500" size="xl">
          Loading...
        </Text>
      </VStack>
    </Center>
  );
};
