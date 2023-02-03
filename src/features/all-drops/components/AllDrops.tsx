import {
  Badge,
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Show,
  Text,
  useDisclosure,
  Heading,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { DeleteIcon } from '@/components/Icons';

import { MENU_ITEMS } from '../config/menuItems';

import { MobileDrawerMenu } from './MobileDrawerMenu';

const TABLE_DATA: DataItem[] = [
  // sample data until we integrate with SDK
  {
    id: 1,
    name: 'Star Invader 3',
    type: 'Token',
    claimed: '90 / 100',
  },
  {
    id: 2,
    name: 'The International',
    type: 'Ticket',
    claimed: '10000 / 20000',
  },
  {
    id: 3,
    name: 'Trumpy Apes',
    type: 'NFT',
    claimed: '10 / 444', // TODO: Need to figure out what determines the badge color
  },
];

const COLUMNS: ColumnItem[] = [
  {
    title: 'Drop name',
    selector: (drop) => drop.name,
  },
  {
    title: 'Drop type',
    selector: (drop) => drop.type,
  },
  {
    title: 'Claimed',
    selector: (drop) => drop.claimed,
  },
  {
    title: '',
    selector: (drop) => drop.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
    },
  },
];

export default function AllDrops() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dropMenuItems = MENU_ITEMS.map((item) => (
    <MenuItem key={item.label} {...item}>
      {item.label}
    </MenuItem>
  ));

  const handleDeleteClick = () => {
    // TODO: handle delete drop
  };

  const handleRowClick = () => {
    // TODO: handle dynamically
    navigate('/drop/token/123');
  };

  const getTableRows = (): DataItem[] => {
    if (TABLE_DATA === undefined || TABLE_DATA?.length === 0) return [];

    return TABLE_DATA.map((item) => ({
      ...item,
      name: <Text color="gray.800">{item.name}</Text>,
      type: (
        <Text fontWeight="normal" mt="0.5">
          {item.type}
        </Text>
      ),
      claimed: <Badge variant="lightgreen">{item.claimed} Claimed</Badge>,
      action: (
        <Button size="sm" variant="icon">
          <DeleteIcon color="red" onClick={handleDeleteClick} />
        </Button>
      ),
    }));
  };

  return (
    <Box minH="100%" minW="100%">
      {/* <PageHead
        removeTitleAppend
        description="Page containing all drops created by user"
        name="All Drops"
      /> */}

      {/* Header Bar */}
      <HStack alignItems="center" display="flex" spacing="auto">
        <Heading>All drops</Heading>

        {/* Desktop Dropdown Menu */}
        <Show above="sm">
          <Menu>
            {({ isOpen }) => (
              <Box>
                <MenuButton
                  as={Button}
                  isActive={isOpen}
                  px="6"
                  py="3"
                  rightIcon={<ChevronDownIcon />}
                  variant="secondary"
                >
                  Create a drop
                </MenuButton>
                <MenuList>{dropMenuItems}</MenuList>
              </Box>
            )}
          </Menu>
        </Show>

        {/* Mobile Menu Button */}
        <Show below="sm">
          <Button
            px="6"
            py="3"
            rightIcon={<ChevronDownIcon />}
            variant="secondary"
            onClick={onOpen}
          >
            Create a drop
          </Button>
        </Show>
      </HStack>

      <DataTable
        columns={COLUMNS}
        data={getTableRows()}
        mt={{ base: '6', md: '7' }}
        onRowClick={handleRowClick}
      />

      {/* Mobile Menu For Creating Drop */}
      <Show below="sm">
        <MobileDrawerMenu isOpen={isOpen} onClose={onClose} />
      </Show>
    </Box>
  );
}
