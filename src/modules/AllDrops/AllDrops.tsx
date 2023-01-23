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

import { useEffect, useState } from 'react';
import { getDrops, getKeySupplyForDrop } from 'keypom-js';

import { ChevronDownIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/router';

import { PageHead } from '@/common/components/PageHead';
import { DataTable } from '@/common/components/Table';
import { DeleteIcon } from '@/common/components/Icons';
import { ColumnItem, DataItem } from '@/common/components/Table/types';

import { MobileDrawerMenu } from './MobileDrawerMenu';
import { MENU_ITEMS } from './menuItems';
import { useAuthWalletContext } from '@/common/contexts/AuthWalletContext';

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

const getDropTypeLabel = ({ simple, ft, nft, fc }) => {
  return (simple && 'Token') || (ft && 'Token') || (nft && 'NFT') || (fc && 'Ticket')
}

export default function AllDrops() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState([])

  const { accountId } = useAuthWalletContext();

  const handleGetDrops = async () => {
    if (!accountId) return
    const drops = await getDrops({ accountId });
    console.log(drops)

    setData(await Promise.all(drops.map(async ({ drop_id: dropId, simple, ft, nft, fc, metadata, next_key_id }) => ({
      id: dropId,
      name: JSON.parse(metadata).name,
      type: getDropTypeLabel({ simple, ft, nft, fc }),
      claimed: `${next_key_id - await getKeySupplyForDrop({ dropId })} / ${next_key_id}`,
    }))))
  }

  useEffect(() => {
    handleGetDrops();
  }, [accountId]);

  const dropMenuItems = MENU_ITEMS.map((item) => (
    <MenuItem key={item.label} {...item}>
      {item.label}
    </MenuItem>
  ));

  const handleDeleteClick = () => {
    // TODO: handle delete drop
  };

  const handleRowClick = () => {
    router.push('/drop/token/123');
  };

  const getTableRows = (): DataItem[] => {
    if (data === undefined || data?.length === 0) return [];

    return data.map((item) => ({
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
      <PageHead
        removeTitleAppend
        description="Page containing all drops created by user"
        name="All Drops"
      />

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
