import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Input,
  Hide,
  InputGroup,
  InputLeftElement,
  Icon,
  Button,
  Badge,
  Box,
  HStack,
  Menu,
  MenuList,
  Show,
  Text,
  useDisclosure,
  Heading,
  Avatar,
  Skeleton,
  VStack,
} from '@chakra-ui/react';
import { type ProtocolReturnedDrop } from 'keypom-js';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

import { PAGE_SIZE_LIMIT, DROP_TYPE } from '@/constants/common';
import { useAppContext } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { DeleteIcon } from '@/components/Icons';
import keypomInstance from '@/lib/keypom';

import {
  DROP_TYPE_OPTIONS,
  DROP_CLAIM_STATUS_OPTIONS,
  DATE_FILTER_OPTIONS,
  DROP_CLAIM_STATUS_ITEMS,
  PAGE_SIZE_ITEMS,
  DROP_TYPE_ITEMS,
  DATE_FILTER_ITEMS,
  CREATE_DROP_ITEMS,
  createMenuItems,
} from '../config/menuItems';

import { DropDownButton } from './DropDownButton';
import { MobileDrawerMenu } from './MobileDrawerMenu';
import { setConfirmationModalHelper } from './ConfirmationModal';
import { DropManagerPagination } from './DropManagerPagination';
import { FilterOptionsMobileButton } from './FilterOptionsMobileButton';

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

interface AllDropsProps {
  pageTitle: string;
  hasDateFilter: boolean;
  ctaButtonLabel: string;
}

export default function AllDrops({ pageTitle, hasDateFilter, ctaButtonLabel }: AllDropsProps) {
  const { setAppModal } = useAppContext();
  const navigate = useNavigate();

  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllDropsLoading, setIsAllDropsLoading] = useState(true);
  const popoverClicked = useRef(0);

  const [selectedFilters, setSelectedFilters] = useState<{
    type: string;
    search: string;
    status: string;
    date: string;
    pageSize: number;
  }>({
    type: DROP_TYPE_OPTIONS.ANY,
    search: '',
    date: DATE_FILTER_OPTIONS.ANY,
    status: DROP_CLAIM_STATUS_OPTIONS.ANY,
    pageSize: PAGE_SIZE_LIMIT,
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [numOwnedDrops, setNumOwnedDrops] = useState<number>(0);
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

  const handleDateSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      date: item.label,
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

  const handleFiltering = async (drops) => {
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

    if (selectedFilters.date !== DATE_FILTER_OPTIONS.ANY) {
      drops = drops
        .filter((drop: ProtocolReturnedDrop) => {
          try {
            const dropMeta = JSON.parse(drop.metadata || '{}');
            const date = new Date(dropMeta.dateCreated);
            return dropMeta.dateCreated && !isNaN(date.getTime()); // Ensures dateCreated is valid
          } catch (e) {
            return false; // Exclude drops with malformed metadata
          }
        })
        .sort((a, b) => {
          // Assuming metadata has been validated, no need for try-catch here
          const dateA = new Date(JSON.parse(a.metadata).dateCreated).getTime();
          const dateB = new Date(JSON.parse(b.metadata).dateCreated).getTime();
          return selectedFilters.date === DATE_FILTER_OPTIONS.NEWEST
            ? dateB - dateA
            : dateA - dateB;
        });
    }

    return drops;
  };

  const handleGetAllDrops = useCallback(async () => {
    setIsAllDropsLoading(true);

    const drops = await keypomInstance.getAllDrops({
      accountId: accountId!,
    });

    const filteredDrops = await handleFiltering(drops);
    const dropData = await Promise.all(
      filteredDrops.map(async (drop) => await keypomInstance.getDropData({ drop })),
    );
    setFilteredDataItems(dropData);

    const totalPages = Math.ceil(filteredDrops.length / selectedFilters.pageSize);
    setNumPages(totalPages);

    setCurPage(0);
    setIsAllDropsLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  const handleGetInitialDrops = useCallback(async () => {
    setIsLoading(true);

    // First get the total supply of drops so we know when to stop fetching
    const totalSupply = await keypomInstance.getDropSupplyForOwner({ accountId: accountId! });
    setNumOwnedDrops(totalSupply);

    // Loop until we have enough filtered drops to fill the page size
    let dropsFetched = 0;
    let filteredDrops: ProtocolReturnedDrop[] = [];
    while (dropsFetched < totalSupply && filteredDrops.length < selectedFilters.pageSize) {
      const drops = await keypomInstance.getPaginatedDrops({
        accountId: accountId!,
        start: dropsFetched,
        limit: selectedFilters.pageSize,
      });
      dropsFetched += drops.length;

      const curFiltered = await handleFiltering(drops);
      filteredDrops = filteredDrops.concat(curFiltered);
    }

    // Now, map over the filtered drops and set the data
    const dropData = await Promise.all(
      filteredDrops.map(async (drop) => await keypomInstance.getDropData({ drop })),
    );

    if (filteredDataItems.length === 0) {
      setFilteredDataItems(dropData);
    }
    setCurPage(0);
    setIsLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  useEffect(() => {
    async function fetchWallet() {
      if (!selector) return;
      try {
        const wallet = await selector.wallet();
        setWallet(wallet);
      } catch (error) {
        console.error('Error fetching wallet:', error);
        // Handle the error appropriately
      }
    }

    fetchWallet();
  }, [selector]);

  useEffect(() => {
    if (!accountId) return;

    // First get enough data with the current filters to fill the page size
    handleGetInitialDrops();
  }, [accountId]);

  useEffect(() => {
    if (!accountId) return;

    // In parallel, fetch all the drops
    handleGetAllDrops();
  }, [accountId, selectedFilters]);

  const createDropMenuItems = createMenuItems({
    menuItems: CREATE_DROP_ITEMS,
    onClick: (item) => {
      navigate(item.label.includes('NFT') ? '/drop/nft/new' : '/drop/token/new');
    },
  });

  const pageSizeMenuItems = createMenuItems({
    menuItems: PAGE_SIZE_ITEMS,
    onClick: (item) => {
      handlePageSizeSelect(item);
    },
  });

  const filterDropMenuItems = createMenuItems({
    menuItems: DROP_TYPE_ITEMS,
    onClick: (item) => {
      handleDropTypeSelect(item);
    },
  });

  const filterDataMenuItems = createMenuItems({
    menuItems: DATE_FILTER_ITEMS,
    onClick: (item) => {
      handleDateSelect(item);
    },
  });

  const dropStatusMenuItems = createMenuItems({
    menuItems: DROP_CLAIM_STATUS_ITEMS,
    onClick: (item) => {
      handleDropStatusSelect(item);
    },
  });

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
                <DeleteIcon color="red.400" />
              </Button>
            ),
            href: `/drop/${(dropType as string).toLowerCase()}/${drop.id}`,
          };
          return [...result, dataItem];
        }
        return result;
      }, []);
  };

  const getTableType = () => {
    if (filteredDataItems.length === 0 && numOwnedDrops === 0) {
      return 'all-drops';
    }
    return 'no-filtered-drops';
  };

  return (
    <Box minH="100%" minW="100%">
      {/* Desktop Menu */}
      <Show above="md">
        <Heading py="4">{pageTitle}</Heading>
        <HStack alignItems="center" display="flex" spacing="auto">
          <HStack align="stretch" justify="space-between" w="full">
            <InputGroup width="300px">
              <InputLeftElement height="full" pointerEvents="none">
                <Icon as={SearchIcon} color="gray.400" />
              </InputLeftElement>
              <Input
                backgroundColor="white"
                border="2px solid"
                borderColor="gray.200"
                color="gray.400"
                fontSize="md"
                fontWeight="medium"
                height="full"
                placeholder="Search..."
                px="6"
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
                      onClick={() => (popoverClicked.current += 1)}
                    />
                    <MenuList minWidth="auto">{filterDropMenuItems}</MenuList>
                  </Box>
                )}
              </Menu>
              {hasDateFilter && (
                <Menu>
                  {({ isOpen }) => (
                    <Box>
                      <DropDownButton
                        isOpen={isOpen}
                        placeholder={`Date: ${selectedFilters.type}`}
                        variant="secondary"
                        onClick={() => (popoverClicked.current += 1)}
                      />
                      <MenuList minWidth="auto">{filterDataMenuItems}</MenuList>
                    </Box>
                  )}
                </Menu>
              )}
              <Menu>
                {({ isOpen }) => (
                  <Box>
                    <DropDownButton
                      isOpen={isOpen}
                      placeholder={`Claimed: ${selectedFilters.status}`}
                      variant="secondary"
                      onClick={() => (popoverClicked.current += 1)}
                    />
                    <MenuList minWidth="auto">{dropStatusMenuItems}</MenuList>
                  </Box>
                )}
              </Menu>
              <Menu>
                {({ isOpen }) => (
                  <Box>
                    <DropDownButton
                      isOpen={isOpen}
                      placeholder={ctaButtonLabel}
                      variant="primary"
                      onClick={() => (popoverClicked.current += 1)}
                    />
                    <MenuList minWidth="auto">{createDropMenuItems}</MenuList>
                  </Box>
                )}
              </Menu>
            </HStack>
          </HStack>
        </HStack>
      </Show>

      {/* Mobile Menu */}
      <Hide above="md">
        <VStack spacing="20px">
          <Heading size="2xl" textAlign="left" w="full">
            All drops
          </Heading>

          <HStack align="stretch" justify="space-between" w="full">
            <FilterOptionsMobileButton
              buttonTitle="Filter Options"
              popoverClicked={popoverClicked}
              onOpen={onOpen}
            />
            <Menu>
              {({ isOpen }) => (
                <Box>
                  <DropDownButton
                    isOpen={isOpen}
                    placeholder={ctaButtonLabel}
                    variant="primary"
                    onClick={() => (popoverClicked.current += 1)}
                  />
                  <MenuList minWidth="auto">{createDropMenuItems}</MenuList>
                </Box>
              )}
            </Menu>
          </HStack>
        </VStack>
      </Hide>

      <DataTable
        columns={COLUMNS}
        data={getTableRows()}
        excludeMobileColumns={[]}
        loading={isLoading}
        mt={{ base: '6', md: '4' }}
        showMobileTitles={[]}
        type={getTableType()}
      />

      <DropManagerPagination
        curPage={curPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        isLoading={isAllDropsLoading}
        numPages={numPages}
        pageSizeMenuItems={pageSizeMenuItems}
        rowsSelectPlaceholder={selectedFilters.pageSize.toString()}
        type={'Rows'}
        onClickRowsSelect={() => (popoverClicked.current += 1)}
      />

      {/* Mobile Popup Menu For Filtering */}
      <MobileDrawerMenu
        filters={[
          {
            label: 'Type',
            value: selectedFilters.type,
            menuItems: filterDropMenuItems,
          },
          ...(hasDateFilter
            ? [
                {
                  label: 'Date',
                  value: selectedFilters.date,
                  menuItems: filterDataMenuItems,
                },
              ]
            : []),
          {
            label: 'Claimed',
            value: selectedFilters.status,
            menuItems: dropStatusMenuItems,
          },
        ]}
        handleKeyDown={handleKeyDown}
        handleSearchChange={handleSearchChange}
        isOpen={isOpen}
        searchTerm={searchTerm}
        title="Filter Options"
        onClose={onClose}
      />
    </Box>
  );
}
