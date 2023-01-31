import React from 'react';
import { Button, Container, Heading, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <Container>
      <VStack spacing={2}>
        <Heading>About Page</Heading>
        <Button
          onClick={() => {
            navigate(-1);
          }}
        >
          Go to home page
        </Button>
      </VStack>
    </Container>
  );
}
