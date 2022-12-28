import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';

import { CreateTokenDropForm } from '@/modules/CreateDrops/TokenDrop/CreateTokenDropForm';
import { CreateTokenDropProvider } from '@/modules/CreateDrops/TokenDrop/CreateTokenDropContext';

export default function NewDropPage() {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Page containing all drops created by user"
        name="All Drops"
      />
      <CreateTokenDropProvider>
        <CreateTokenDropForm />
      </CreateTokenDropProvider>
    </Box>
  );
}
