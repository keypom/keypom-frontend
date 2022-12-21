import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';

import { DropFlow } from '@/modules/drops/DropFlow';

const FLOW = [
  {
    name: 'form',
    description: 'Enter the details for your new Token Drop',
    component: <IconBox icon={<LinkIcon />}>Create New Token Drop</IconBox>,
  },
  {
    name: 'summary',
    description: 'Let’s make sure all your details are correct',
    component: <IconBox icon={<LinkIcon />}>Create New Token Drop</IconBox>,
  },
];

export default function NewTokenDrop() {
  return (
    <Box minH="100%" minW="100%" mt="20">
      <PageHead
        removeTitleAppend
        description="Keypom create new token drop"
        name="New Token Drop"
      />
      <DropFlow flow={FLOW} />
    </Box>
  );
}
