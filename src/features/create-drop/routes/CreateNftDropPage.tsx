import { Box } from '@chakra-ui/react';

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
