import { LinkIcon } from '@/components/Icons';
import { type MenuItemProps } from '@/components/Menu';

export const MENU_ITEMS: MenuItemProps[] = [
  {
    label: 'Token Drop',
    as: 'a',
    href: '/drop/token/new',
    icon: <LinkIcon h="4" w="4" />,
  },
  // {
  //   label: 'NFT Drop',
  //   as: 'a',
  //   href: '/drop/nft/new',
  //   icon: <NFTIcon h="4" w="4" />,
  // },
  // {
  //   label: 'Ticket Drop',
  //   as: 'a',
  //   href: '/drop/ticket/new',
  //   icon: <TicketIcon h="4" w="4" />,
  // },
];
