import { Box } from '@chakra-ui/react';

import { useTicketClaim } from '../../contexts/TicketClaimContext';

const TicketClaimPage2 = () => {
  const { claimInfoError, currentPage } = useTicketClaim();
  // show claim info error here if any
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '8px', md: '32px' }}>
      {/* render ticket page according to step */}
    </Box>
  );
};

export default TicketClaimPage2;
