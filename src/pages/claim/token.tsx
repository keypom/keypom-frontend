import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';

const ClaimTokenPage = () => {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Page detailing all the claimed tokens."
        name="Claim Tokens"
      />
    </Box>
  );
};

export default ClaimTokenPage;
