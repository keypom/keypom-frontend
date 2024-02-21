import { LinkIcon, NFTIcon, TicketIcon, CheckedIcon } from '@/components/Icons';
import { type MenuItemProps } from '@/components/Menu';

export const DROP_TYPE_OPTIONS = {
  ANY: 'Any',
  TOKEN: 'Token',
  NFT: 'NFT',
  EVENT: 'Event',
};

export const DROP_CLAIM_STATUS_OPTIONS = {
  ANY: 'Any',
  FULLY: 'Fully',
  PARTIALLY: 'Partially',
  UNCLAIMED: 'Unclaimed',
};

export const CREATE_DROP_ITEMS: MenuItemProps[] = [
  {
    label: 'Token Drop',
    as: 'a',
    href: '/drop/token/new',
    icon: <LinkIcon h="4" w="4" />,
  },
  {
    label: 'NFT Drop',
    as: 'a',
    href: '/drop/nft/new',
    icon: <NFTIcon h="4" w="4" />,
  },
  // {
  //   label: 'Ticket Drop',
  //   as: 'a',
  //   href: '/drop/ticket/new',
  //   icon: <TicketIcon h="4" w="4" />,
  // },
];

export const DROP_TYPE_ITEMS: MenuItemProps[] = [
  {
    label: 'Any',
    icon: <CheckedIcon h="4" isChecked={false} w="4" />,
  },
  {
    label: 'Token',
    icon: <LinkIcon h="4" w="4" />,
  },
  {
    label: 'NFT',
    icon: <NFTIcon h="4" w="4" />,
  },
  {
    label: 'Event',
    icon: <TicketIcon h="4" w="4" />,
  },
];

export const DROP_CLAIM_STATUS_ITEMS: MenuItemProps[] = [
  {
    label: 'Any',
    icon: <CheckedIcon h="4" isChecked={false} w="4" />,
  },
  {
    label: 'Fully',
    color: 'green.600',
  },
  {
    label: 'Partially',
    color: 'yellow.600',
  },
  {
    label: 'Unclaimed',
    color: 'gray.600',
  },
];
