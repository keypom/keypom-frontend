import {
  Box,
  Input,
  Badge,
  Icon,
  Button,
  Heading,
  Hide,
  HStack,
  Image,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuList,
  Show,
  Skeleton,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';

import { truncateAddress } from '@/utils/truncateAddress';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import keypomInstance, { type AttendeeKeyItem } from '@/lib/keypom';
import { type QuestionInfo, type EventDropMetadata } from '@/lib/eventsHelpers';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DropDownButton } from '@/features/all-drops/components/DropDownButton';
import { FilterOptionsMobileButton } from '@/features/all-drops/components/FilterOptionsMobileButton';
import { DataTable } from '@/components/Table';
import { DropManagerPagination } from '@/features/all-drops/components/DropManagerPagination';
import { MobileDrawerMenu } from '@/features/all-drops/components/MobileDrawerMenu';
import { PAGE_SIZE_LIMIT } from '@/constants/common';
import {
  createMenuItems,
  PAGE_SIZE_ITEMS,
  TICKET_CLAIM_STATUS_ITEMS,
  TICKET_CLAIM_STATUS_OPTIONS,
} from '@/features/all-drops/config/menuItems';
import { file } from '@/utils/file';

const ticketTableColumns: ColumnItem[] = [
  {
    id: 'link',
    title: 'Link',
    selector: (row) => row.link,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'status',
    title: 'Status',
    selector: (row) => row.claimedStatus,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: '',
    selector: (row) => row.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
      verticalAlign: 'middle',
    },
    loadingElement: <Skeleton height="30px" />,
  },
];

const CLAIM_STATUS = {
  2: {
    name: 'Purchased',
    bg: 'gray.100',
    text: 'gray.600',
  },
  1: {
    name: 'Scanned',
    bg: 'green.50',
    text: 'green.600',
  },
};

export interface AttendeeItem {
  id: string;
  usesRemaining: number;
  publicKey: string;
  responses: Record<string, string>;
}

export type GetAttendeeDataFn = (data: AttendeeItem[]) => DataItem[];

export default function EventManagerPage() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { id: dropId = '' } = useParams();
  const [eventMetadata, setEventMetadata] = useState<EventDropMetadata>();
  const [ticketsPurchased, setTicketsPurchased] = useState<number>(0);
  const [tableColumns, setTableColumns] = useState<ColumnItem[]>(ticketTableColumns);
  const [ticketsScanned, setTicketsScanned] = useState<number>(0);
  const [dropData, setDropData] = useState<{
    drop_id: string;
    funder_id: string;
    drop_config: { metadata: EventDropMetadata };
  }>();

  const [exporting, setExporting] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);
  const [filteredTicketData, setFilteredTicketData] = useState<AttendeeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllKeysLoading, setIsAllKeysLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedFilters, setSelectedFilters] = useState<{
    search: string;
    status: string;
    pageSize: number;
  }>({
    search: '',
    status: TICKET_CLAIM_STATUS_OPTIONS.ANY,
    pageSize: PAGE_SIZE_LIMIT,
  });

  const popoverClicked = useRef(0);

  const { selector, accountId } = useAuthWalletContext();

  useEffect(() => {
    if (dropId === '') navigate('/drops');
    if (!accountId) return;
    if (!dropId) return;

    const getEventData = async () => {
      const drop: { drop_id: string; funder_id: string; drop_config: { metadata: string } } =
        await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: dropId },
        });
      const metadata: EventDropMetadata = JSON.parse(drop.drop_config.metadata);
      setDropData({ ...drop, drop_config: { metadata } });
      const eventDrop = await keypomInstance.getEventDrop({
        accountId,
        eventId: metadata.ticketInfo.eventId,
      });
      const eventMetadata: EventDropMetadata = JSON.parse(eventDrop.drop_config.metadata);

      // Initialize an array to hold the new columns based on questions
      const questionColumns: ColumnItem[] =
        eventMetadata.eventInfo?.questions
          ?.filter(
            (questionInfo: QuestionInfo) =>
              questionInfo.question.toLowerCase().includes('name') ||
              questionInfo.question.toLowerCase().includes('email'),
          )
          .map((questionInfo) => ({
            id: questionInfo.question, // Using the question text as a unique ID
            title: questionInfo.question, // The question text as the title
            selector: (row) => row[questionInfo.question] || '-', // Accessing the response using the question
            loadingElement: <Skeleton height="30px" />,
          })) || [];

      setTableColumns((prevColumns) => [...questionColumns, ...prevColumns]);
      setEventMetadata(eventMetadata);
    };
    getEventData();
  }, [dropId, selector, accountId]);

  useEffect(() => {
    if (dropId === '') navigate('/drops');
    if (!accountId) return;
    if (!dropId) return;

    const getEventData = async () => {
      const drop: { drop_id: string; funder_id: string; drop_config: { metadata: string } } =
        await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: dropId },
        });
      const metadata: EventDropMetadata = JSON.parse(drop.drop_config.metadata);
      setDropData({ ...drop, drop_config: { metadata } });
      const eventDrop = await keypomInstance.getEventDrop({
        accountId,
        eventId: metadata.ticketInfo.eventId,
      });
      const eventMetadata: EventDropMetadata = JSON.parse(eventDrop.drop_config.metadata);
      setEventMetadata(eventMetadata);
    };
    getEventData();
  }, [dropId, selector, accountId]);

  useEffect(() => {
    if (dropId === '') navigate('/drops');
    if (!accountId) return;
    if (!dropId) return;

    const getTicketsPurchased = async () => {
      const numKeys = await keypomInstance.viewCall({
        methodName: 'get_key_supply_for_drop',
        args: { drop_id: dropId },
      });
      setTicketsPurchased(numKeys);
    };
    getTicketsPurchased();
  }, [dropId, selector, accountId]);

  useEffect(() => {
    if (!accountId || !dropId) return;

    // First get enough data with the current filters to fill the page size
    handleGetInitialKeys();
  }, [accountId]);

  useEffect(() => {
    if (!accountId || !dropId) return;

    // In parallel, fetch all the drops
    handleGetAllKeys();
  }, [accountId, selectedFilters]);

  const handleFiltering = (keys: AttendeeKeyItem[]) => {
    if (selectedFilters.status !== TICKET_CLAIM_STATUS_OPTIONS.ANY) {
      keys = keys.filter((key) => {
        if (selectedFilters.status === TICKET_CLAIM_STATUS_OPTIONS.PURCHASED) {
          return key.uses_remaining === 2;
        }
        return key.uses_remaining !== 2;
      });
    }

    if (selectedFilters.search.trim() !== '') {
      keys = keys.filter((key) => {
        const metadata = JSON.parse(key.metadata);
        const answers: string[] = Object.values(metadata.questions); // Extracts all answers to the questions

        // Check if any answer includes the search term
        return answers.some((answer) => answer.includes(selectedFilters.search.trim()));
      });
    }

    return keys.map((key) => {
      const responses: Record<string, string> = JSON.parse(key.metadata).questions;
      return {
        id: key.pub_key,
        usesRemaining: key.uses_remaining,
        publicKey: key.pub_key,
        responses,
      };
    });
  };

  const handleGetAllKeys = useCallback(async () => {
    setIsAllKeysLoading(true);
    const keyInfoReturn = await keypomInstance.getAllKeysForTicket({ dropId });
    const { dropKeyItems } = keyInfoReturn;

    const numScanned = dropKeyItems.filter((key) => {
      return key.uses_remaining !== 2;
    }).length;
    setTicketsScanned(numScanned);

    const filteredKeys = handleFiltering(dropKeyItems);

    const totalPages = Math.ceil(filteredKeys.length / selectedFilters.pageSize);
    setNumPages(totalPages);

    setCurPage(0);
    setFilteredTicketData(filteredKeys);
    setIsAllKeysLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  const handleGetInitialKeys = useCallback(async () => {
    setIsLoading(true);

    // Initialize or update the cache for this drop if it doesn't exist or if total keys have changed
    const dropInfo = await keypomInstance.viewCall({
      methodName: 'get_drop_information',
      args: { drop_id: dropId },
    });
    const totalKeySupply = dropInfo.next_key_id;

    // Loop until we have enough filtered drops to fill the page size
    let keysFetched = 0;
    let filteredKeys: AttendeeItem[] = [];
    while (keysFetched < totalKeySupply && filteredKeys.length < selectedFilters.pageSize) {
      const dropKeyItems = await keypomInstance.getPaginatedKeysForTicket({
        dropId,
        start: keysFetched,
        limit: selectedFilters.pageSize,
      });

      keysFetched += dropKeyItems.length;

      const curFiltered = handleFiltering(dropKeyItems);
      filteredKeys = filteredKeys.concat(curFiltered);
    }

    if (filteredTicketData.length !== 0) {
      setFilteredTicketData(filteredKeys);
    }
    setCurPage(0);
    setIsLoading(false);
  }, [accountId, keypomInstance]);

  const pageSizeMenuItems = createMenuItems({
    menuItems: PAGE_SIZE_ITEMS,
    onClick: (item) => {
      handlePageSizeSelect(item);
    },
  });

  const ticketClaimStatusMenuItems = createMenuItems({
    menuItems: TICKET_CLAIM_STATUS_ITEMS,
    onClick: (item) => {
      handleTicketClaimStatusSelect(item);
    },
  });

  const handleTicketClaimStatusSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      status: item.label,
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setSelectedFilters((prevFilters) => ({
        ...prevFilters,
        search: searchTerm,
      }));
    }
  };

  const handlePageSizeSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      pageSize: parseInt(item.label),
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

  const handleExportCSVClick = async () => {
    const data = await keypomInstance.getAllKeysForTicket({ dropId });
    if (data.dropKeyItems.length > 0) {
      setExporting(true);

      try {
        const links = await keypomInstance.getLinksToExport(dropId);
        file(`Drop ID ${data[0].dropId as string}.csv`, links.join('\r\n'));
      } catch (e) {
        console.error('error', e);
      } finally {
        setExporting(false);
      }
    }
  };

  const getTableRows: GetAttendeeDataFn = (data) => {
    if (data === undefined) return [];
    return data.map((item) => {
      console.log('item', item);
      const mapped = {
        id: item.id, // Assuming `item` has a `drop_id` property that can serve as `id`
        link: truncateAddress(
          `${window.location.hostname}/${item.publicKey.split('ed25519:')[1]}`,
          'end',
          16,
        ),
        claimedStatus: (
          <Badge
            backgroundColor={CLAIM_STATUS[item.usesRemaining].bg}
            borderRadius="20px"
            color={CLAIM_STATUS[item.usesRemaining].text}
            fontSize="15px"
            fontWeight="medium"
          >
            {CLAIM_STATUS[item.usesRemaining].name}
          </Badge>
        ),
        action: (
          <Heading
            _hover={{
              textDecoration: 'underline', // If you want underline on hover
              color: 'blue.600', // A darker color on hover
            }}
            color="blue.500"
            cursor="pointer"
            fontFamily="body"
            fontSize="sm"
            fontWeight="medium"
            onClick={() => {
              console.log('View details');
            }}
          >
            View details
          </Heading>
        ),
      };

      for (const [key, value] of Object.entries(item.responses)) {
        if (!Object.hasOwn(mapped, key)) {
          mapped[key] = truncateAddress(value, 'end', 16);
        }
      }
      return mapped;
    });
  };

  const data = useMemo(() => {
    const rowsToShow = filteredTicketData.slice(
      curPage * selectedFilters.pageSize,
      (curPage + 1) * selectedFilters.pageSize,
    );
    console.log(
      'filteredTicketData',
      filteredTicketData,
      ' numPages',
      numPages,
      ' curPage',
      curPage,
      ' rowsToShow',
      rowsToShow,
    );
    return getTableRows(rowsToShow);
  }, [filteredTicketData, filteredTicketData.length, curPage]);

  const getTableType = () => {
    if (filteredTicketData.length === 0 && ticketsPurchased === 0) {
      return 'all-tickets';
    }
    return 'no-filtered-tickets';
  };

  const breadcrumbItems = [
    {
      name: 'My events',
      href: '/events',
    },
    {
      name: eventMetadata?.eventInfo?.name || '',
      href: `/events/event/${eventMetadata?.ticketInfo.eventId || ''}`,
    },
    {
      name: dropData?.drop_config.metadata.ticketInfo.name || '',
      href: '',
    },
  ];

  const allowAction = filteredTicketData.length > 0;

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <Breadcrumbs items={breadcrumbItems} />
      {/* Drop info section */}
      <VStack align="start" paddingTop="4" spacing="4">
        <HStack>
          {!dropData?.drop_config.metadata.ticketInfo.artwork ? (
            <Spinner />
          ) : (
            <Image
              alt={`Drop image for ${dropData?.drop_id}`}
              borderRadius="12px"
              boxSize="150px"
              objectFit="cover"
              src={dropData?.drop_config.metadata.ticketInfo.artwork} // Use dropData.media or fallback to placeholder
            />
          )}
          <VStack align="start">
            <Heading fontFamily="" size="sm">
              Ticket name
            </Heading>
            <Heading size="lg">{dropData?.drop_config.metadata.ticketInfo.name} </Heading>
          </VStack>
        </HStack>
        <HStack justify="space-between" w="100%">
          <Box
            bg="border.box"
            border="2px solid transparent"
            borderRadius="12"
            borderWidth="2px"
            p={4}
            w="40%" // Adjust based on your layout, 'fit-content' makes the box to fit its content size
          >
            <VStack align="start" spacing={1}>
              {' '}
              {/* Adjust spacing as needed */}
              <Text color="gray.700" fontSize="lg" fontWeight="medium">
                Purchased
              </Text>
              <Heading>{ticketsPurchased}</Heading>
            </VStack>
          </Box>
          <Box
            bg="border.box"
            border="2px solid transparent"
            borderRadius="12"
            borderWidth="2px"
            p={4}
            w="40%" // Adjust based on your layout, 'fit-content' makes the box to fit its content size
          >
            <VStack align="start" spacing={1}>
              {' '}
              {/* Adjust spacing as needed */}
              <Text color="gray.700" fontSize="lg" fontWeight="medium">
                Scanned
              </Text>
              <Heading>{ticketsScanned}</Heading>
            </VStack>
          </Box>
        </HStack>
      </VStack>

      {/* Desktop Menu */}
      <Show above="md">
        <Heading py="4">All attendees</Heading>
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
                  <Box height="60px" paddingBottom="0">
                    <DropDownButton
                      isOpen={isOpen}
                      placeholder={`Claimed: ${selectedFilters.status}`}
                      variant="secondary"
                      onClick={() => (popoverClicked.current += 1)}
                    />
                    <MenuList minWidth="auto">{ticketClaimStatusMenuItems}</MenuList>
                  </Box>
                )}
              </Menu>
              <Button
                height="auto"
                isDisabled={!allowAction}
                isLoading={exporting}
                lineHeight=""
                px="6"
                variant="secondary"
                w={{ sm: 'initial' }}
                onClick={handleExportCSVClick}
              >
                Export .CSV
              </Button>
            </HStack>
          </HStack>
        </HStack>
      </Show>

      {/* Mobile Menu */}
      <Hide above="md">
        <VStack>
          <Heading paddingTop="20px" size="2xl" textAlign="left" w="full">
            All Keys
          </Heading>

          <HStack align="stretch" justify="space-between" w="full">
            <FilterOptionsMobileButton
              buttonTitle="More Options"
              popoverClicked={popoverClicked}
              onOpen={onOpen}
            />
            <Button
              height="auto"
              isDisabled={!allowAction}
              isLoading={exporting}
              lineHeight=""
              px="6"
              variant="secondary"
              w={{ sm: 'initial' }}
              onClick={handleExportCSVClick}
            >
              Export .CSV
            </Button>
          </HStack>
        </VStack>
      </Hide>

      <Box>
        <DataTable
          columns={tableColumns}
          data={data}
          loading={isLoading}
          mt={{ base: '6', md: '4' }}
          showColumns={true}
          type={getTableType()}
        />

        <DropManagerPagination
          curPage={curPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          isLoading={isAllKeysLoading}
          numPages={numPages}
          pageSizeMenuItems={pageSizeMenuItems}
          rowsSelectPlaceholder={selectedFilters.pageSize.toString()}
          onClickRowsSelect={() => (popoverClicked.current += 1)}
        />
      </Box>

      {/* Mobile Popup Menu For Filtering */}
      <MobileDrawerMenu
        filters={[
          {
            label: 'Status',
            value: selectedFilters.status,
            menuItems: ticketClaimStatusMenuItems,
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
