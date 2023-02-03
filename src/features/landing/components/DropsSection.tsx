import { type ReactElement } from 'react';
import { Center, TabPanel, TabPanels } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { ImageIcon, StarIcon, TicketIcon } from '@/components/Icons';
import { RoundedTabs, type TabListItem } from '@/components/RoundedTabs';

import { DropsTemplate } from './DropsTemplate';

type DropsTabItem = TabListItem & { content: ReactElement };

export const DropsSection = () => {
  const navigate = useNavigate();

  const TAB_LIST: DropsTabItem[] = [
    {
      name: 'token',
      label: 'Token',
      icon: <StarIcon height={{ base: '4', md: '5' }} width={{ base: '4', md: '5' }} />,
      content: (
        <DropsTemplate
          ctaOnClick={() => {
            navigate('/drop/token/new');
          }}
          ctaText="Create a Token Drop"
          imageNumber={0}
        />
      ),
    },
    {
      name: 'nft',
      label: 'NFT',
      icon: <ImageIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
      content: (
        <DropsTemplate
          ctaOnClick={() => {
            navigate('/drop/nft/new');
          }}
          ctaText="Create an NFT Drop"
          imageNumber={1}
        />
      ),
    },
    {
      name: 'ticket',
      label: 'Ticket',
      icon: <TicketIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
      content: (
        <DropsTemplate
          ctaOnClick={() => {
            navigate('/drop/ticket/new');
          }}
          ctaText="Create a Ticket Drop"
          imageNumber={2}
        />
      ),
    },
  ];
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
