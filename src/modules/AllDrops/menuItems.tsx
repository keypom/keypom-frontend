import { LinkIcon, NFTIcon, TicketIcon } from '@/common/components/Icons';
import { MenuItemProps } from '@/common/components/Menu';

export const MENU_ITEMS: MenuItemProps[] = [
  {
    label: 'Token Drop',
    as: 'a',
    href: '/drop/new',
    icon: <LinkIcon h="4" w="4" />,
  },
  {
    label: 'NFT Drop',
    as: 'a',
    href: '/drop/new',
    icon: <NFTIcon h="4" w="4" />,
  },
  {
    label: 'Ticket Drop',
    as: 'a',
    href: '/drop/new',
    icon: <TicketIcon h="4" w="4" />,
  },
];
