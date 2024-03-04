import { MenuItem } from '@chakra-ui/react';

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

export const KEY_CLAIM_STATUS_OPTIONS = {
  ANY: 'Any',
  CLAIMED: 'Claimed',
  UNCLAIMED: 'Unclaimed',
};

export const createMenuItems = ({ menuItems, onClick }) => {
  return menuItems.map((item) => (
    <MenuItem key={item.label} onClick={() => onClick(item)} {...item}>
      {item.label}
    </MenuItem>
  ));
};
export const CREATE_DROP_ITEMS: MenuItemProps[] = [
  {
    label: 'Token Drop',
    as: 'a',
    icon: <LinkIcon h="4" w="4" />,
  },
  {
    label: 'NFT Drop',
    as: 'a',
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

export const GALLERY_PRICE_ITEMS: MenuItemProps[] = [
  {
    label: 'Any',
  },
  {
    label: '<20',
  },
  {
    label: '20-50',
  },
  {
    label: '50-100',
  },
  {
    label: '100+',
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

export const KEY_CLAIM_STATUS_ITEMS: MenuItemProps[] = [
  {
    label: 'Any',
    icon: <CheckedIcon h="4" isChecked={false} w="4" />,
  },
  {
    label: 'Claimed',
    color: 'green.600',
  },
  {
    label: 'Unclaimed',
    color: 'gray.600',
  },
];

export const PAGE_SIZE_ITEMS: MenuItemProps[] = [
  {
    label: '5',
    color: 'gray.600',
  },
  {
    label: '10',
    color: 'gray.600',
  },
  {
    label: '15',
    color: 'gray.600',
  },
  {
    label: '20',
    color: 'gray.600',
  },
  {
    label: '50',
    color: 'gray.600',
  },
];

export const SORT_MENU_ITEMS: MenuItemProps[] = [
  // {
  //   label: 'Any',
  //   // color: 'gray.600',
  // },
  {
    label: 'Tickets ascending',
    // color: 'gray.600',
  },
  {
    label: 'Tickets descending',
    // color: 'gray.600',
  },
];
