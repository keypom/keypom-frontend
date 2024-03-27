import { Button, Center, Divider, Hide, HStack, Show, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export const NotFound404 = ({
  header = '404',
  subheader = 'This page could not be found.',
  cta = 'back to homepage',
}: {
  header?: string;
  subheader?: string;
  cta?: string;
}) => {
  const navigate = useNavigate();
  return (
    <Center h="calc(100vh - 64px)">
      <Show above="md">
        <VStack spacing="40px">
          <HStack gap="4">
            <Text size="4xl">{header}</Text>
            <Divider borderColor="black" h="12" orientation="vertical" w="1" />
            <Text size="md">{subheader}</Text>
          </HStack>
          <Button
            onClick={() => {
              navigate('/');
            }}
          >
            {cta}
          </Button>
        </VStack>
      </Show>
      <Hide above="md">
        <VStack>
          <Text size="4xl">{header}</Text>
          <Text pb="20px" size="md">
            {subheader}
          </Text>
          <Button
            onClick={() => {
              navigate('/');
            }}
          >
            {cta}
          </Button>
        </VStack>
      </Hide>
    </Center>
  );
};
