import { Box, Heading, Text } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';

export default function Home() {
  return (
    <Box mt={{ base: 6, md: 14 }}>
      <PageHead description="Home page description" name="Home" />
      <Text>This is Inter V</Text>
      <Heading>This is Archia</Heading>
      <Text fontSize={{ base: 'xs', md: 'sm' }} mt="6px" variant="error">
        ERROR TEXT
      </Text>
      <Text color="gray.400" fontSize="sm">
        Total cost: 5000 NEAR
      </Text>
    </Box>
  );
}
