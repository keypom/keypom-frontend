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
import { getDrops, getKeySupplyForDrop, deleteDrops } from 'keypom-js';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { DeleteIcon } from '@/components/Icons';

import { handleFinishNFTDrop } from '../../create-drop/contexts/CreateNftDropContext';
import { MENU_ITEMS } from '../config/menuItems';

import { MobileDrawerMenu } from './MobileDrawerMenu';

const getDropTypeLabel = ({ simple, ft, nft, fc }) => {
  return (simple && 'Token') || (ft && 'Token') || (nft && 'NFT') || (fc && 'Ticket');
};

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

  const [data, setData] = useState([{
    id: 0,
    name: 'test',
    type: 'hello',
    claimed: 'some'
  }]);
  const [wallet, setWallet] = useState({});

  const { selector, accountId } = useAuthWalletContext();

  const handleGetDrops = async () => {
    if (!accountId) return;
    const drops = await getDrops({ accountId });
    console.log(drops);

    setWallet(await selector.wallet());

    // debugging
    // deleteDrops({
    //   wallet,
    //   drops: drops.slice(1)
    // })

    setData(
      await Promise.all(
        drops.map(async ({
          drop_id: id,
          simple,
          ft,
          nft,
          fc,
          metadata = JSON.stringify({name: 'untitled'}),
          next_key_id
        }) => ({
          id,
          name: JSON.parse(metadata).name,
          type: getDropTypeLabel({ simple, ft, nft, fc }),
          claimed: `${next_key_id - (await getKeySupplyForDrop({ dropId: id }))} / ${next_key_id}`,
        })),
      ),
    );
  };

  useEffect(() => {
    handleGetDrops();
    if (accountId) {
      handleFinishNFTDrop();
    }
  }, [accountId]);

  const dropMenuItems = MENU_ITEMS.map((item) => (
    <MenuItem key={item.label} {...item}>
      {item.label}
    </MenuItem>
  ));

  const handleDeleteClick = async (dropId) => {
    console.log('deleting drop', dropId);
    await deleteDrops({
      wallet,
      dropIds: [dropId],
    });
  };

  const handleRowClick = (dropId) => {
    navigate('/drop/token/' + dropId);
  };

  const getTableRows = (): DataItem[] => {
    if (data === undefined || data?.length === 0) return [];

    return data.map((drop, i) => ({
      ...drop,
      name: <Text color="gray.800">{drop.name}</Text>,
      type: (
        <Text fontWeight="normal" mt="0.5">
          {drop.type}
        </Text>
      ),
      claimed: <Badge variant="lightgreen">{drop.claimed} Claimed</Badge>,
      action: (
        <Button size="sm" variant="icon"
        onClick={async (e) => {
          e.stopPropagation();
          await handleDeleteClick(drop.id);
        }}>
          <DeleteIcon
            color="red"
          />
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
