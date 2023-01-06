import { Box, Heading, Text } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';

export default function Home() {
  return (
    <Box mt={{ base: 6, md: 14 }}>
      <PageHead description="Home page description" name="Home" />
      <Text>This is Inter V</Text>
      <Heading>This is Archia</Heading>
    </Box>
  );
}
