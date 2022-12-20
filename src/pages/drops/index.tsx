import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';

import AllDrops from '@/modules/AllDrops/AllDrops';

export default function AllDropsPage() {
  return (
    <Box minH="100%" minW="100%" mt="20">
      <PageHead
        removeTitleAppend
        description="Page containing all drops created by user"
        name="All Drops"
      />
      <AllDrops />
    </Box>
  );
}
