import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IBreadcrumbItem } from '@/common/components/Breadcrumbs';

import { DropFlow } from '@/modules/CreateDrops/DropFlow';
import { DropFlowProvider } from '@/modules/CreateDrops/contexts/DropFlowContext';
import { IFlowPage } from '@/modules/CreateDrops/types/types';
import { CreateTokenDropProvider } from '@/modules/CreateDrops/TokenDrop/CreateTokenDropContext';
import { CreateTokenDropForm } from '@/modules/CreateDrops/TokenDrop/CreateTokenDropForm';
import { CreateTokenDropSummary } from '@/modules/CreateDrops/TokenDrop/CreateTokenDropSummary';

const flowPages: IFlowPage[] = [
  {
    name: 'form',
    description: 'Enter the details for your new Token Drop',
    component: <CreateTokenDropForm />,
  },
  {
    name: 'summary',
    description: 'Let’s make sure all your details are correct',
    component: <CreateTokenDropSummary />,
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
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Keypom create new token drop"
        name="New Token Drop"
      />
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <CreateTokenDropProvider>
          <DropFlow />
        </CreateTokenDropProvider>
      </DropFlowProvider>
    </Box>
  );
}
