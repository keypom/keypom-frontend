import { Button, Center, Divider, Hide, HStack, Show, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const NotFound404 = () => {
  const navigate = useNavigate();
  return (
    <Center h="calc(100vh - 64px)">
      <Show above="md">
        <VStack spacing="40px">
          <HStack gap="4">
            <Text size="4xl">404</Text>
            <Divider borderColor="black" h="12" orientation="vertical" w="1" />
            <Text size="md">This page could not be found.</Text>
          </HStack>
          <Button
            onClick={() => {
              navigate('/');
            }}
          >
            Back to homepage
          </Button>
        </VStack>
      </Show>
      <Hide above="md">
        <VStack>
          <Text size="4xl">404</Text>
          <Text pb="20px" size="md">
            This page could not be found.
          </Text>
          <Button
            onClick={() => {
              navigate('/');
            }}
          >
            Back to homepage
          </Button>
        </VStack>
      </Hide>
    </Center>
  );
};
