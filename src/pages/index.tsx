import { IconBox } from '@/common/components/IconBox';
import { PageHead } from '@/common/components/PageHead';
import { Box } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box minH="100%">
      <PageHead
        removeTitleAppend
        description="Home page description"
        name="Home"
      />
      Home page in progress
    </Box>
  );
}
