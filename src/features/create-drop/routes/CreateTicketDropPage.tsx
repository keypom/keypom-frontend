import { Box } from '@chakra-ui/react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { type IFlowPage } from '@/types/common';
import { DropFlowProvider } from '@/features/create-drop/contexts/DropFlowContext';
import { CreateTicketDropProvider } from '@/features/create-drop/contexts/CreateTicketDropContext';
import { CreateTicketDropForm } from '@/features/create-drop/components/ticket/CreateTicketDropForm';
import { CreateTicketDropSummary } from '@/features/create-drop/components/ticket/CreateTicketDropSummary';

import { CreateTicketDropFlow } from '../components/CreateTicketDropFlow';

const flowPages: IFlowPage[] = [
  {
    name: 'form',
    description: 'Enter the details for your new Ticket Drop',
    component: <CreateTicketDropForm />,
  },
  {
    name: 'summary',
    description: 'Let’s make sure all your details are correct',
    component: <CreateTicketDropSummary />,
  },
];

const breadcrumbs: IBreadcrumbItem[] = [
  {
    name: 'My events',
    href: '/events',
  },
  {
    name: 'New Ticket Drop',
    href: '/drops/ticket/new',
  },
];

export default function NewTicketDrop() {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px' }}>
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <CreateTicketDropProvider>
          <CreateTicketDropFlow />
        </CreateTicketDropProvider>
      </DropFlowProvider>
    </Box>
  );
}
