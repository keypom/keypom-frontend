import { Box } from '@chakra-ui/react';

import { PageHead } from '@/common/components/PageHead';
import { IBreadcrumbItem } from '@/common/components/Breadcrumbs';
import { IFlowPage } from '@/common/types';

import { DropFlow } from '@/modules/CreateDrops/DropFlow';
import { DropFlowProvider } from '@/modules/CreateDrops/contexts/DropFlowContext';
import { CreateNftDropProvider } from '@/modules/CreateDrops/NftDrop/CreateNftDropContext';
import { CreateNftDropForm } from '@/modules/CreateDrops/NftDrop/CreateNftDropForm';
import { CreateNftDropSummary } from '@/modules/CreateDrops/NftDrop/CreateNftDropSummary';

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
    name: 'All drops',
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
      <PageHead removeTitleAppend description="Keypom create new NFT drop" name="New NFT Drop" />
      <DropFlowProvider breadcrumbs={breadcrumbs} flowPages={flowPages}>
        <CreateNftDropProvider>
          <DropFlow />
        </CreateNftDropProvider>
      </DropFlowProvider>
    </Box>
  );
};

export default NewNftDrop;
