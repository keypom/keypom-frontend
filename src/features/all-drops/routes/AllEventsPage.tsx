import { Box } from '@chakra-ui/react';

import AllEvents from '../components/AllEvents';

export default function AllEventsPage() {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <AllEvents ctaButtonLabel="Create Event" hasDateFilter={true} pageTitle="My Events" />
    </Box>
  );
}
