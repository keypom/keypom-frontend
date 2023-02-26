import { Center, Divider, Hide, HStack, Show, Text, VStack } from '@chakra-ui/react';

export const NotFound404 = () => {
  return (
    <Center h="calc(100vh - 64px)">
      <Show above="md">
        <HStack gap="4">
          <Text size="4xl">404</Text>
          <Divider borderColor="black" h="12" orientation="vertical" w="1" />
          <Text size="md">This page could not be found.</Text>
        </HStack>
      </Show>
      <Hide above="md">
        <VStack>
          <Text size="4xl">404</Text>
          <Text size="md">This page could not be found.</Text>
        </VStack>
      </Hide>
    </Center>
  );
};
