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
import { MASTER_KEY, TOKEN_FACTORY_CONTRACT } from '@/constants/common';
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
import { truncateAddress } from '@/utils/truncateAddress';

import { handleExportCSVClick } from '../components/ExportToCsv';
import { dateAndTimeToText } from '@/features/drop-manager/utils/parseDates';
import { useSponsorDashboardParams } from '../utils/utils';
import { formatTokensAvailable } from '@/features/conference-app/AssetsPages/AssetsHome';

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

export default function SponsorDashboardPage() {
  const { sponsorAccountId, secretKey } = useSponsorDashboardParams();
  console.log("sponsorAccountId ", sponsorAccountId)
  console.log("Secret Key: ", secretKey)

  const toast = useToast();

  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const [tokensAvailable, setTokensAvailable] = useState<string>()

  const [ticketData, setTicketData] = useState<TicketItem[]>([]);
  const [eventData, setEventData] = useState<EventData>();

  useEffect(() => {
    if (sponsorAccountId === '') return
    if (!sponsorAccountId) return;
    if (!secretKey) return;

    const getAvailableBalance = async () => {
      const tokens = await keypomInstance.viewCall({contractId: TOKEN_FACTORY_CONTRACT, methodName: "ft_balance_of", args: {"account_id": sponsorAccountId}})
      setTokensAvailable(keypomInstance.yoctoToNearWith4Decimals(tokens));
      setIsLoading(false)
    };
    try {
      getAvailableBalance();
    } catch (e) {
      console.error(e);
      setIsErr(true);
    }
  }, [sponsorAccountId, secretKey]);


  const getSoldKeys = () => {
    return ticketData.reduce((acc, ticket) => acc + ticket.soldTickets, 0);
  };

  const handleDeleteClick = async (dropId) => {
    const ticketData = await keypomInstance.viewCall({
      methodName: 'get_drop_information',
      args: { drop_id: dropId },
    });

    const deletionArgs = {
      navigate,
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
    const deletionArgs = {
      navigate,
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
              {truncateAddress(`${item.name}`, 'end', 16)}
            </Heading>
            <Heading fontFamily="body" fontSize={{ md: 'md' }} fontWeight="light">
              {truncateAddress(`${item.description}`, 'end', 64)}
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
        </HStack>
      ),
      href: `/events/ticket/${(item.id || '').toString()}`,
    }));
  };

  const data = useMemo(
    () => getTableRows(ticketData, handleDeleteClick),
    [getTableRows, ticketData, ticketData.length, handleDeleteClick],
  );

  const allowAction = data.length > 0;

  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (isErr) {
    return (
      <NotFound404
        cta="Return to homepage"
        header="Event Not Found"
        subheader="Please check the URL and try again."
      />
    );
  }

  if (isLoading) {
    return
  }

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <Heading>
        Welcome {capitalizeFirstLetter(sponsorAccountId?.split(`.${TOKEN_FACTORY_CONTRACT}`)[0])}!
      </Heading>
      {/* Drop info section */}
      <VStack align="left" paddingTop="4" spacing="6">
        <VStack align="left" w="50%">
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
                Tokens Available
              </Text>
              <Heading>{formatTokensAvailable(tokensAvailable!)}</Heading>
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
