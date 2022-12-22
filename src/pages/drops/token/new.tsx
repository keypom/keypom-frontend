import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';

import { DropFlow } from '@/modules/drops/DropFlow';

const flow = [
  {
    name: 'form',
    description: 'Enter the details for your new Token Drop',
    component: (
      <IconBox icon={<LinkIcon />} width="full">
        Create New Token Drop
      </IconBox>
    ),
  },
  {
    name: 'summary',
    description: 'Let’s make sure all your details are correct',
    component: <IconBox icon={<LinkIcon />}>Create New Token Drop</IconBox>,
  },
];

const breadcrumbs = [
  {
    name: 'All drops',
    href: '/drops',
  },
  {
    name: 'New Token Drop',
    href: '/drops/token/new',
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
      <DropFlow breadcrumbs={breadcrumbs} flow={flow} />
    </Box>
  );
}
