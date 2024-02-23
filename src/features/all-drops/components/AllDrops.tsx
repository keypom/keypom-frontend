import {
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Badge,
  Box,
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
import { SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';

import { PAGE_SIZE_LIMIT, CLOUDFLARE_IPFS, DROP_TYPE } from '@/constants/common';
import { useAppContext } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { DeleteIcon } from '@/components/Icons';
import { truncateAddress } from '@/utils/truncateAddress';
import { NextButton, PrevButton } from '@/components/Pagination';
import keypomInstance from '@/lib/keypom';

import {
  DROP_TYPE_OPTIONS,
  DROP_CLAIM_STATUS_OPTIONS,
  DROP_CLAIM_STATUS_ITEMS,
  PAGE_SIZE_ITEMS,
  DROP_TYPE_ITEMS,
  CREATE_DROP_ITEMS,
} from '../config/menuItems';

import { MobileDrawerMenu } from './MobileDrawerMenu';
import { setConfirmationModalHelper } from './ConfirmationModal';

const COLUMNS: ColumnItem[] = [
  {
    id: 'dropName',
    title: 'Name',
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
    title: 'Type',
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

  const [hasPagination, setHasPagination] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const popoverClicked = useRef(0);

  const [selectedFilters, setSelectedFilters] = useState<{
    type: string;
    search: string;
    status: string;
    pageSize: number;
  }>({
    type: DROP_TYPE_OPTIONS.ANY,
    search: '',
    status: DROP_CLAIM_STATUS_OPTIONS.ANY,
    pageSize: PAGE_SIZE_LIMIT,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [allOwnedDrops, setAllOwnedDrops] = useState<ProtocolReturnedDrop[]>([]);
  const [filteredDataItems, setFilteredDataItems] = useState<DataItem[]>([]);
  const [wallet, setWallet] = useState({});

  const { selector, accountId } = useAuthWalletContext();

  const handlePageSizeSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      pageSize: parseInt(item.label),
    }));
  };

  const handleDropTypeSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      type: item.label,
    }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchTerm(value);
  };

  const handleDropStatusSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      status: item.label,
    }));
  };

  const handleNextPage = () => {
    setCurPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurPage((prev) => prev - 1);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        search: searchTerm,
      }));
    }
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
      } catch (e) {
        console.error('failed to get nft metadata', e); // eslint-disable-line no-console
      }
      nftHref = nftMetadata?.media || 'assets/image-not-found.png';
    }

    return {
      id,
      name: truncateAddress(dropName, 'end', 48),
      type: type !== 'NFT' ? type?.toLowerCase() : type,
      media: nftHref,
      claimed: claimedText,
    };
  };

  const handleGetDrops = useCallback(async () => {
    setIsLoading(true);

    let drops = allOwnedDrops;
    if (allOwnedDrops.length === 0) {
      // First, determine the total number of drops
      const totalDrops = await keypomInstance.getDropSupplyForOwner({
        accountId,
      });
      const totalPages = Math.ceil(totalDrops / selectedFilters.pageSize);
      setHasPagination(totalPages > 1);
      setNumPages(totalPages);
      setWallet(await selector.wallet());

      // Create an array of page indices [0, 1, ..., totalPages - 1]
      const pageIndices = Array.from({ length: totalPages }, (_, index) => index);

      // Map each page index to a fetch promise
      const fetchPromises = pageIndices.map(
        async (pageIndex) =>
          await keypomInstance.getDrops({
            accountId: accountId!,
            start: pageIndex * selectedFilters.pageSize,
            limit: selectedFilters.pageSize,
            withKeys: false,
          }),
      );

      // Wait for all fetches to complete
      const allPagesDrops = await Promise.all(fetchPromises);
      // Flatten the array of pages into a single array of drops
      drops = allPagesDrops.flat();
      setAllOwnedDrops(drops);
    }

    // Apply the selected filters
    if (selectedFilters.type !== DROP_TYPE_OPTIONS.ANY) {
      drops = drops.filter(
        (drop) =>
          keypomInstance.getDropType(drop).toLowerCase() === selectedFilters.type.toLowerCase(),
      );
    }

    if (selectedFilters.status !== DROP_CLAIM_STATUS_OPTIONS.ANY) {
      // Convert each drop to a promise that resolves to either the drop or null
      const dropsPromises = drops.map(async (drop) => {
        const keysLeft = await keypomInstance.getAvailableKeys(drop.drop_id);
        const isFullyClaimed = keysLeft === 0;
        const isPartiallyClaimed = keysLeft > 0 && keysLeft < drop.next_key_id;
        const isUnclaimed = keysLeft === drop.next_key_id;

        if (
          (isFullyClaimed && selectedFilters.status === DROP_CLAIM_STATUS_OPTIONS.FULLY) ||
          (isPartiallyClaimed && selectedFilters.status === DROP_CLAIM_STATUS_OPTIONS.PARTIALLY) ||
          (isUnclaimed && selectedFilters.status === DROP_CLAIM_STATUS_OPTIONS.UNCLAIMED)
        ) {
          return drop;
        }
        return null;
      });

      // Wait for all promises to resolve, then filter out the nulls
      const resolvedDrops = await Promise.all(dropsPromises);
      drops = resolvedDrops.filter((drop): drop is ProtocolReturnedDrop => drop !== null);
    }

    if (selectedFilters.search.trim() !== '') {
      drops = drops.filter((drop) => {
        const { dropName } = keypomInstance.getDropMetadata(drop.metadata);
        return dropName.toLowerCase().includes(selectedFilters.search.toLowerCase());
      });
    }
    const totalPages = Math.ceil(drops.length / selectedFilters.pageSize);
    setHasPagination(totalPages > 1);
    setNumPages(totalPages);

    // Now, map over the filtered drops and set the data
    const dropData = await Promise.all(drops.map(setAllDropsData));
    setFilteredDataItems(dropData);
    setCurPage(0);
    setIsLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  useEffect(() => {
    if (!accountId) return;

    handleGetDrops();
  }, [accountId, selectedFilters]);

  const createDropMenuItems = CREATE_DROP_ITEMS.map((item) => (
    <MenuItem key={item.label} {...item}>
      {item.label}
    </MenuItem>
  ));

  const pageSizeMenuItems = PAGE_SIZE_ITEMS.map((item) => (
    <MenuItem
      key={item.label}
      onClick={() => {
        handlePageSizeSelect(item);
      }}
      {...item}
    >
      {item.label}
    </MenuItem>
  ));

  const filterDropMenuItems = DROP_TYPE_ITEMS.map((item) => (
    <MenuItem
      key={item.label}
      onClick={() => {
        handleDropTypeSelect(item);
      }}
      {...item}
    >
      {item.label}
    </MenuItem>
  ));

  const dropStatusMenuItems = DROP_CLAIM_STATUS_ITEMS.map((item) => (
    <MenuItem
      key={item.label}
      onClick={() => {
        handleDropStatusSelect(item);
      }}
      {...item}
    >
      {item.label}
    </MenuItem>
  ));

  const handleDeleteClick = (dropId: string | number) => {
    setConfirmationModalHelper(setAppModal, async () => {
      await keypomInstance.deleteDrops({
        wallet,
        dropIds: [dropId],
      });
      window.location.reload();
    });
  };

  const getTableRows = (): DataItem[] => {
    if (filteredDataItems === undefined || filteredDataItems.length === 0) return [];

    return filteredDataItems
      .slice(curPage * selectedFilters.pageSize, (curPage + 1) * selectedFilters.pageSize)
      .reduce((result: DataItem[], drop) => {
        if (drop !== null) {
          // show token drop manager for other drops type
          const dropType =
            (drop.type as string).toUpperCase() === DROP_TYPE.OTHER ? DROP_TYPE.TOKEN : drop.type;
          const dataItem = {
            ...drop,
            name: (
              <Text color="gray.800" fontWeight="medium">
                {drop.name}
              </Text>
            ),
            type: (
              <Text fontWeight="normal" mt="0.5" textTransform="capitalize">
                {drop.type}
              </Text>
            ),
            media: drop.media !== undefined && <Avatar src={drop.media as string} />,
            claimed: <Badge variant="lightgreen">{drop.claimed} Claimed</Badge>,
            action: (
              <Button
                borderRadius="6xl"
                size="md"
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

  const DropDownButton = ({
    isOpen,
    placeholder,
    variant,
  }: {
    isOpen: boolean;
    placeholder: string;
    variant: 'primary' | 'secondary';
  }) => (
    <MenuButton
      as={Button}
      color={variant === 'primary' ? 'white' : 'gray.400'}
      height="auto"
      isActive={isOpen}
      lineHeight=""
      px="6"
      py="3"
      rightIcon={<ChevronDownIcon color={variant === 'secondary' ? 'gray.800' : ''} />}
      variant={variant}
      onClick={() => (popoverClicked.current += 1)}
    >
      {placeholder}
    </MenuButton>
  );
  const CreateADropMobileButton = () => (
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
      Filter Options
    </Button>
  );

  const getTableType = () => {
    if (filteredDataItems.length === 0 && allOwnedDrops.length === 0) {
      return 'all-drops';
    }
    return 'no-filtered-drops';
  };

  return (
    <Box minH="100%" minW="100%">
      {/* Header Bar */}
      {/* Desktop Dropdown Menu */}
      <Show above="sm">
        <Heading py="4">All drops</Heading>
        <HStack alignItems="center" display="flex" spacing="auto">
          <HStack justify="space-between" w="full">
            <InputGroup width="300px">
              <InputLeftElement pointerEvents="none">
                <Icon as={SearchIcon} color="gray.400" />
              </InputLeftElement>
              <Input
                backgroundColor="white"
                border="2px solid"
                borderColor="gray.200"
                color="gray.400"
                fontSize="md"
                fontWeight="medium"
                height="auto"
                placeholder="Search..."
                px="6"
                py="3"
                sx={{
                  '::placeholder': {
                    color: 'gray.400', // Placeholder text color
                  },
                }}
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
            </InputGroup>
            <HStack>
              <Menu>
                {({ isOpen }) => (
                  <Box>
                    <DropDownButton
                      isOpen={isOpen}
                      placeholder={`Type: ${selectedFilters.type}`}
                      variant="secondary"
                    />
                    <MenuList minWidth="auto">{filterDropMenuItems}</MenuList>
                  </Box>
                )}
              </Menu>
              <Menu>
                {({ isOpen }) => (
                  <Box>
                    <DropDownButton
                      isOpen={isOpen}
                      placeholder={`Claimed: ${selectedFilters.status}`}
                      variant="secondary"
                    />
                    <MenuList minWidth="auto">{dropStatusMenuItems}</MenuList>
                  </Box>
                )}
              </Menu>
              <Show above="md">
                <Menu>
                  {({ isOpen }) => (
                    <Box>
                      <DropDownButton isOpen={isOpen} placeholder="Create drop" variant="primary" />
                      <MenuList minWidth="auto">{createDropMenuItems}</MenuList>
                    </Box>
                  )}
                </Menu>
              </Show>
            </HStack>
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
          </HStack>
        </VStack>
      </Show>

      <DataTable
        columns={COLUMNS}
        data={getTableRows()}
        loading={isLoading}
        mt={{ base: '6', md: '4' }}
        type={getTableType()}
      />

      {hasPagination && (
        <HStack justify="space-between" py="4" w="full">
          <HStack>
            <Show above="sm">
              <Heading color="gray.500" fontWeight="normal" size="sm">
                Rows per page
              </Heading>
            </Show>
            <Show below="sm">
              <Heading color="gray.500" fontWeight="normal" size="sm">
                Rows
              </Heading>
            </Show>
            <Menu>
              {({ isOpen }) => (
                <Box>
                  <DropDownButton
                    isOpen={isOpen}
                    placeholder={selectedFilters.pageSize.toString()}
                    variant="secondary"
                  />
                  <MenuList minWidth="auto">{pageSizeMenuItems}</MenuList>
                </Box>
              )}
            </Menu>
          </HStack>
          <HStack>
            <Heading color="gray.500" fontWeight="normal" size="sm">
              {curPage + 1} of {numPages === 0 ? 1 : numPages}
            </Heading>
            <PrevButton
              id="all-drops"
              isDisabled={curPage === 0}
              lineHeight=""
              variant="secondary"
              onClick={handlePrevPage}
            />
            <NextButton
              id="all-drops"
              isDisabled={curPage === numPages - 1}
              lineHeight=""
              variant="secondary"
              onClick={handleNextPage}
            />
          </HStack>
        </HStack>
      )}
      {/* Mobile Menu For Creating Drop */}
      <Show below="sm">
        <MobileDrawerMenu
          dropStatusMenuItems={dropStatusMenuItems}
          filterDropMenuItems={filterDropMenuItems}
          handleDropStatusSelect={handleDropStatusSelect}
          handleDropTypeSelect={handleDropTypeSelect}
          handleKeyDown={handleKeyDown}
          handleSearchChange={handleSearchChange}
          isOpen={isOpen}
          searchTerm={searchTerm}
          selectedFilters={selectedFilters}
          onClose={onClose}
        />
      </Show>
    </Box>
  );
}
