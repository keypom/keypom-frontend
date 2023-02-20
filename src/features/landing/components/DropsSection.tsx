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
      icon: <StarIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
      content: (
        <DropsTemplate
          ctaOnClick={() => {
            navigate('/drop/token/new');
          }}
          ctaText="Create a Token Drop"
          description="Great for giveaways, promotions, and marketing."
          headingText="Instantly drop tokens in a link."
          imageNumber={0}
          subHeadingText="Token Drops"
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
          ctaText="Create an Ticket Drop"
          description="Generate QRs for each guest, set them up with a wallet and optionally drop attendance proof NFTs."
          headingText="Ticket your next event."
          imageNumber={1}
          subHeadingText="Ticket Drops"
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
          ctaText="Create a NFT Drop"
          description="Easily drop NFTs to a large audience, without needing their wallets."
          headingText="NFTs in a link."
          imageNumber={2}
          subHeadingText="NFT Drops"
        />
      ),
    },
  ];
  return (
    <Center maxW="995px" mb={{ base: '14', md: '120px' }} mx="auto">
      <RoundedTabs
        align="center"
        size="lg"
        tablist={TAB_LIST}
        tabListProps={{ height: '60px' }}
        tabProps={{ width: '140px' }}
        w="full"
        onChange={() => null}
      >
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
