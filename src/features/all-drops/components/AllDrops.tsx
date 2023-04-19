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
import { useCallback, useEffect, useRef, useState } from 'react';
import { type ProtocolReturnedDrop } from 'keypom-js';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useSearchParams } from 'react-router-dom';

import { useAppContext } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { DeleteIcon } from '@/components/Icons';
import { truncateAddress } from '@/utils/truncateAddress';
import { NextButton, PrevButton } from '@/components/Pagination';
import { usePagination } from '@/hooks/usePagination';
import { CLOUDFLARE_IPFS, DROP_TYPE, PAGE_QUERY_PARAM } from '@/constants/common';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const { setAppModal } = useAppContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const popoverClicked = useRef(0);

  const [dataSize, setDataSize] = useState<number>(0);
  const [data, setData] = useState<Array<DataItem | null>>([]);
  const [wallet, setWallet] = useState({});

  const { selector, accountId } = useAuthWalletContext();

  const {
    setPagination,
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
      const prevPageIndex = pagination.pageIndex - 1;
      await handleGetDrops({
        start: prevPageIndex * pagination.pageSize,
        limit: pagination.pageSize,
      });
      const newQueryParams = new URLSearchParams({
        [PAGE_QUERY_PARAM]: (prevPageIndex + 1).toString(),
      });
      setSearchParams(newQueryParams);
    },
    handleNextApiCall: async () => {
      const nextPageIndex = pagination.pageIndex + 1;
      await handleGetDrops({
        start: nextPageIndex * pagination.pageSize,
        limit: pagination.pageSize,
      });
      const newQueryParams = new URLSearchParams({
        [PAGE_QUERY_PARAM]: (nextPageIndex + 1).toString(),
      });
      setSearchParams(newQueryParams);
    },
  });

  const handleGetDropsSize = async () => {
    const numDrops = await keypomInstance.getDropSupplyForOwner({
      accountId,
    });

    setDataSize(numDrops);
  };

  const setAllDropsData = async (drop: ProtocolReturnedDrop) => {
    const { drop_id: id, metadata, next_key_id: totalKeys } = drop;
    const claimedKeys = await keypomInstance.getAvailableKeys(id);
    const claimedText = `${totalKeys - claimedKeys} / ${totalKeys}`;

    const { dropName } = keypomInstance.getDropMetadata(metadata);

    let type: string | null = '';
    try {
      type = keypomInstance.getDropType(drop);
    } catch (_) {
      type = DROP_TYPE.OTHER;
    }

    let nftHref: string | undefined;
    if (type === DROP_TYPE.NFT) {
      let nftMetadata = {
        media: '',
        title: '',
        description: '',
      };
      try {
        const fcMethods = drop.fc?.methods;
        if (
          fcMethods === undefined ||
          fcMethods.length === 0 ||
          fcMethods[0] === undefined ||
          fcMethods[0][0] === undefined
        ) {
          throw new Error('Unable to retrieve function calls.');
        }

        const { nftData } = await keypomInstance.getNFTorTokensMetadata(
          fcMethods[0][0],
          drop.drop_id,
        );

        nftMetadata = {
          media: `${CLOUDFLARE_IPFS}/${nftData?.metadata?.media}`, // eslint-disable-line
          title: nftData?.metadata?.title,
          description: nftData?.metadata?.description,
        };

        console.log(nftData);
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

    // page query param should be indexed from 1
    const pageQuery = searchParams.get('page');
    const currentPageIndex = pageQuery !== null ? parseInt(pageQuery) - 1 : 0;
    setPagination((pagination) => ({ ...pagination, pageIndex: currentPageIndex }));
    handleGetDropsSize();
    handleGetDrops({ start: currentPageIndex * pagination.pageSize });
  }, [accountId, searchParams]);

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
      window.location.reload();
    });
  };

  const getTableRows = (): DataItem[] => {
    if (data === undefined || data.length === 0) return [];

    return data.reduce((result: DataItem[], drop) => {
      if (drop !== null) {
        // show token drop manager for other drops type
        const dropType =
          (drop.type as string).toUpperCase() === DROP_TYPE.OTHER ? DROP_TYPE.TOKEN : drop.type;
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
          href: `/drop/${(dropType as string).toLowerCase()}/${drop.id}`,
        };
        return [...result, dataItem];
      }
      return result;
    }, []);
  };

  const createADropPopover = (menuIsOpen: boolean) => ({
    header: 'Click here to create a drop!',
    shouldOpen:
      !isLoading &&
      popoverClicked.current === 0 &&
      !hasPagination &&
      data.length === 0 &&
      !menuIsOpen,
  });

  const CreateADropButton = ({ isOpen }: { isOpen: boolean }) => (
    <PopoverTemplate {...createADropPopover(isOpen)}>
      <MenuButton
        as={Button}
        isActive={isOpen}
        px="6"
        py="3"
        rightIcon={<ChevronDownIcon />}
        variant="secondary-content-box"
        onClick={() => (popoverClicked.current += 1)}
      >
        Create a drop
      </MenuButton>
    </PopoverTemplate>
  );
  const CreateADropMobileButton = () => (
    <PopoverTemplate placement="bottom" {...createADropPopover(false)}>
      <Button
        px="6"
        py="3"
        rightIcon={<ChevronDownIcon />}
        variant="secondary-content-box"
        onClick={() => {
          popoverClicked.current += 1;
          onOpen();
        }}
      >
        Create a drop
      </Button>
    </PopoverTemplate>
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
                  <CreateADropButton isOpen={isOpen} />
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
            <CreateADropMobileButton />
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
