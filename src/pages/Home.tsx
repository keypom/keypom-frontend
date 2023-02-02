import { Button, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Container>
      <VStack spacing={2}>
        <Heading>Home Page</Heading>
        <Button
          onClick={() => {
            navigate('/about');
          }}
        >
          Go to about page
        </Button>
        <Text fontWeight="400">This is supposed to be Inter 400</Text>
        <Text fontWeight="500">This is supposed to be Inter 500</Text>
        <Text fontWeight="600">This is supposed to be Inter 600</Text>
        <Heading fontWeight="400">This is supposed to be Archia 400</Heading>
        <Heading fontWeight="500">This is supposed to be Archia 500</Heading>
        <Heading fontWeight="600">This is supposed to be Archia 600</Heading>
      </VStack>
    </Container>
  );
}
