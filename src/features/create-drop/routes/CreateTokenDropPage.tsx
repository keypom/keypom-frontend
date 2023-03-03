import { Box } from '@chakra-ui/react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { DropFlow } from '@/features/create-drop/components/DropFlow';
import { DropFlowProvider } from '@/features/create-drop/contexts/DropFlowContext';
import { CreateTokenDropProvider } from '@/features/create-drop/contexts/CreateTokenDropContext';
import { CreateTokenDropForm } from '@/features/create-drop/components/token/CreateTokenDropForm';
import { CreateTokenDropSummary } from '@/features/create-drop/components/token/CreateTokenDropSummary';
import { type IFlowPage } from '@/types/common';

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
    name: 'My drops',
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
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <CreateTokenDropProvider>
          <DropFlow />
        </CreateTokenDropProvider>
      </DropFlowProvider>
    </Box>
  );
}
