import {
  Show,
  Hide,
  Spinner,
  Text,
  Image,
  VStack,
  Box,
  Button,
  Heading,
  HStack,
  type TableProps,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext } from '@/contexts/AppContext';
import keypomInstance, { type EventDrop } from '@/lib/keypom';
import { DropManagerPagination } from '@/features/all-drops/components/DropManagerPagination';
import { PAGE_SIZE_LIMIT } from '@/constants/common';
import { type QuestionInfo, type EventDropMetadata } from '@/lib/eventsHelpers';
import { ShareIcon } from '@/components/Icons/ShareIcon';

import { PAGE_SIZE_ITEMS, createMenuItems } from '../../../features/all-drops/config/menuItems';
import { CLAIM_STATUS } from '../routes/ticket/TicketDropManagerPage';

import { setConfirmationModalHelper } from './ConfirmationModal';

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
  salesValidThrough: string;
  passValidThrough: string;
  maxTickets?: number;
  soldTickets: number;
  priceNear: string;
}

export type GetTicketDataFn = (
  data: TicketItem[],
  handleDelete: (pubKey: string) => Promise<void>,
) => DataItem[];

interface EventManagerProps {
  eventData?: EventData;
  tableColumns: ColumnItem[];
  getData: GetTicketDataFn;
  tableProps?: TableProps;
}

export const EventManager = ({
  eventData,
  tableColumns,
  getData,
  tableProps,
}: EventManagerProps) => {
  const { id: eventId = '' } = useParams();
  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const [wallet, setWallet] = useState({});
  const { selector, accountId } = useAuthWalletContext();
  const [isLoading, setIsLoading] = useState(true);

  const [deleting, setDeleting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);
  const [ticketData, setTicketData] = useState<TicketItem[]>([]);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_LIMIT);
  const popoverClicked = useRef(0);

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

  const handleGetAllTickets = useCallback(async () => {
    setIsLoading(true);
    const ticketsForEvent: EventDrop[] = await keypomInstance.getTicketsForEvent({
      accountId: accountId!,
      eventId,
    });

    const promises = ticketsForEvent.map(async (ticket) => {
      const meta: EventDropMetadata = JSON.parse(ticket.drop_config.metadata);
      const supply = await keypomInstance.getKeySupplyForTicket(ticket.drop_id);
      console.log('Valid Through', meta.ticketInfo.salesValidThrough);
      return {
        id: ticket.drop_id,
        artwork: meta.ticketInfo.artwork,
        name: meta.ticketInfo.name,
        description: meta.ticketInfo.name,
        salesValidThrough: meta.ticketInfo.salesValidThrough,
        passValidThrough: meta.ticketInfo.passValidThrough,
        maxTickets: meta.ticketInfo.maxSupply,
        soldTickets: supply,
        priceNear: keypomInstance.yoctoToNear(meta.ticketInfo.price),
      };
    });

    setTicketData(await Promise.all(promises));

    const totalPages = Math.ceil(ticketsForEvent.length / pageSize);
    setNumPages(totalPages);

    setCurPage(0);
    setIsLoading(false);
  }, [accountId, keypomInstance]);

  const pageSizeMenuItems = createMenuItems({
    menuItems: PAGE_SIZE_ITEMS,
    onClick: (item) => {
      handlePageSizeSelect(item);
    },
  });

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

  const handlePageSizeSelect = (item) => {
    setPageSize(parseInt(item.label));
  };

  const handleNextPage = () => {
    setCurPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurPage((prev) => prev - 1);
  };

  const handleExportCSVClick = async () => {
    if (ticketData.length > 0) {
      setExporting(true);
      for (let i = 0; i < ticketData.length; i++) {
        const ticket = ticketData[i];
        const { dropName, dropKeyItems: data } = await keypomInstance.getAllKeysForTicket({
          dropId: ticket.id,
        });

        try {
          // Construct CSV header
          const questions = eventData?.questions || [];
          let csvContent = 'data:text/csv;charset=utf-8,';
          csvContent +=
            'Ticket ID,' + 'Claim Status' + questions.map((q) => q.question).join(',') + '\r\n';

          // Construct CSV rows
          data.forEach((item, i) => {
            const responses = JSON.parse(item.metadata).questions || {};
            const row = [item.pub_key.split('ed25519:')[1]];
            row.push(CLAIM_STATUS[item.uses_remaining].name);

            // Add answers in the same order as the questions
            questions.forEach((q) => {
              row.push(responses[q.question] || '-');
            });

            // Join the individual row's columns and push it to CSV content
            csvContent += row.join(',') + '\r\n';
          });

          // Encode the CSV content
          const encodedUri = encodeURI(csvContent);

          // Create a link to download the CSV file
          const link = document.createElement('a');
          link.setAttribute('href', encodedUri);
          link.setAttribute(
            'download',
            `${(eventData?.name || '').toLowerCase().replaceAll(' ', '_')}-${dropName
              .toLowerCase()
              .replaceAll(' ', '_')}.csv`,
          );
          document.body.appendChild(link); // Required for FF

          link.click(); // This will download the CSV file
          document.body.removeChild(link); // Clean up
        } catch (e) {
          console.error('error', e);
        } finally {
          setExporting(false);
        }
      }
    }
  };

  const handleCancelAllClick = async () => {
    if (data.length > 0) {
      setDeleting(true);

      const dropId = data[0].dropId;

      setConfirmationModalHelper(
        setAppModal,
        async () => {
          await keypomInstance.deleteDrops({
            wallet,
            dropIds: [dropId as string],
          });
          navigate('/drops');
        },
        'drop',
      );
      console.log('deleting drop', dropId);
      setDeleting(false);
    }
  };

  const handleDeleteClick = async (dropId: string) => {
    setConfirmationModalHelper(
      setAppModal,
      async () => {
        // TODO
        window.location.reload();
      },
      'key',
    );
  };

  const data = useMemo(
    () => getData(ticketData, handleDeleteClick),
    [getData, ticketData, ticketData.length, handleDeleteClick],
  );

  const allowAction = data.length > 0;

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
              onClick={() => {
                navigate(`/gallery/event/${(eventId || '').toString()}`);
              }}
            >
              <ShareIcon color="gray.600" height="16px" width="16px" />
            </Button>
          </VStack>
        </HStack>
        <HStack w="50%">
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
                Sold
              </Text>
              <Heading>{getSoldKeys()}</Heading>
            </VStack>
          </Box>
        </HStack>
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
              isLoading={deleting}
              lineHeight=""
              px="6"
              py="3"
              textColor="red.500"
              variant="secondary"
              w={{ sm: 'initial' }}
              onClick={handleCancelAllClick}
            >
              Cancel all
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
              onClick={handleExportCSVClick}
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
            All Keys
          </Heading>

          <HStack align="stretch" justify="space-between" w="full">
            <Button
              height="auto"
              isDisabled={!allowAction || !eventData}
              isLoading={deleting}
              lineHeight=""
              px="6"
              py="3"
              textColor="red.500"
              variant="secondary"
              w={{ sm: 'initial' }}
              onClick={handleCancelAllClick}
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
              onClick={handleExportCSVClick}
            >
              Export .CSV
            </Button>
          </HStack>
        </VStack>
      </Hide>

      <Box paddingTop="2">
        <DataTable
          columns={tableColumns}
          data={data}
          excludeMobileColumns={[]}
          loading={isLoading || !eventData}
          mt={{ base: '6', md: '4' }}
          showColumns={true}
          showMobileTitles={['price', 'numTickets']}
          type="event-manager"
          {...tableProps}
        />

        <DropManagerPagination
          curPage={curPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          isLoading={isLoading || !eventData}
          numPages={numPages}
          pageSizeMenuItems={pageSizeMenuItems}
          rowsSelectPlaceholder={pageSize.toString()}
          onClickRowsSelect={() => (popoverClicked.current += 1)}
        />
      </Box>
    </Box>
  );
};
