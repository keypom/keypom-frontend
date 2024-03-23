import { type ReactElement } from 'react';
import { Center, TabPanel, TabPanels, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { ImageIcon, StarIcon, TicketIcon } from '@/components/Icons';
import { RoundedTabs, type TabListItem } from '@/components/RoundedTabs';
import { UNAUTHORIZED_TOAST } from '@/constants/toast';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

import { DropsTemplate } from './DropsTemplate';

type DropsTabItem = TabListItem & { content: ReactElement };

export const DropsSection = () => {
  const toast = useToast();
  const { isLoggedIn } = useAuthWalletContext();
  const navigate = useNavigate();

  const dropCta = (dropType: string) => {
    // TODO: suggestion - should show wallet modal to allow user to log in
    if (isLoggedIn) navigate(`/drop/${dropType}/new`);
    else toast(UNAUTHORIZED_TOAST);
  };

  const TAB_LIST: DropsTabItem[] = [
    {
      name: 'ticket',
      label: 'Ticket',
      icon: <TicketIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
      content: (
        <DropsTemplate
          ctaDisabled={false}
          ctaOnClick={() => {
            dropCta('ticket');
          }}
          ctaText="Create Event"
          description="Create tickets to your event that can be bought and resold with optional credit card payments enabled."
          headingText="Ticket your next event."
          imageNumber={1}
          subHeadingText="Event Drops"
        />
      ),
    },
    {
      name: 'token',
      label: 'Token',
      icon: <StarIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
      content: (
        <DropsTemplate
          ctaDisabled={false}
          ctaOnClick={() => {
            dropCta('token');
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
      name: 'nft',
      label: 'NFT',
      icon: <ImageIcon height={{ base: '6', md: '7' }} width={{ base: '6', md: '7' }} />,
      content: (
        <DropsTemplate
          ctaDisabled={false}
          ctaOnClick={() => {
            dropCta('nft');
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
        isLazy
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
