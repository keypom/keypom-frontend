import {
  Box,
  Divider,
  Button,
  Heading,
  Hide,
  HStack,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Image,
  Show,
  Skeleton,
  Spinner,
  Text,
  VStack,
  ModalContent,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Wallet } from '@near-wallet-selector/core';

import { share } from '@/utils/share';
import { get } from '@/utils/localStorage';
import { CopyIcon, DeleteIcon } from '@/components/Icons';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext } from '@/contexts/AppContext';
import keypomInstance from '@/lib/keypom';
import { MASTER_KEY } from '@/constants/common';
import {
  type QuestionInfo,
  type DateAndTimeInfo,
  type TicketMetadataExtra,
  type EventDrop,
} from '@/lib/eventsHelpers';
import { ShareIcon } from '@/components/Icons/ShareIcon';
import { NotFound404 } from '@/components/NotFound404';
import useDeletion from '@/components/AppModal/useDeletion';
import { performDeletionLogic } from '@/components/AppModal/PerformDeletion';

import { handleExportCSVClick } from '../../components/ExportToCsv';
import { dateAndTimeToText } from '../../utils/parseDates';

export interface EventData {
  name: string;
  artwork: string;
  questions: QuestionInfo[];
}

export interface TicketItem {
  id: string;
  artwork: string;
  name: string;
  description: string;
  salesValidThrough: DateAndTimeInfo;
  passValidThrough: DateAndTimeInfo;
  maxTickets?: number;
  soldTickets: number;
  priceNear: string;
}

export type GetTicketDataFn = (
  data: TicketItem[],
  handleDelete: (pubKey: string) => Promise<void>,
) => DataItem[];

const eventTableColumns: ColumnItem[] = [
  {
    id: 'ticketName',
    title: 'Ticket name',
    selector: (row) => row.name,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'numTickets',
    title: 'Tickets sold',
    selector: (row) => {
      // Ensure that soldTickets is a number or can be coerced to a string safely
      const soldTickets = String(row.soldTickets);

      // Check if maxTickets is a number, otherwise use the infinity symbol
      const maxTickets = typeof row.maxTickets === 'number' ? row.maxTickets : '\u221E';

      return `${soldTickets}/${maxTickets}`;
    },
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'price',
    title: 'Price (NEAR)',
    selector: (row) => row.priceNear,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: '',
    selector: (row) => row.action,
    loadingElement: <Skeleton height="30px" />,
  },
];

export default function EventManagerPage() {
  const { id: eventId = '' } = useParams();
  const toast = useToast();

  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const [wallet, setWallet] = useState<Wallet>();
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const [isCorrectMasterKey, setIsCorrectMasterKey] = useState(true);
  const [userKey, setUserKey] = useState();

  const [exporting, setExporting] = useState<boolean>(false);

  const [ticketData, setTicketData] = useState<TicketItem[]>([]);

  const [eventData, setEventData] = useState<EventData>();
  const { selector, accountId } = useAuthWalletContext();

  useEffect(() => {
    if (eventId === '') navigate('/drops');
    if (!accountId) return;
    if (!eventId) return;

    const getEventData = async () => {
      const eventInfo = await keypomInstance.getEventInfo({ accountId, eventId });
      if (!eventInfo) {
        setIsErr(true);
        return;
      }
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
          console.error(e);
        }
      }
      setEventData({
        name: eventInfo.name || 'Untitled',
        artwork: eventInfo.artwork || 'loading',
        questions: eventInfo.questions || [],
      });
    };
    try {
      getEventData();
    } catch (e) {
      console.error(e);
      setIsErr(true);
    }
  }, [eventId, selector, accountId]);

  const handleClosePwModal = () => {
    setAppModal({ isOpen: false });
    navigate(`/events`);
  };

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
    if (!keypomInstance || !eventId || !accountId) return;

    handleGetAllTickets();
  }, [keypomInstance, eventId, accountId]);

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

  const getSoldKeys = () => {
    return ticketData.reduce((acc, ticket) => acc + ticket.soldTickets, 0);
  };

  const breadcrumbItems = [
    {
      name: 'My events',
      href: '/events',
    },
    {
      name: eventData?.name || '',
      href: '/events',
    },
  ];

  const handleGetAllTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      const ticketsForEvent: EventDrop[] = await keypomInstance.getTicketsForEventId({
        accountId: accountId!,
        eventId,
      });

      if (ticketsForEvent == null || ticketsForEvent.length === 0) {
        setIsErr(true);
        setIsLoading(false);
        return;
      }

      const promises = ticketsForEvent.map(async (ticket) => {
        const nftObject = ticket.drop_config.nft_keys_config.token_metadata;
        const meta: TicketMetadataExtra = JSON.parse(nftObject.extra);
        const supply = await keypomInstance.getKeySupplyForTicket(ticket.drop_id);
        return {
          id: ticket.drop_id,
          artwork: nftObject.media,
          name: nftObject.title,
          description: nftObject.description,
          salesValidThrough: meta.salesValidThrough,
          passValidThrough: meta.passValidThrough,
          maxTickets: meta.maxSupply,
          soldTickets: supply,
          priceNear: keypomInstance.yoctoToNear(meta.price),
        };
      });

      const ticketData = await Promise.all(promises);

      setTicketData(ticketData);
      setIsLoading(false);
    } catch (e) {
      console.error('Error fetching tickets:', e);
      setIsErr(true);
      setIsLoading(false);
    }
  }, [accountId, keypomInstance]);

  const handleDeleteClick = async (dropId) => {
    if (!wallet) return;

    const ticketData = await keypomInstance.viewCall({
      methodName: 'get_drop_information',
      args: { drop_id: dropId },
    });

    const deletionArgs = {
      wallet,
      accountId,
      navigate,
      eventId,
      ticketData: [ticketData],
      deleteAll: ticketData.length <= 1,
      setAppModal,
    };

    // Open the confirmation modal with customization if needed
    openConfirmationModal(
      deletionArgs,
      'Are you sure you want to delete this ticket type? Any purchased tickets will be lost.',
      performDeletionLogic,
    );
  };

  const handleDeleteAllClick = async () => {
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
      deleteAll: true,
      ticketData,
      setAppModal,
    };

    // Open the confirmation modal with customization if needed
    openConfirmationModal(
      deletionArgs,
      'Are you sure you want to delete this event and all its tickets? This action cannot be undone.',
      performDeletionLogic,
    );
  };

  const { openConfirmationModal } = useDeletion({
    setAppModal,
  });

  const getTableRows: GetTicketDataFn = (data, handleDeleteClick) => {
    if (data === undefined) return [];

    return data.map((item) => ({
      id: item.id, // Assuming `item` has a `drop_id` property that can serve as `id`
      name: (
        <HStack spacing={4}>
          <Image
            alt={`Event image for ${item.id}`}
            borderRadius="12px"
            boxSize="48px"
            objectFit="contain"
            src={item.artwork}
          />
          <VStack align="left">
            <Heading fontFamily="body" fontSize={{ md: 'lg' }} fontWeight="bold">
              {item.name}
            </Heading>
            <Heading fontFamily="body" fontSize={{ md: 'md' }} fontWeight="light">
              {item.description}
            </Heading>
            <VStack align="left" spacing={0}>
              <Heading
                color="gray.400"
                fontFamily="body"
                fontSize={{ md: 'md' }}
                fontWeight="light"
              >
                Purchase through: {dateAndTimeToText(item.salesValidThrough)}
              </Heading>
              <Heading
                color="gray.400"
                fontFamily="body"
                fontSize={{ md: 'md' }}
                fontWeight="light"
              >
                Valid through: {dateAndTimeToText(item.passValidThrough)}
              </Heading>
            </VStack>
          </VStack>
        </HStack>
      ),
      soldTickets: item.soldTickets,
      maxTickets: item.maxTickets,
      priceNear: item.priceNear,
      action: (
        <HStack>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={async (e) => {
              e.stopPropagation();
              handleDeleteClick(item.id); // Pass the correct id here
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
              navigate(`/gallery/${accountId}:${(eventId || '').toString()}`);
            }}
          >
            <ShareIcon color="gray.600" height="16px" width="16px" />
          </Button>
        </HStack>
      ),
      href: `/events/ticket/${(item.id || '').toString()}`,
    }));
  };

  const handleScanPageCopyClick = () => {
    const link = `${window.location.origin}/scan/event/${accountId}:${(eventId || '').toString()}`;
    share(link);
    toast({ title: 'Copied!', status: 'success', duration: 1000, isClosable: true });
  };

  const handleScanPageShareClick = () => {
    const url = `/scan/event/${accountId}:${(eventId || '').toString()}`;
    window.open(url, '_blank');
  };

  const data = useMemo(
    () => getTableRows(ticketData, handleDeleteClick),
    [getTableRows, ticketData, ticketData.length, handleDeleteClick],
  );

  const allowAction = data.length > 0;

  if (isErr) {
    return (
      <NotFound404
        cta="Return to homepage"
        header="Event Not Found"
        subheader="Please check the URL and try again."
      />
    );
  }

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <Breadcrumbs items={breadcrumbItems} />
      {/* Drop info section */}
      <VStack align="left" paddingTop="4" spacing="6">
        <HStack align="flex-start" justify="space-between" width="100%">
          <HStack>
            {!eventData?.artwork ? (
              <Spinner />
            ) : (
              <Image
                alt={`Event image for ${eventData.name}`}
                borderRadius="12px"
                boxSize="150px"
                objectFit="cover"
                src={eventData?.artwork}
              />
            )}
            <VStack align="flex-start">
              {' '}
              {/* Align items to the left */}
              <Heading size="sm">Event Name</Heading>
              <Heading size="lg">{eventData?.name}</Heading>
            </VStack>
          </HStack>
          <VStack align="flex-end">
            {' '}
            {/* Align items to the right */}
            <Button
              borderRadius="6xl"
              size="md"
              variant="icon"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/gallery/${accountId}:${(eventId || '').toString()}`);
              }}
            >
              <ShareIcon color="gray.600" height="16px" width="16px" />
            </Button>
          </VStack>
        </HStack>

        <VStack align="left" w="50%">
          <HStack justify="space-between" paddingBottom="4" w="100%">
            <Heading>Scan Tickets</Heading>
            <HStack spacing="0">
              <Button
                borderRadius="6xl"
                mr="1"
                size="md"
                variant="icon"
                onClick={() => {
                  handleScanPageCopyClick();
                }}
              >
                <CopyIcon />
              </Button>
              <Button
                borderRadius="6xl"
                mr="1"
                size="md"
                variant="icon"
                onClick={() => {
                  handleScanPageShareClick();
                }}
              >
                <ShareIcon color="gray.600" height="16px" width="16px" />
              </Button>
            </HStack>
          </HStack>
          <Box
            bg="border.box"
            border="2px solid transparent"
            borderRadius="12"
            borderWidth="2px"
            p={4}
            w="100%" // Adjust based on your layout, 'fit-content' makes the box to fit its content size
          >
            <VStack align="start" spacing={1}>
              {' '}
              {/* Adjust spacing as needed */}
              <Text color="gray.700" fontSize="lg" fontWeight="medium">
                Tickets Sold
              </Text>
              <Heading>{getSoldKeys()}</Heading>
            </VStack>
          </Box>
        </VStack>
      </VStack>
      {/* Desktop Menu */}
      <Show above="md">
        <HStack justify="space-between">
          <Heading paddingBottom="0" paddingTop="4">
            All tickets
          </Heading>
          {/* Right Section */}
          <HStack alignItems="end" justify="end" mt="1rem !important">
            <Button
              height="auto"
              isDisabled={!allowAction || !eventData}
              lineHeight=""
              px="6"
              py="3"
              textColor="red.500"
              variant="secondary"
              w={{ sm: 'initial' }}
              onClick={handleDeleteAllClick}
            >
              Delete All
            </Button>
            <Button
              height="auto"
              isDisabled={!allowAction || !eventData}
              isLoading={exporting}
              lineHeight=""
              px="6"
              py="3"
              variant="secondary"
              w={{ base: '100%', sm: 'initial' }}
              onClick={async () => {
                await handleExportCSVClick({
                  dropIds: ticketData.map((ticket) => ticket.id),
                  setExporting,
                  keypomInstance,
                  setIsCorrectMasterKey,
                  userKey,
                  eventData,
                });
              }}
            >
              Export .CSV
            </Button>
          </HStack>
        </HStack>
      </Show>
      {/* Mobile Menu */}
      <Hide above="md">
        <VStack>
          <Heading paddingTop="20px" size="2xl" textAlign="left" w="full">
            All tickets
          </Heading>

          <HStack align="stretch" justify="space-between" w="full">
            <Button
              height="auto"
              isDisabled={!allowAction || !eventData}
              lineHeight=""
              px="6"
              py="3"
              textColor="red.500"
              variant="secondary"
              w={{ sm: 'initial' }}
              onClick={handleDeleteAllClick}
            >
              Cancel all
            </Button>
            <Button
              height="auto"
              isDisabled={!allowAction || !eventData}
              isLoading={exporting}
              lineHeight=""
              px="6"
              variant="secondary"
              w={{ sm: 'initial' }}
              onClick={async () => {
                await handleExportCSVClick({
                  dropIds: ticketData.map((ticket) => ticket.id),
                  setExporting,
                  keypomInstance,
                  setIsCorrectMasterKey,
                  userKey,
                  eventData,
                });
              }}
            >
              Export .CSV
            </Button>
          </HStack>
        </VStack>
      </Hide>
      <Box paddingTop="2">
        <DataTable
          columns={eventTableColumns}
          data={data}
          excludeMobileColumns={[]}
          loading={isLoading || !eventData}
          mt={{ base: '6', md: '4' }}
          showColumns={true}
          showMobileTitles={['price', 'numTickets']}
          type="event-manager"
        />
      </Box>
    </Box>
  );
}
