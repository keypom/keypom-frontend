import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IBreadcrumbItem } from '@/common/components/Breadcrumbs';

import { DropFlow } from '@/modules/CreateDrops/DropFlow';
import { DropFlowProvider } from '@/modules/CreateDrops/contexts/DropFlowContext';
import { IFlowPage } from '@/modules/CreateDrops/types/types';
import { CreateTokenDropSummary } from '@/modules/CreateDrops/TokenDrop/CreateTokenDropSummary';
import { CreateTicketDropProvider } from '@/modules/CreateDrops/TicketDrop/CreateTicketDropContext';
import { CreateTicketDropForm } from '@/modules/CreateDrops/TicketDrop/CreateTicketDropForm';

const flowPages: IFlowPage[] = [
  {
    name: 'form',
    description: 'Enter the details for your new Ticket Drop',
    component: <CreateTicketDropForm />,
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
    name: 'New Ticket Drop',
    href: '/drops/ticket/new',
  },
];

export default function NewTicketDrop() {
  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <PageHead
        removeTitleAppend
        description="Keypom create new ticket drop"
        name="New Ticket Drop"
      />
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <CreateTicketDropProvider>
          <DropFlow />
        </CreateTicketDropProvider>
      </DropFlowProvider>
    </Box>
  );
}
