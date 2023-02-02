import React, { type ReactElement } from 'react';
import { Center, TabPanel, TabPanels } from '@chakra-ui/react';

import { DropsTemplate } from './DropsTemplate';

import { ImageIcon, StarIcon, TicketIcon } from '@/components/Icons';
import { RoundedTabs, type TabListItem } from '@/components/RoundedTabs';

type DropsTabItem = TabListItem & { content: ReactElement };

const TAB_LIST: DropsTabItem[] = [
  {
    name: 'token',
    label: 'Token',
    icon: <StarIcon height={{ base: '4', md: '5' }} width={{ base: '4', md: '5' }} />,
    content: <DropsTemplate imageNumber={0} />,
  },
  {
    name: 'nft',
    label: 'NFT',
    icon: <ImageIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
    content: <DropsTemplate imageNumber={1} />,
  },
  {
    name: 'ticket',
    label: 'Ticket',
    icon: <TicketIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
    content: <DropsTemplate imageNumber={2} />,
  },
];

export const DropsSection = () => {
  return (
    <Center maxW="995px" mb={{ base: '14', md: '120px' }} mx="auto">
      <RoundedTabs align="center" tablist={TAB_LIST} w="full" onChange={() => null}>
        <TabPanels>
          {TAB_LIST.map(({ name, content }) => (
            <TabPanel key={name} px="0">
              {content}
            </TabPanel>
          ))}
        </TabPanels>
      </RoundedTabs>
    </Center>
  );
};
