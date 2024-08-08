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
  Menu,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Wallet } from '@near-wallet-selector/core';

import { share } from '@/utils/share';
import { get } from '@/utils/localStorage';
import { CopyIcon, DeleteIcon, LinkIcon, NFTIcon } from '@/components/Icons';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext } from '@/contexts/AppContext';
import { CLOUDFLARE_IPFS, MASTER_KEY, TOKEN_FACTORY_CONTRACT } from '@/constants/common';
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
import { CreatedDropForm, CreateDropModal } from '../components/CreateDropModal';
import eventHelperInstance from '@/lib/event';
import { DropDownButton } from '@/features/all-events/components/DropDownButton';

export interface ConferenceDropBase {
  scavenger_ids?: string[];
  name: string;
  image: string;
  num_claimed: number;
  id: string;
}

export interface CreatedNFTConferenceDrop {
  base: ConferenceDropBase;
  series_id: number;
}

export interface CreatedTokenConferenceDrop {
  base: ConferenceDropBase;
  amount: string;
}

export type GetTicketDataFn = (
  data: CreatedConferenceDrop[],
  handleDelete: (pubKey: string) => Promise<void>,
) => DataItem[];

export type CreatedConferenceDrop = CreatedNFTConferenceDrop | CreatedTokenConferenceDrop;

const eventTableColumns: ColumnItem[] = [
  {
    id: 'dropName',
    title: 'Drop Name',
    selector: (row) => row.name,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'dropType',
    title: 'Drop Type',
    selector: (row) => {
      return `type`;
    },
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'numClaimed',
    title: 'Num Claimed',
    selector: (row) => row.numClaimed,
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
  console.log('sponsorAccountId ', sponsorAccountId);
  console.log('Secret Key: ', secretKey);

  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const [isCreateDropModalOpen, setIsCreateDropModalOpen] = useState(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const [tokensAvailable, setTokensAvailable] = useState<string>();
  const [dropsCreated, setDropsCreated] = useState<CreatedConferenceDrop[]>([]);
  const [dropType, setDropType] = useState<'nft' | 'token'>('token');
  const toast = useToast();
  const popoverClicked = useRef(0);

  useEffect(() => {
    if (sponsorAccountId === '') return;
    if (!sponsorAccountId) return;
    if (!secretKey) return;

    const getAccountInformation = async () => {
      const tokens = await eventHelperInstance.viewCall({
        contractId: TOKEN_FACTORY_CONTRACT,
        methodName: 'ft_balance_of',
        args: { account_id: sponsorAccountId },
      });
      setTokensAvailable(eventHelperInstance.yoctoToNearWith4Decimals(tokens));
      const drops = await eventHelperInstance.viewCall({
        contractId: TOKEN_FACTORY_CONTRACT,
        methodName: 'get_drops_created_by_account',
        args: { account_id: sponsorAccountId },
      });
      setDropsCreated(drops);
      setIsLoading(false);
    };
    try {
      getAccountInformation();
    } catch (e) {
      console.error(e);
      setIsErr(true);
    }
  }, [sponsorAccountId, secretKey]);

  const handleDeleteClick = async (dropId) => {
    const ticketData = await eventHelperInstance.viewCall({
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

  const handleCreateDropClick = async () => {};

  const handleDeleteAllClick = async () => {
    const deletionArgs = {
      navigate,
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

  const { openConfirmationModal } = useDeletion({
    setAppModal,
  });

  const getTableRows: GetTicketDataFn = (data, handleDeleteClick) => {
    if (data === undefined) return [];

    return data.map((item) => ({
      id: item.base.id, // Assuming `item` has a `drop_id` property that can serve as `id`
      name: (
        <HStack spacing={4}>
          <Image
            alt={`Event image for ${item.base.id}`}
            borderRadius="12px"
            boxSize="48px"
            objectFit="contain"
            src={`${CLOUDFLARE_IPFS}/${item.base.image}`}
          />
          <VStack align="left">
            <Heading fontFamily="body" fontSize={{ md: 'lg' }} fontWeight="bold">
              {truncateAddress(`${item.base.name}`, 'end', 16)}
            </Heading>
          </VStack>
        </HStack>
      ),
      action: (
        <HStack>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={async (e) => {
              e.stopPropagation();
              handleDeleteClick(item.base.id); // Pass the correct id here
            }}
          >
            <DeleteIcon color="red.400" />
          </Button>
        </HStack>
      ),
    }));
  };

  const data = useMemo(
    () => getTableRows(dropsCreated, handleDeleteClick),
    [getTableRows, dropsCreated, dropsCreated.length, handleDeleteClick],
  );

  const allowAction = data.length > 0;

  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return `${string.charAt(0).toUpperCase() as string}${string.slice(1).toString() as string}`;
  };

  const handleCreateDropClose = async (
    dropCreated: CreatedDropForm | undefined,
    setIsLoading: (value: boolean) => void,
  ) => {
    if (dropCreated !== undefined) {
      setIsLoading(true);
      try {
        await eventHelperInstance.createConferenceDrop({
          secretKey,
          createdDrop: dropCreated,
          accountId: sponsorAccountId!,
        });
        toast({
          title: 'Drop created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (e) {
        console.error('Error creating drop:', e);
        toast({
          title: 'Drop creation unsuccessful. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setIsLoading(false);
    }

    setIsCreateDropModalOpen(false);
    console.log('dropCreated', dropCreated);
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
    return;
  }

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <CreateDropModal
        modalType={dropType}
        isOpen={isCreateDropModalOpen}
        onClose={handleCreateDropClose}
      />
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
            All Drops
          </Heading>
          {/* Right Section */}
          <HStack alignItems="end" justify="end" mt="1rem !important">
            <Menu>
              {({ isOpen }) => (
                <Box>
                  <DropDownButton
                    isOpen={isOpen}
                    placeholder="Create Drop"
                    variant="primary"
                    onClick={() => (popoverClicked.current += 1)}
                  />
                  <MenuList minWidth="auto">
                    <MenuItem
                      key="token"
                      icon={<LinkIcon h="4" w="4" />}
                      onClick={() => {
                        setDropType('token');
                        setIsCreateDropModalOpen(true);
                      }}
                    >
                      Token Drop
                    </MenuItem>
                    <MenuItem
                      key="nft"
                      icon={<NFTIcon h="4" w="4" />}
                      onClick={() => {
                        setDropType('nft');
                        setIsCreateDropModalOpen(true);
                      }}
                    >
                      NFT Drop
                    </MenuItem>
                  </MenuList>
                </Box>
              )}
            </Menu>
            <Button
              height="auto"
              isDisabled={!allowAction}
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
          </HStack>
        </HStack>
      </Show>
      {/* Mobile Menu */}
      <Hide above="md">
        <VStack>
          <Heading paddingTop="20px" size="2xl" textAlign="left" w="full">
            All Drops
          </Heading>

          <HStack align="stretch" justify="space-between" w="full">
            <Button
              height="auto"
              isDisabled={!allowAction}
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
          </HStack>
        </VStack>
      </Hide>
      <Box paddingTop="2">
        <DataTable
          columns={eventTableColumns}
          data={data}
          excludeMobileColumns={[]}
          loading={isLoading}
          mt={{ base: '6', md: '4' }}
          showColumns={true}
          showMobileTitles={['price', 'numTickets']}
          type="conference-drops"
        />
      </Box>
    </Box>
  );
}
