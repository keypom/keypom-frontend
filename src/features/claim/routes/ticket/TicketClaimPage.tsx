import { Box, Center, Spinner } from '@chakra-ui/react';

import { ErrorBox } from '@/components/ErrorBox';
import {
  TicketClaimContextProvider,
  useTicketClaim,
} from '@/features/claim/contexts/TicketClaimContext';

/**
 *
 * High level Ticket Claim page to handle all key uses
 * - Handles claim info loading and error
 * - Renders the page for the key use
 */

const TicketClaimPage = () => {
  const { claimInfoError, isClaimInfoLoading, currentPage: PageComponent } = useTicketClaim();

  if (isClaimInfoLoading) {
    return (
      <Center h={{ base: '300px', md: '500px' }}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (claimInfoError) {
    return <ErrorBox message={claimInfoError} />;
  }

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '8px', md: '32px' }}>
      {/* render ticket page according to key use */}
      {PageComponent && <PageComponent />}
    </Box>
  );
};

const WrappedTicketClaimPage = () => {
  return (
    <TicketClaimContextProvider>
      <TicketClaimPage />
    </TicketClaimContextProvider>
  );
};

export default WrappedTicketClaimPage;
