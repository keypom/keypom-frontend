import { MenuItem } from '@chakra-ui/react';

import { LinkIcon, NFTIcon, TicketIcon, CheckedIcon } from '@/components/Icons';
import { type MenuItemProps } from '@/components/Menu';
import { FilterIcon } from '@/components/Icons/FilterIcon';

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

export const TICKET_CLAIM_STATUS_OPTIONS = {
  ANY: 'Any',
  PURCHASED: 'Purchased',
  SCANNED: 'Scanned',
};

export const DATE_FILTER_OPTIONS = {
  ANY: 'Any',
  NEWEST: 'Newest',
  OLDEST: 'Oldest',
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

export const DATE_FILTER_ITEMS: MenuItemProps[] = [
  {
    label: 'Any',
    icon: <CheckedIcon h="4" isChecked={false} w="4" />,
  },
  {
    label: 'Newest',
    icon: <FilterIcon h="4" highToLow={true} w="4" />,
  },
  {
    label: 'Oldest',
    icon: <FilterIcon h="4" highToLow={false} w="4" />,
  },
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

export const TICKET_CLAIM_STATUS_ITEMS: MenuItemProps[] = [
  {
    label: 'Any',
    icon: <CheckedIcon h="4" isChecked={false} w="4" />,
  },
  {
    label: 'Purchased',
    color: 'gray.600',
  },
  {
    label: 'Scanned',
    color: 'green.600',
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
