import { Box, TabPanel, TabPanels } from '@chakra-ui/react';

import { RoundedTabs, TabListItem } from '@/common/components/RoundedTabs';
import { LinkIcon, POAPNftIcon } from '@/common/components/Icons';

import { TokenForm } from './TokenForm';
import { POAPNftForm } from './POAPNftForm';

const tabList: TabListItem[] = [
  {
    name: 'token',
    label: 'Token',
    icon: <LinkIcon h={{ base: '7' }} w={{ base: '7' }} />,
  },
  {
    name: 'poapNft',
    label: 'POAP NFT',
    icon: <POAPNftIcon h={{ base: '7' }} w={{ base: '7' }} />,
  },
];

export const AdditionalGiftsForm = () => {
  return (
    <Box mt={{ base: '6', md: '8' }}>
      <RoundedTabs tablist={tabList}>
        <TabPanels mt={{ base: '5', md: '7' }}>
          <TabPanel>
            <TokenForm />
          </TabPanel>
          <TabPanel>
            <POAPNftForm />
          </TabPanel>
        </TabPanels>
      </RoundedTabs>
    </Box>
  );
};
