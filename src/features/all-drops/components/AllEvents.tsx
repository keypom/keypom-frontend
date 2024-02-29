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

import { PAGE_SIZE_LIMIT } from '@/constants/common';
import { useAppContext } from '@/contexts/AppContext';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import keypomInstance, { type EventDrop } from '@/lib/keypom';
import { type EventDropMetadata } from '@/lib/eventsHelpers';
import { truncateAddress } from '@/utils/truncateAddress';
import { ShareIcon } from '@/components/Icons/ShareIcon';
import { DeleteIcon } from '@/components/Icons';

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
    id: 'dateCreated',
    title: 'Date created',
    selector: (drop) => drop.dateCreated,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'numTickets',
    title: 'Ticket Types',
    selector: (drop) => drop.numTickets,
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

export default function AllEvents({ pageTitle, hasDateFilter, ctaButtonLabel }: AllDropsProps) {
  const { setAppModal } = useAppContext();
  const navigate = useNavigate();

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
  const [wallet, setWallet] = useState({});

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

  const handleFiltering = async (drops: EventDrop[]) => {
    if (selectedFilters.search.trim() !== '') {
      drops = drops.filter((drop) => {
        const { dropName } = JSON.parse(drop.drop_config.metadata);
        return dropName.toLowerCase().includes(selectedFilters.search.toLowerCase());
      });
    }

    if (selectedFilters.date !== DATE_FILTER_OPTIONS.ANY) {
      drops = drops
        .filter((drop) => {
          try {
            const { dateCreated } = JSON.parse(drop.drop_config.metadata);
            const date = new Date(dateCreated);
            return date && !isNaN(date.getTime()); // Ensures dateCreated is valid
          } catch (e) {
            return false; // Exclude drops with malformed metadata
          }
        })
        .sort((a, b) => {
          // Assuming metadata has been validated, no need for try-catch here
          const dateA = new Date(JSON.parse(a.drop_config.metadata).dateCreated).getTime();
          const dateB = new Date(JSON.parse(b.drop_config.metadata).dateCreated).getTime();
          return selectedFilters.date === DATE_FILTER_OPTIONS.NEWEST
            ? dateB - dateA
            : dateA - dateB;
        });
    }

    return drops;
  };

  const handleGetAllEvents = useCallback(async () => {
    setIsLoading(true);
    const eventDrops = await keypomInstance.getAllEventDrops({
      accountId: accountId!,
    });

    const numEvents = eventDrops.length;
    setNumOwnedEvents(numEvents);

    const filteredEvents = await handleFiltering(eventDrops);
    const dropDataPromises = filteredEvents.map(async (drop: EventDrop) => {
      const meta: EventDropMetadata = JSON.parse(drop.drop_config.metadata);
      const tickets = await keypomInstance.getTicketsForEvent({
        accountId: accountId!,
        eventId: meta.ticketInfo.eventId,
      });
      const numTickets = tickets.length;
      return {
        id: drop.drop_id,
        name: truncateAddress(meta.eventInfo?.name || 'Untitled', 'end', 48),
        media: meta.eventInfo?.artwork,
        dateCreated: formatDate(new Date(meta.dateCreated)), // Ensure drop has dateCreated or adjust accordingly
        numTickets,
        eventId: meta.ticketInfo.eventId,
      };
    });

    // Use Promise.all to wait for all promises to resolve
    const dropData = await Promise.all(dropDataPromises);

    setFilteredDataItems(dropData);

    const totalPages = Math.ceil(filteredEvents.length / selectedFilters.pageSize);
    setHasPagination(totalPages > 1);
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
              <>
                <HStack>
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
                  <Button
                    borderRadius="6xl"
                    size="md"
                    variant="icon"
                    onClick={() => {
                      navigate(`/gallery/event/${((drop.eventId as string) || '').toString()}`);
                    }}
                  >
                    <ShareIcon color="gray.600" height="16px" width="16px" />
                  </Button>
                </HStack>
              </>
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
        loading={isLoading}
        mt={{ base: '6', md: '4' }}
        type={getTableType()}
      />

      <DropManagerPagination
        curPage={curPage}
        handleNextPage={handleNextPage}
        handlePrevPage={handlePrevPage}
        hasPagination={hasPagination}
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
