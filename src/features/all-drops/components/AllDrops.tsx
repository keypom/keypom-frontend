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
import { useCallback, useEffect, useState } from 'react';
import { type ProtocolReturnedDrop } from 'keypom-js';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { DeleteIcon } from '@/components/Icons';
import { handleFinishNFTDrop } from '@/features/create-drop/contexts/CreateNftDropContext';
import { truncateAddress } from '@/utils/truncateAddress';
import { NextButton, PrevButton } from '@/components/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { useAppContext } from '@/contexts/AppContext';
import { DROP_TYPE } from '@/constants/common';
import keypomInstance from '@/lib/keypom';
import { PopoverTemplate } from '@/components/PopoverTemplate';

import { MENU_ITEMS } from '../config/menuItems';

import { MobileDrawerMenu } from './MobileDrawerMenu';
import { setConfirmationModalHelper } from './ConfirmationModal';

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
    const numDrops = await keypomInstance.getDropSupplyForOwner({
      accountId,
    });

    setDataSize(numDrops);
  };

  const setAllDropsData = async (drop: ProtocolReturnedDrop) => {
    const { drop_id: id, metadata, next_key_id: totalKeys } = drop;
    const claimedKeys = await keypomInstance.getClaimedDropInfo(id);
    const claimedText = `${totalKeys - claimedKeys} / ${totalKeys}`;

    const { dropName } = keypomInstance.getDropMetadata(metadata);

    let type: string | null = '';
    try {
      type = keypomInstance.getDropType(drop);
    } catch (_) {
      return null;
    }
    if (type === undefined || type === null || type === '') return null; // don't show the drop if the type return is unexpected

    let nftHref: string | undefined;
    if (type === DROP_TYPE.NFT) {
      let nftMetadata = {
        media: '',
        title: '',
        description: '',
      };
      try {
        nftMetadata = await keypomInstance.getNftMetadata(drop);
      } catch (e) {
        console.error('failed to get nft metadata', e); // eslint-disable-line no-console
      }
      nftHref = nftMetadata?.media || 'assets/image-not-found.png';
    }

    return {
      id,
      name: truncateAddress(dropName, 'end', 48),
      type: type?.toLowerCase(),
      media: nftHref,
      claimed: claimedText,
    };
  };

  const handleGetDrops = useCallback(
    async ({ start = 0, limit = pagination.pageSize }) => {
      const drops = await keypomInstance.getDrops({ accountId, start, limit });

      setWallet(await selector.wallet());

      setData(
        await Promise.all(
          drops.map(async (drop) => {
            return await setAllDropsData(drop);
          }),
        ),
      );

      setIsLoading(false);
    },
    [pagination],
  );

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

  const CreateADropButton = ({ isOpen }: { isOpen: boolean }) => (
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
  );
  const CreateADropMobileButton = () => (
    <Button
      px="6"
      py="3"
      rightIcon={<ChevronDownIcon />}
      variant="secondary-content-box"
      onClick={onOpen}
    >
      Create a drop
    </Button>
  );

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
                  {!isLoading ? (
                    <PopoverTemplate {...createADropPopover(isOpen)}>
                      <CreateADropButton isOpen={isOpen} />
                    </PopoverTemplate>
                  ) : (
                    <CreateADropButton isOpen={isOpen} />
                  )}
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
            {!isLoading ? (
              <PopoverTemplate placement="bottom" {...createADropPopover(false)}>
                <CreateADropMobileButton />
              </PopoverTemplate>
            ) : (
              <CreateADropMobileButton />
            )}
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
