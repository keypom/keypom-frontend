import { Box, Heading } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';

export default function Home() {
  return (
    <Box mt={{ base: 6, md: 14 }}>
      <PageHead description="Home page description" name="Home" />
      This is Inter V<Heading>This is Archia</Heading>
    </Box>
  );
}
