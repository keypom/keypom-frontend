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
  Avatar,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import {
  getDrops,
  getKeySupplyForDrop,
  getDropSupplyForOwner,
  type ProtocolReturnedFCData,
  type ProtocolReturnedMethod,
  getEnv,
  type ProtocolReturnedDrop,
} from 'keypom-js';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { DeleteIcon } from '@/components/Icons';
import { handleFinishNFTDrop } from '@/features/create-drop/contexts/CreateNftDropContext';
import { truncateAddress } from '@/utils/truncateAddress';
import { NextButton, PrevButton } from '@/components/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { asyncWithTimeout } from '@/utils/asyncWithTimeout';
import { useAppContext } from '@/contexts/AppContext';
import { CLOUDFLARE_IPFS, DROP_TYPE } from '@/constants/common';
import keypomInstance from '@/lib/keypom';
import { PopoverTemplate } from '@/components/PopoverTemplate';

import { MENU_ITEMS } from '../config/menuItems';

import { MobileDrawerMenu } from './MobileDrawerMenu';
import { setConfirmationModalHelper } from './ConfirmationModal';

const FETCH_NFT_METHOD_NAME = 'get_series_info';

const COLUMNS: ColumnItem[] = [
  {
    id: 'dropName',
    title: 'Drop name',
    selector: (drop) => drop.name,
    thProps: {
      minW: '240px',
    },
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'media',
    title: '',
    selector: (drop) => drop.media,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'dropType',
    title: 'Drop type',
    selector: (drop) => drop.type,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'claimStatus',
    title: 'Claimed',
    selector: (drop) => drop.claimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: '',
    selector: (drop) => drop.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
    },
    loadingElement: <Skeleton height="30px" />,
  },
];

export default function AllDrops() {
  const { setAppModal } = useAppContext();

  const { viewCall } = getEnv();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);

  const [dataSize, setDataSize] = useState<number>(0);
  const [data, setData] = useState<Array<DataItem | null>>([]);
  const [wallet, setWallet] = useState({});

  const {
    hasPagination,
    pagination,
    isFirstPage,
    isLastPage,
    loading,
    handleNextPage,
    handlePrevPage,
  } = usePagination({
    dataSize,
    handlePrevApiCall: async () => {
      await handleGetDrops({
        start: (pagination.pageIndex - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      });
    },
    handleNextApiCall: async () => {
      await handleGetDrops({
        start: (pagination.pageIndex + 1) * pagination.pageSize,
        limit: pagination.pageSize,
      });
    },
  });

  const { selector, accountId } = useAuthWalletContext();

  const handleGetDropsSize = async () => {
    const numDrops = await getDropSupplyForOwner({
      accountId,
    });

    setDataSize(numDrops);
  };

  const setAllDropsData = async (drop: ProtocolReturnedDrop) => {
    const { drop_id: id, fc, metadata, next_key_id } = drop;
    const { dropName } = keypomInstance.getDropMetadata(metadata as string);

    let type: string | null = '';
    try {
      type = keypomInstance.getDropType(drop);
    } catch (_) {
      return null;
    }

    let nftHref = '';
    if (type === DROP_TYPE.NFT) {
      const fcMethod = (fc as ProtocolReturnedFCData).methods[0]?.[0];
      const { receiver_id } = fcMethod as ProtocolReturnedMethod;

      const nftData = await asyncWithTimeout(
        viewCall({
          contractId: receiver_id,
          methodName: FETCH_NFT_METHOD_NAME,
          args: {
            mint_id: parseInt(id),
          },
        }),
      ).catch((_) => {
        console.error(); // eslint-disable-line no-console
      });

      nftHref =
        `${CLOUDFLARE_IPFS}/${nftData?.metadata?.media as string}` ??
        'https://placekitten.com/200/300';
    }

    return {
      id,
      name: truncateAddress(dropName, 'end', 48),
      type: type?.toLowerCase(),
      media: type === DROP_TYPE.NFT ? nftHref : undefined,
      claimed: `${next_key_id - (await getKeySupplyForDrop({ dropId: id }))} / ${next_key_id}`,
    };
  };

  const handleGetDrops = async ({ start = 0, limit = pagination.pageSize }) => {
    const drops = await getDrops({ accountId, start, limit });

    setWallet(await selector.wallet());

    setData(
      await Promise.all(
        drops.map(async (drop) => {
          return await setAllDropsData(drop);
        }),
      ),
    );

    setIsLoading(false);
  };

  useEffect(() => {
    if (!accountId) return;
    handleGetDropsSize();
    handleGetDrops({});
    handleFinishNFTDrop();
  }, [accountId]);

  const dropMenuItems = MENU_ITEMS.map((item) => (
    <MenuItem key={item.label} {...item}>
      {item.label}
    </MenuItem>
  ));

  const handleDeleteClick = (dropId) => {
    setConfirmationModalHelper(setAppModal, async () => {
      await keypomInstance.deleteDrops({
        wallet,
        dropIds: [dropId],
      });
      handleGetDrops({});
    });
  };

  const getTableRows = (): DataItem[] => {
    if (data === undefined || data.length === 0) return [];

    return data.reduce((result: DataItem[], drop) => {
      if (drop !== null) {
        const dataItem = {
          ...drop,
          name: <Text color="gray.800">{drop.name}</Text>,
          type: (
            <Text fontWeight="normal" mt="0.5" textTransform="capitalize">
              {drop.type}
            </Text>
          ),
          media: drop.media !== undefined && <Avatar src={drop.media as string} />,
          claimed: <Badge variant="lightgreen">{drop.claimed} Claimed</Badge>,
          action: (
            <Button
              size="sm"
              variant="icon"
              onClick={async (e) => {
                e.stopPropagation();
                handleDeleteClick(drop.id);
              }}
            >
              <DeleteIcon color="red" />
            </Button>
          ),
          href: `/drop/${(drop.type as string).toLowerCase()}/${drop.id}`,
        };
        result.push(dataItem);
      }
      return result;
    }, []);
  };

  const createADropPopover = (menuIsOpen: boolean) => ({
    header: 'Click here to create a drop!',
    shouldOpen: data.length === 0 && !menuIsOpen,
  });

  return (
    <Box minH="100%" minW="100%">
      {/* Header Bar */}
      {/* Desktop Dropdown Menu */}
      <Show above="sm">
        <HStack alignItems="center" display="flex" spacing="auto">
          <Heading>All drops</Heading>
          <HStack>
            {hasPagination && (
              <PrevButton
                id="all-drops"
                isDisabled={!!isFirstPage}
                isLoading={loading.previous}
                onClick={handlePrevPage}
              />
            )}
            <Menu>
              {({ isOpen }) => (
                <Box>
                  <PopoverTemplate {...createADropPopover(isOpen)}>
                    <MenuButton
                      as={Button}
                      isActive={isOpen}
                      px="6"
                      py="3"
                      rightIcon={<ChevronDownIcon />}
                      variant="secondary-content-box"
                    >
                      Create a drop
                    </MenuButton>
                  </PopoverTemplate>
                  <MenuList>{dropMenuItems}</MenuList>
                </Box>
              )}
            </Menu>

            {hasPagination && (
              <NextButton
                id="all-drops"
                isDisabled={!!isLastPage}
                isLoading={loading.next}
                onClick={handleNextPage}
              />
            )}
          </HStack>
        </HStack>
      </Show>

      {/* Mobile Menu Button */}
      <Show below="sm">
        <VStack spacing="20px">
          <Heading size="2xl" textAlign="left" w="full">
            All drops
          </Heading>

          <HStack justify="space-between" w="full">
            <PopoverTemplate placement="bottom" {...createADropPopover(false)}>
              <Button
                px="6"
                py="3"
                rightIcon={<ChevronDownIcon />}
                variant="secondary-content-box"
                onClick={onOpen}
              >
                Create a drop
              </Button>
            </PopoverTemplate>
            {hasPagination && (
              <HStack>
                <PrevButton
                  id="all-drops"
                  isDisabled={!!isFirstPage}
                  isLoading={loading.previous}
                  onClick={handlePrevPage}
                />
                <NextButton
                  id="all-drops"
                  isDisabled={!!isLastPage}
                  isLoading={loading.next}
                  onClick={handleNextPage}
                />
              </HStack>
            )}
          </HStack>
        </VStack>
      </Show>

      <DataTable
        columns={COLUMNS}
        data={getTableRows()}
        loading={isLoading}
        mt={{ base: '6', md: '7' }}
        type="all-drops"
      />

      {/* Mobile Menu For Creating Drop */}
      <Show below="sm">
        <MobileDrawerMenu isOpen={isOpen} onClose={onClose} />
      </Show>
    </Box>
  );
}
