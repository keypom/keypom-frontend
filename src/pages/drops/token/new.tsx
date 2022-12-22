import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IconBox } from '@/common/components/IconBox';
import { LinkIcon } from '@/common/components/Icons';
import { IBreadcrumbItem } from '@/common/components/Breadcrumbs';

import { DropFlow } from '@/modules/CreateDrops/DropFlow';
import { DropFlowProvider } from '@/modules/CreateDrops/contexts/DropFlowContext';
import { IFlowPage } from '@/modules/CreateDrops/types/types';

const flowPages: IFlowPage[] = [
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

const breadcrumbs: IBreadcrumbItem[] = [
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
    <Box minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Keypom create new token drop"
        name="New Token Drop"
      />
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <DropFlow />
      </DropFlowProvider>
    </Box>
  );
}
