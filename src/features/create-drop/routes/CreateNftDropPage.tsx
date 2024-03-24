import { Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clear } from 'idb-keyval';

import { getNFTAttempt, handleFinishNFTDrop } from '@/features/create-drop/contexts/nft-utils';
import { useAppContext } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type IBreadcrumbItem } from '@/components/Breadcrumbs';
import { type IFlowPage } from '@/types/common';
import { DropFlow } from '@/features/create-drop/components/DropFlow';
import { DropFlowProvider } from '@/features/create-drop/contexts/DropFlowContext';
import { CreateNftDropProvider } from '@/features/create-drop/contexts/CreateNftDropContext';
import { CreateNftDropForm, CreateNftDropSummary } from '@/features/create-drop/components/nft';

const flowPages: IFlowPage[] = [
  {
    name: 'form',
    description: 'Enter the details for your new NFT Drop',
    component: <CreateNftDropForm />,
  },
  {
    name: 'summary',
    description: 'Let’s make sure all your details are correct',
    component: <CreateNftDropSummary />,
  },
];

const breadcrumbs: IBreadcrumbItem[] = [
  {
    name: 'My drops',
    href: '/drops',
  },
  {
    name: 'New NFT Drop',
    href: '/drops/nft/new',
  },
];

const NewNftDrop = () => {
  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const { accountId } = useAuthWalletContext();

  const handleNFTCreate = async () => {
    const data = await getNFTAttempt();
    if (!data?.confirmed) {
      return;
    }
    setAppModal({
      isOpen: true,
      isLoading: true,
      header: 'Creating NFT',
      message: 'Uploading media and creating NFT drop links on-chain. This may take 15-30 seconds.',
      options: [
        {
          label: 'Cancel',
          func: () => {
            clear();
          },
          buttonProps: {
            variant: 'outline',
          },
        },
      ],
    });
    const dropId = await handleFinishNFTDrop(setAppModal);
    setAppModal({
      isOpen: false,
      isLoading: false,
      header: '',
      message: '',
    });
    if (dropId) navigate(`/drop/nft/${dropId as string}`);
  };
  useEffect(() => {
    if (!accountId) return;
    handleNFTCreate();
  }, [accountId]);

  return (
    <Box mb={{ base: '5', md: '14' }} minH="100%" minW="100%" mt={{ base: '52px', md: '100px' }}>
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <CreateNftDropProvider>
          <DropFlow />
        </CreateNftDropProvider>
      </DropFlowProvider>
    </Box>
  );
};

export default NewNftDrop;
