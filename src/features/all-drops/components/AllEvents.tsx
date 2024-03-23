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
  Skeleton,
  VStack,
  Image,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { type Wallet } from '@near-wallet-selector/core';

import keypomInstance from '@/lib/keypom';
import { PAGE_SIZE_LIMIT } from '@/constants/common';
import { useAppContext } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { type FunderEventMetadata } from '@/lib/eventsHelpers';
import { truncateAddress } from '@/utils/truncateAddress';
import { ShareIcon } from '@/components/Icons/ShareIcon';
import { DeleteIcon } from '@/components/Icons';
import useDeletion from '@/components/AppModal/useDeletion';
import { performDeletionLogic } from '@/components/AppModal/PerformDeletion';

import {
  DROP_TYPE_OPTIONS,
  DROP_CLAIM_STATUS_OPTIONS,
  DATE_FILTER_OPTIONS,
  PAGE_SIZE_ITEMS,
  DATE_FILTER_ITEMS,
  createMenuItems,
} from '../config/menuItems';

import { DropDownButton } from './DropDownButton';
import { MobileDrawerMenu } from './MobileDrawerMenu';
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
    id: 'dateCreated',
    title: 'Date created',
    selector: (drop) => drop.dateCreated,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'description',
    title: 'Description',
    selector: (drop) => drop.description,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: '',
    selector: (drop) => drop.action,
    loadingElement: <Skeleton height="30px" />,
  },
];

interface AllDropsProps {
  pageTitle: string;
  hasDateFilter: boolean;
  ctaButtonLabel: string;
}

export default function AllEvents({ pageTitle, hasDateFilter, ctaButtonLabel }: AllDropsProps) {
  const { setAppModal } = useAppContext();
  const navigate = useNavigate();

  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
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
  const [numOwnedEvents, setNumOwnedEvents] = useState<number>(0);
  const [filteredDataItems, setFilteredDataItems] = useState<DataItem[]>([]);
  const [wallet, setWallet] = useState<Wallet>();

  const { selector, accountId } = useAuthWalletContext();

  const formatDate = (date) => {
    // Create an instance of Intl.DateTimeFormat for formatting
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short', // Full month name.
      day: 'numeric', // Numeric day of the month.
      year: 'numeric', // Numeric full year.
      hour: 'numeric', // Numeric hour.
      minute: 'numeric', // Numeric minute.
      hour12: true, // Use 12-hour time.
    });
    return formatter.format(date);
  };

  const handlePageSizeSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      pageSize: parseInt(item.label),
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

  const handleFiltering = async (events: FunderEventMetadata[]) => {
    if (selectedFilters.search.trim() !== '') {
      events = events.filter((event) => {
        return (
          event.name.toLowerCase().includes(selectedFilters.search.toLowerCase()) ||
          event.description.toLowerCase().includes(selectedFilters.search.toLowerCase())
        );
      });
    }

    if (selectedFilters.date !== DATE_FILTER_OPTIONS.ANY) {
      events = events
        .filter((event) => {
          try {
            const date = new Date(parseInt(event.dateCreated));
            return date && !isNaN(date.getTime()); // Ensures dateCreated is valid
          } catch (e) {
            return false; // Exclude drops with malformed metadata
          }
        })
        .sort((a, b) => {
          // Assuming metadata has been validated, no need for try-catch here
          const dateA = new Date(parseInt(a.dateCreated)).getTime();
          const dateB = new Date(parseInt(b.dateCreated)).getTime();
          return selectedFilters.date === DATE_FILTER_OPTIONS.NEWEST
            ? dateB - dateA
            : dateA - dateB;
        });
    }

    return events;
  };

  const handleGetAllEvents = useCallback(async () => {
    setIsLoading(true);
    let eventDrops: FunderEventMetadata[] = [];
    try {
      eventDrops = await keypomInstance.getEventsForAccount({
        accountId: accountId!,
      });
    } catch (e) {
      console.error('Error fetching events:', e);
    }

    const numEvents = eventDrops.length;
    setNumOwnedEvents(numEvents);

    const filteredEvents = await handleFiltering(eventDrops);
    const dropData = filteredEvents.map((event: FunderEventMetadata) => {
      return {
        id: event.id,
        name: truncateAddress(event.name || 'Untitled', 'end', 48),
        media: event.artwork,
        dateCreated: formatDate(new Date(parseInt(event.dateCreated))), // Ensure drop has dateCreated or adjust accordingly
        description: truncateAddress(event.description, 'end', 12),
        eventId: event.id,
      };
    });

    setFilteredDataItems(dropData);

    const totalPages = Math.ceil(filteredEvents.length / selectedFilters.pageSize);
    setNumPages(totalPages);

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

    // In parallel, fetch all the drops
    handleGetAllEvents();
  }, [accountId, selectedFilters]);

  const pageSizeMenuItems = createMenuItems({
    menuItems: PAGE_SIZE_ITEMS,
    onClick: (item) => {
      handlePageSizeSelect(item);
    },
  });

  const filterDataMenuItems = createMenuItems({
    menuItems: DATE_FILTER_ITEMS,
    onClick: (item) => {
      handleDateSelect(item);
    },
  });

  const { openConfirmationModal } = useDeletion({
    setAppModal,
  });

  const handleDeleteClick = async (eventId: string) => {
    if (!wallet || !eventId) return;

    const ticketData = await keypomInstance.getTicketsForEventId({
      accountId: accountId!,
      eventId,
    });

    const deletionArgs = {
      wallet,
      accountId,
      navigate,
      eventId,
      ticketData,
      deleteAll: true,
      setAppModal,
    };

    // Open the confirmation modal with customization if needed
    openConfirmationModal(
      deletionArgs,
      'Are you sure you want to delete this event and all its tickets? This action cannot be undone.',
      performDeletionLogic,
    );
  };

  const getTableRows = (): DataItem[] => {
    if (filteredDataItems === undefined || filteredDataItems.length === 0) return [];

    const data = filteredDataItems
      .slice(curPage * selectedFilters.pageSize, (curPage + 1) * selectedFilters.pageSize)
      .reduce((result: DataItem[], drop) => {
        if (drop !== null) {
          // show token drop manager for other drops type
          const dataItem = {
            ...drop,
            name: (
              <HStack spacing={4}>
                <Image
                  alt={`Event image for ${drop.id}`}
                  borderRadius="12px"
                  boxSize="60px"
                  objectFit="cover"
                  src={drop.media as string}
                />
                <Text color="gray.800" fontWeight="medium">
                  {drop.name}
                </Text>
              </HStack>
            ),
            type: (
              <Text fontWeight="normal" mt="0.5" textTransform="capitalize">
                {drop.type}
              </Text>
            ),
            dateCreated: drop.dateCreated,
            numTickets: drop.numTickets,
            claimed: <Badge variant="lightgreen">{drop.claimed} Claimed</Badge>,
            action: (
              <HStack>
                <Button
                  borderRadius="6xl"
                  size="md"
                  variant="icon"
                  onClick={async (e) => {
                    e.stopPropagation();
                    handleDeleteClick(drop.id.toString());
                  }}
                >
                  <DeleteIcon color="red.400" />
                </Button>
                <Button
                  borderRadius="6xl"
                  size="md"
                  variant="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      `/gallery/${accountId}:${((drop.eventId as string) || '').toString()}`,
                    );
                  }}
                >
                  <ShareIcon color="gray.600" height="16px" width="16px" />
                </Button>
              </HStack>
            ),
            href: `/events/event/${((drop.eventId as string) || '').toString()}`,
          };
          return [...result, dataItem];
        }
        return result;
      }, []);
    return data;
  };

  const getTableType = () => {
    if (filteredDataItems.length === 0 && numOwnedEvents === 0) {
      return 'all-events';
    }
    return 'no-filtered-events';
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
                      placeholder={`Date: ${selectedFilters.type}`}
                      variant="secondary"
                      onClick={() => (popoverClicked.current += 1)}
                    />
                    <MenuList minWidth="auto">{filterDataMenuItems}</MenuList>
                  </Box>
                )}
              </Menu>
              <Button
                color={'white'}
                height="auto"
                isActive={isOpen}
                lineHeight=""
                px="6"
                py="3"
                variant={'primary'}
                onClick={() => {
                  navigate('/drop/ticket/new');
                }}
              >
                Create Event
              </Button>
            </HStack>
          </HStack>
        </HStack>
      </Show>

      {/* Mobile Menu */}
      <Hide above="md">
        <VStack spacing="20px">
          <Heading size="2xl" textAlign="left" w="full">
            My Events
          </Heading>

          <HStack align="stretch" justify="space-between" w="full">
            <FilterOptionsMobileButton
              buttonTitle="Filter Options"
              popoverClicked={popoverClicked}
              onOpen={onOpen}
            />
            <Button
              as={Button}
              color={'white'}
              height="auto"
              isActive={isOpen}
              lineHeight=""
              px="6"
              py="3"
              variant={'primary'}
              onClick={() => {
                navigate('/drop/ticket/new');
              }}
            >
              Create Event
            </Button>
          </HStack>
        </VStack>
      </Hide>

      <DataTable
        columns={COLUMNS}
        data={getTableRows()}
        excludeMobileColumns={[]}
        loading={isLoading}
        mt={{ base: '6', md: '4' }}
        showMobileTitles={['dateCreated', 'numTickets']}
        type={getTableType()}
      />

      <DropManagerPagination
        curPage={curPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        isLoading={isLoading}
        numPages={numPages}
        pageSizeMenuItems={pageSizeMenuItems}
        rowsSelectPlaceholder={selectedFilters.pageSize.toString()}
        onClickRowsSelect={() => (popoverClicked.current += 1)}
      />

      {/* Mobile Popup Menu For Filtering */}
      <MobileDrawerMenu
        filters={[
          {
            label: 'Date',
            value: selectedFilters.date,
            menuItems: filterDataMenuItems,
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
