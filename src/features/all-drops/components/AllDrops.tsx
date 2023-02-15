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
  IconButton,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getDropSupplyForOwner, getDrops, type ProtocolReturnedDrop } from 'keypom-js';
import { useNavigate } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import _ from 'lodash';

import { truncateAddress } from '@/utils/truncateAddress';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { DeleteIcon } from '@/components/Icons';

import { MENU_ITEMS } from '../config/menuItems';

import { MobileDrawerMenu } from './MobileDrawerMenu';

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

const PAGE_SIZE_LIMIT = 10;
const ACCOUNT_ID = process.env.NEXT_PUBLIC_KEYPOM_ACC_ID ?? '';

export default function AllDrops() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [dataSize, setDataSize] = useState<number>(0);
  const [visibleData, setVisibleData] = useState<ProtocolReturnedDrop[]>([]);
  const [{ loadLeft, loadRight }, setIsLoading] = useState({
    loadLeft: false,
    loadRight: false,
  });

  useEffect(() => {
    // Query for the amount of drops owned by the account
    const dropSupplySize = async () => {
      return await getDropSupplyForOwner({
        accountId: ACCOUNT_ID,
      });
    };
    dropSupplySize()
      .then((res) => {
        setDataSize(res);
      })
      .catch(console.error);

    // Set initial visible data
    const dropsAndKeys = async () =>
      await getDrops({
        accountId: ACCOUNT_ID,
        start: 0,
        limit: PAGE_SIZE_LIMIT,
        withKeys: true,
      });

    dropsAndKeys()
      .then((res) => {
        setVisibleData(res);
      })
      .catch(console.error);
  }, []);

  /** Pagination utils */
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0, // set the starting page index
    pageSize: PAGE_SIZE_LIMIT, // set the default page size
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const hasPagination = PAGE_SIZE_LIMIT < dataSize;
  const firstPage = pagination.pageIndex === 0;
  const lastPage = PAGE_SIZE_LIMIT * (pagination.pageIndex + 1) > dataSize;

  const handleNextPage = async () => {
    setIsLoading((prev) => ({ ...prev, loadRight: true }));
    if (lastPage) return; // last page
    const currentDrops = await getDrops({
      accountId: ACCOUNT_ID,
      start: (pagination?.pageIndex + 1) * PAGE_SIZE_LIMIT,
      limit: PAGE_SIZE_LIMIT,
      withKeys: true,
    });
    setVisibleData(currentDrops);

    setPagination((prev) => ({
      pageIndex: prev.pageIndex + 1,
      pageSize: PAGE_SIZE_LIMIT,
    }));
    setIsLoading((prev) => ({ ...prev, loadRight: false }));
  };

  const handlePrevPage = async () => {
    setIsLoading((prev) => ({ ...prev, loadLeft: true }));
    if (firstPage) return; // first page
    const currentDrops = await getDrops({
      accountId: ACCOUNT_ID,
      start: (pagination?.pageIndex - 1) * PAGE_SIZE_LIMIT,
      limit: PAGE_SIZE_LIMIT,
      withKeys: true,
    });
    setVisibleData(currentDrops);

    setPagination((prev) => ({
      pageIndex: prev.pageIndex - 1,
      pageSize: PAGE_SIZE_LIMIT,
    }));
    setIsLoading((prev) => ({ ...prev, loadLeft: false }));
  };
  /** end of pagination */

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

  const getTableRows: DataItem[] = useMemo(() => {
    const tableData = visibleData.map((drops) => {
      const dropName = JSON.parse(drops.metadata as string).dropName;
      let dropType = '';
      if (!_.isEmpty(drops.ft)) dropType = 'Token';
      else if (!_.isEmpty(drops.nft)) dropType = 'NFT';
      else if (!_.isEmpty(drops.fc)) dropType = 'Deposit';
      else dropType = '$NEAR';
      return {
        id: drops.drop_id,
        name: truncateAddress(dropName),
        type: dropType,
        claimed: `${drops.registered_uses}/${drops.config?.uses_per_key}`,
      };
    });

    return tableData.map((item) => ({
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
  }, [visibleData]);

  return (
    <Box minH="100%" minW="100%">
      {/* Header Bar */}
      <HStack alignItems="center" display="flex" spacing="auto">
        <Heading>All drops</Heading>
        {hasPagination && (
          <>
            <IconButton
              aria-label="previous-page-button"
              icon={<ChevronLeftIcon h="5" w="5" />}
              isDisabled={!!firstPage}
              isLoading={loadLeft}
              onClick={handlePrevPage}
            />
            <IconButton
              aria-label="next-page-button"
              icon={<ChevronRightIcon h="5" w="5" />}
              isDisabled={!!lastPage}
              isLoading={loadRight}
              onClick={handleNextPage}
            />
          </>
        )}
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
        data={getTableRows}
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
