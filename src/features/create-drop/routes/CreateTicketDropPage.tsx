import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { type IFlowPage } from '@/types/common';
import { DropFlow } from '@/features/create-drop/components/DropFlow';
import { DropFlowProvider } from '@/features/create-drop/contexts/DropFlowContext';
import { CreateTicketDropProvider } from '@/features/create-drop/contexts/CreateTicketDropContext';
import { CreateTicketDropForm } from '@/features/create-drop/components/ticket/CreateTicketDropForm';
import { CreateTicketDropSummary } from '@/features/create-drop/components/ticket/CreateTicketDropSummary';

import { TICKET_ATTEMPT_KEY } from '@/constants/common';
import { handleFinishDrop } from '@/features/create-drop/contexts/create-drop-utils';
import { useAppContext } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

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
  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const { accountId } = useAuthWalletContext();

  const handleNFTCreate = async () => {
    setAppModal({
      isOpen: true,
      isLoading: true,
      header: 'Creating Tickets',
      message: 'Uploading media, creating NFT POAPs and links on-chain. This may take 15-30 seconds.',
    });
    const dropId = await handleFinishDrop({
      setAppModal,
      tickets: true,
      key: TICKET_ATTEMPT_KEY,
    });
    console.log(dropId);
    setAppModal({
      isOpen: false,
      isLoading: false,
      header: '',
      message: '',
    });
    if (dropId) navigate(`/drop/ticket/${dropId as string}`);
  };
  useEffect(() => {
    if (!accountId) return;
    handleNFTCreate();
  }, [accountId]);

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
