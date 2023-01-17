import { Center, TabPanel, TabPanels } from '@chakra-ui/react';

import { ImageIcon, StarIcon, TicketIcon } from '@/common/components/Icons';
import { RoundedTabs } from '@/common/components/RoundedTabs';

import { DropsTemplate } from './DropsTemplate';

const TAB_LIST = [
  {
    name: 'token',
    label: 'Token',
    icon: <StarIcon height={{ base: '4', md: '5' }} width={{ base: '4', md: '5' }} />,
  },
  {
    name: 'nft',
    label: 'NFT',
    icon: <ImageIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
  },
  {
    name: 'ticket',
    label: 'Ticket',
    icon: <TicketIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
  },
];

export const DropsSection = () => {
  return (
    <Center maxW="995px" mb={{ base: '14', md: '120px' }} mx="auto">
      <RoundedTabs align="center" tablist={TAB_LIST} w="full" onChange={() => null}>
        <TabPanels>
          <TabPanel px="0">
            <DropsTemplate imageNumber={0} />
          </TabPanel>
          <TabPanel px="0">
            <DropsTemplate imageNumber={1} />
          </TabPanel>
          <TabPanel px="0">
            <DropsTemplate imageNumber={2} />
          </TabPanel>
        </TabPanels>
      </RoundedTabs>
    </Center>
  );
};
