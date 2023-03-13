import { Box } from '@chakra-ui/react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { DropFlow } from '@/features/create-drop/components/DropFlow';
import { DropFlowProvider } from '@/features/create-drop/contexts/DropFlowContext';
// import { CreateTokenDropSummary } from '@/features/create-drop/components/token/CreateTokenDropSummary';
import { type IFlowPage } from '@/types/common';

import { CreateEventDropsForm } from '../components/event/CreateEventDropsForm';
import { CreateEventDropsProvider } from '../contexts/CreateEventDropsContext';

const flowPages: IFlowPage[] = [
  {
    name: 'form',
    description: 'Enter the details for your new Token Drop',
    component: <CreateEventDropsForm />,
  },
  // {
  //   name: 'summary',
  //   description: 'Let’s make sure all your details are correct',
  //   component: <CreateTokenDropSummary />,
  // },
];

const breadcrumbs: IBreadcrumbItem[] = [
  {
    name: 'My drops',
    href: '/drops',
  },
  {
    name: 'New Event Drops',
    href: '/drops/event/new',
  },
];

export default function CreateEventDropsPage() {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <CreateEventDropsProvider>
          <DropFlow />
        </CreateEventDropsProvider>
      </DropFlowProvider>
    </Box>
  );
}
