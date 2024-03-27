import {
  Box,
  Input,
  Divider,
  Badge,
  Icon,
  Button,
  Heading,
  Hide,
  HStack,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  ModalContent,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchIcon } from '@chakra-ui/icons';

import { get } from '@/utils/localStorage';
import { truncateAddress } from '@/utils/truncateAddress';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import keypomInstance, { type AttendeeKeyItem } from '@/lib/keypom';
import {
  type QuestionInfo,
  type FunderEventMetadata,
  type EventDrop,
  type TicketMetadataExtra,
} from '@/lib/eventsHelpers';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DropDownButton } from '@/features/all-drops/components/DropDownButton';
import { FilterOptionsMobileButton } from '@/features/all-drops/components/FilterOptionsMobileButton';
import { DataTable } from '@/components/Table';
import { DropManagerPagination } from '@/features/all-drops/components/DropManagerPagination';
import { MobileDrawerMenu } from '@/features/all-drops/components/MobileDrawerMenu';
import { CLOUDFLARE_IPFS, MASTER_KEY, PAGE_SIZE_LIMIT } from '@/constants/common';
import {
  createMenuItems,
  PAGE_SIZE_ITEMS,
  TICKET_CLAIM_STATUS_ITEMS,
  TICKET_CLAIM_STATUS_OPTIONS,
} from '@/features/all-drops/config/menuItems';
import { useAppContext } from '@/contexts/AppContext';
import { NotFound404 } from '@/components/NotFound404';

import { handleExportCSVClick } from '../../components/ExportToCsv';

const ticketTableColumns: ColumnItem[] = [
  {
    id: 'ticketId',
    title: 'Ticket ID',
    selector: (row) => row.ticketId,
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

export const CLAIM_STATUS = {
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

export default function TicketManagerPage() {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setAppModal } = useAppContext();

  const { id: dropId = '' } = useParams();
  const [isErr, setIsErr] = useState(false);
  const [isCorrectMasterKey, setIsCorrectMasterKey] = useState(true);
  const [eventInfo, setEventInfo] = useState<FunderEventMetadata>();
  const [dataTableQuestionIds, setDataTableQuestionIds] = useState<string[]>([]);
  const [ticketsPurchased, setTicketsPurchased] = useState<number>(0);
  const [tableColumns, setTableColumns] = useState<ColumnItem[]>(ticketTableColumns);
  const [ticketsScanned, setTicketsScanned] = useState<number>(0);
  const [dropData, setDropData] = useState<EventDrop>();

  const [exporting, setExporting] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);
  const [filteredTicketData, setFilteredTicketData] = useState<AttendeeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAllKeysLoading, setIsAllKeysLoading] = useState(true);
  const [allowExport, setAllowExport] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [userKey, setUserKey] = useState();
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

  const handleClosePwModal = () => {
    setAppModal({ isOpen: false });
    navigate(eventInfo ? `/events/event/${eventInfo.id}` : `/events`);
  };

  useEffect(() => {
    setAllowExport(
      filteredTicketData.length > 0 && (eventInfo!.questions || []).length > 0
        ? userKey !== undefined
        : true,
    );
  }, [filteredTicketData, userKey, eventInfo]);

  useEffect(() => {
    if (!isCorrectMasterKey) {
      setAppModal({
        isOpen: true,
        size: 'xl',
        modalContent: (
          <ModalContent maxH="90vh" overflowY="auto" p={6}>
            <ModalHeader>Incorrect Site Password</ModalHeader>
            <Divider borderColor="gray.300" />
            <ModalBody>
              <VStack align="left" spacing={6}>
                <Text fontSize="md">
                  The site password you entered is incorrect. Please change it in your user profile
                  settings.
                </Text>
                <Text fontSize="md">
                  Without the correct password, you will not be able to view attendee information.
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={handleClosePwModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        ),
      });
    }
  }, [isCorrectMasterKey]);

  useEffect(() => {
    if (dropId === '') navigate('/drops');
    if (!accountId) return;
    if (!dropId) return;

    const getDropData = async () => {
      try {
        const drop: EventDrop = await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: dropId },
        });
        drop.drop_config.nft_keys_config.token_metadata.media = `${CLOUDFLARE_IPFS}/${drop.drop_config.nft_keys_config.token_metadata.media}`;

        setDropData(drop);
      } catch (e) {
        console.error('error', e);
        setIsErr(true);
      }
    };
    getDropData();
  }, [dropId, selector, accountId]);

  useEffect(() => {
    if (dropId === '') navigate('/drops');
    if (!accountId) return;
    if (!dropId) return;

    const getEventData = async () => {
      try {
        const drop: EventDrop = await keypomInstance.viewCall({
          methodName: 'get_drop_information',
          args: { drop_id: dropId },
        });
        const nftExtraObj: TicketMetadataExtra = JSON.parse(
          drop.drop_config.nft_keys_config.token_metadata.extra,
        );

        const eventInfo: FunderEventMetadata | null = await keypomInstance.getEventInfo({
          accountId,
          eventId: nftExtraObj.eventId,
        });
        if (eventInfo == null) {
          setIsErr(true);
          return;
        }
        setEventInfo(eventInfo);

        if (eventInfo?.questions) {
          try {
            const privKey = await keypomInstance.getDerivedPrivKey({
              encryptedPk: eventInfo.encPrivKey!,
              ivBase64: eventInfo.iv!,
              saltBase64: eventInfo.salt!,
              pw: get(MASTER_KEY) as string,
            });
            setUserKey(privKey);
          } catch (e) {
            setIsCorrectMasterKey(false);
          }
        }

        const questionColumns: ColumnItem[] =
          eventInfo.questions
            ?.filter((questionInfo: QuestionInfo) => showQuestion(questionInfo.question))
            .map((questionInfo) => ({
              id: questionInfo.question, // Using the question text as a unique ID
              title: questionInfo.question, // The question text as the title
              selector: (row) => row[questionInfo.question] || '-', // Accessing the response using the question
              loadingElement: <Skeleton height="30px" />,
            })) || [];

        setDataTableQuestionIds(questionColumns.map((questionInfo) => questionInfo.id));

        setTableColumns((prevColumns) => [...questionColumns, ...prevColumns]);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('error in getEventData', e);
        setIsErr(true);
      }
    };
    getEventData();
  }, [dropId, selector, accountId]);

  useEffect(() => {
    if (dropId === '') navigate('/drops');
    if (!accountId) return;
    if (!dropId) return;

    const getTicketsPurchased = async () => {
      try {
        const numKeys = await keypomInstance.viewCall({
          methodName: 'get_key_supply_for_drop',
          args: { drop_id: dropId },
        });
        setTicketsPurchased(numKeys);
      } catch (e) {
        console.error('error', e);
        setIsErr(true);
      }
    };
    getTicketsPurchased();
  }, [dropId, selector, accountId]);

  useEffect(() => {
    if (
      accountId === undefined ||
      accountId === null ||
      dropId === undefined ||
      dropId === null ||
      eventInfo === null ||
      eventInfo === undefined
    )
      return;
    if (eventInfo.questions && !userKey) return;

    // First get enough data with the current filters to fill the page size
    try {
      handleGetInitialKeys(userKey, eventInfo);
    } catch (e) {
      console.error('error', e);
      setIsErr(true);
    }
  }, [accountId, userKey, eventInfo]);

  useEffect(() => {
    if (
      accountId === undefined ||
      accountId === null ||
      dropId === undefined ||
      dropId === null ||
      eventInfo === null ||
      eventInfo === undefined
    )
      return;

    if (eventInfo.questions && !userKey) return;

    // In parallel, fetch all the drops
    try {
      handleGetAllKeys(userKey, eventInfo);
    } catch (e) {
      console.error('error', e);
      setIsErr(true);
    }
  }, [userKey, eventInfo, accountId, selectedFilters]);

  const showQuestion = (question: string) => {
    return (
      question.toLowerCase().replaceAll(' ', '').includes('name') ||
      question.toLowerCase().replaceAll(' ', '').includes('email')
    );
  };

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
        const answers: Record<string, string> = metadata.questions; // Extracts all answers to the questions

        for (const [question, answer] of Object.entries(answers)) {
          if (showQuestion(question)) {
            const answerString = answer.toLowerCase().replaceAll(' ', '');
            const searchTerm = selectedFilters.search.toLowerCase().trim();

            if (answerString.includes(searchTerm)) {
              return true;
            }
          }
        }
        return false;
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

  const handleGetAllKeys = useCallback(
    async (userPrivKey, curEventInfo) => {
      setIsAllKeysLoading(true);
      const keyInfoReturn = await keypomInstance.getAllKeysForTicket({ dropId });
      let { dropKeyItems } = keyInfoReturn;

      const numScanned = dropKeyItems.filter((key) => {
        return key.uses_remaining !== 2;
      }).length;
      setTicketsScanned(numScanned);

      if (curEventInfo.questions) {
        dropKeyItems = await Promise.all(
          dropKeyItems.map(async (key) => {
            const newKey = JSON.parse(JSON.stringify(key));
            try {
              const decryptedMeta = await keypomInstance.decryptMetadata({
                data: key.metadata,
                privKey: userPrivKey,
              });
              newKey.metadata = decryptedMeta;
            } catch (e) {
              console.error('error', e);
              setIsCorrectMasterKey(false);
            }
            return newKey;
          }),
        );
      }

      const filteredKeys = handleFiltering(dropKeyItems);

      const totalPages = Math.ceil(filteredKeys.length / selectedFilters.pageSize);
      setNumPages(totalPages);

      setCurPage(0);
      setFilteredTicketData(filteredKeys);
      setIsAllKeysLoading(false);
    },
    [accountId, selectedFilters, keypomInstance],
  );

  const handleGetInitialKeys = useCallback(
    async (userPrivKey, curEventInfo) => {
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
        let dropKeyItems: AttendeeKeyItem[] = await keypomInstance.getPaginatedKeysForTicket({
          dropId,
          start: keysFetched,
          limit: selectedFilters.pageSize,
        });

        if (curEventInfo.questions) {
          dropKeyItems = await Promise.all(
            dropKeyItems.map(async (key) => {
              const newKey = JSON.parse(JSON.stringify(key));
              try {
                const decryptedMeta = await keypomInstance.decryptMetadata({
                  data: key.metadata,
                  privKey: userPrivKey,
                });
                newKey.metadata = decryptedMeta;
              } catch (e) {
                console.error('error', e);
                setIsCorrectMasterKey(false);
              }
              return newKey;
            }),
          );
        }

        keysFetched += dropKeyItems.length;

        const curFiltered = handleFiltering(dropKeyItems);
        filteredKeys = filteredKeys.concat(curFiltered);
      }

      if (filteredTicketData.length === 0) {
        setFilteredTicketData(filteredKeys);
      }
      setCurPage(0);
      setIsLoading(false);
    },
    [accountId, keypomInstance],
  );

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

  const openViewDetailsModal = ({
    item,
    eventInfo,
  }: {
    item: any;
    eventInfo: FunderEventMetadata;
  }) => {
    const questionColumns = eventInfo?.questions ? (
      eventInfo?.questions.map((questionInfo) => (
        <VStack key={questionInfo.question} align="left" spacing={0}>
          <Text color="black.800" fontWeight="medium">
            {questionInfo.question}
          </Text>
          <Text>{item.responses[questionInfo.question] || '-'}</Text>
        </VStack>
      ))
    ) : (
      <Text>None</Text>
    );

    setAppModal({
      isOpen: true,
      size: 'xl',
      modalContent: (
        <ModalContent maxH="90vh" overflowY="auto" padding={6}>
          <VStack align="left" spacing={6} textAlign="left">
            <Text color="black.800" fontSize="xl" fontWeight="medium">
              Attendee details
            </Text>
            <HStack justify="space-between">
              <VStack align="left" spacing={0}>
                <Text fontWeight="medium">Ticket ID</Text>
                <Text color="blue.500">
                  {truncateAddress(item.publicKey.split('ed25519:')[1], 'end', 16)}
                </Text>
              </VStack>
              <Badge
                backgroundColor={CLAIM_STATUS[item.usesRemaining].bg}
                borderRadius="20px"
                color={CLAIM_STATUS[item.usesRemaining].text}
                fontSize="15px"
                fontWeight="medium"
              >
                {CLAIM_STATUS[item.usesRemaining].name}
              </Badge>
            </HStack>
            <Divider borderColor="gray.300" /> {/* This creates the horizontal line */}
            <VStack align="left" spacing={6}>
              <Text color="black.800" fontSize="xl" fontWeight="medium">
                Attendee questions and responses
              </Text>
              {questionColumns}
            </VStack>
            {/* ... more content based on your design */}
            <Button
              autoFocus={false}
              variant="secondary"
              width="full"
              onClick={() => {
                setAppModal({ isOpen: false });
              }}
            >
              Close
            </Button>
          </VStack>
        </ModalContent>
      ),
    });
  };

  const getTableRows: GetAttendeeDataFn = (data) => {
    if (data === undefined || eventInfo === undefined) return [];
    return data.map((item) => {
      const mapped = {
        id: item.id, // Assuming `item` has a `drop_id` property that can serve as `id`
        ticketId: truncateAddress(`${item.publicKey.split('ed25519:')[1]}`, 'end', 16),
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
              openViewDetailsModal({ item, eventInfo });
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
    return getTableRows(rowsToShow);
  }, [filteredTicketData, filteredTicketData.length, curPage, eventInfo]);

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
      name: eventInfo?.name || '',
      href: `/events/event/${eventInfo?.id || ''}`,
    },
    {
      name: dropData?.drop_config.nft_keys_config.token_metadata.title || '',
      href: '',
    },
  ];

  if (isErr) {
    return (
      <NotFound404
        cta="Return to homepage"
        header="Ticket Not Found"
        subheader="Please check the URL and try again."
      />
    );
  }

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <Breadcrumbs items={breadcrumbItems} />
      {/* Drop info section */}
      <VStack align="start" paddingTop="4" spacing="4">
        <HStack>
          {!dropData?.drop_config.nft_keys_config.token_metadata.media ? (
            <Spinner />
          ) : (
            <Image
              alt={`Drop image for ${dropData?.drop_id}`}
              borderRadius="12px"
              boxSize="150px"
              objectFit="cover"
              src={dropData?.drop_config.nft_keys_config.token_metadata.media} // Use dropData.media or fallback to placeholder
            />
          )}
          <VStack align="start">
            <Heading fontFamily="" size="sm">
              Ticket name
            </Heading>
            <Heading size="lg">
              {dropData?.drop_config.nft_keys_config.token_metadata.title}{' '}
            </Heading>
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
                isDisabled={!allowExport}
                isLoading={exporting}
                lineHeight=""
                px="6"
                variant="secondary"
                w={{ sm: 'initial' }}
                onClick={async () => {
                  await handleExportCSVClick({
                    dropIds: [dropId],
                    setExporting,
                    keypomInstance,
                    setIsCorrectMasterKey,
                    userKey: userKey!,
                    eventData: {
                      name: eventInfo?.name || '',
                      artwork: eventInfo?.artwork || '',
                      questions: eventInfo?.questions || [],
                    },
                  });
                }}
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
            All attendees
          </Heading>

          <HStack align="stretch" justify="space-between" w="full">
            <FilterOptionsMobileButton
              buttonTitle="More Options"
              popoverClicked={popoverClicked}
              onOpen={onOpen}
            />
            <Button
              height="auto"
              isDisabled={!allowExport}
              isLoading={exporting}
              lineHeight=""
              px="6"
              variant="secondary"
              w={{ sm: 'initial' }}
              onClick={async () => {
                await handleExportCSVClick({
                  dropIds: [dropId],
                  setExporting,
                  userKey,
                  keypomInstance,
                  setIsCorrectMasterKey,
                  eventData: {
                    name: eventInfo?.name || '',
                    artwork: eventInfo?.artwork || '',
                    questions: eventInfo?.questions || [],
                  },
                });
              }}
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
          excludeMobileColumns={dataTableQuestionIds}
          loading={isLoading || !eventInfo}
          mt={{ base: '6', md: '4' }}
          showColumns={true}
          showMobileTitles={['ticketId']}
          type={getTableType()}
        />

        <DropManagerPagination
          curPage={curPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          isLoading={isAllKeysLoading || !eventInfo}
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
