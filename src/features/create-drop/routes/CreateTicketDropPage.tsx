import { Box } from '@chakra-ui/react';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { type IFlowPage } from '@/types/common';
import { DropFlow } from '@/features/create-drop/components/DropFlow';
import { DropFlowProvider } from '@/features/create-drop/contexts/DropFlowContext';
import { CreateTicketDropProvider } from '@/features/create-drop/contexts/CreateTicketDropContext';
import { CreateTicketDropForm } from '@/features/create-drop/components/ticket/CreateTicketDropForm';
import { CreateTicketDropSummary } from '@/features/create-drop/components/ticket/CreateTicketDropSummary';

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
    name: 'My drops',
    href: '/drops',
  },
  {
    name: 'New Ticket Drop',
    href: '/drops/ticket/new',
  },
];

export default function NewTicketDrop() {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <CreateTicketDropProvider>
          <DropFlow />
        </CreateTicketDropProvider>
      </DropFlowProvider>
    </Box>
  );
}
