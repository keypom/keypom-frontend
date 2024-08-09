import {
  Box,
  Button,
  Heading,
  Hide,
  HStack,
  Image,
  Show,
  Skeleton,
  Spinner,
  Text,
  VStack,
  useToast,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from '@chakra-ui/react';
import { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';

import { DeleteIcon, LinkIcon, NFTIcon } from '@/components/Icons';
import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { useAppContext } from '@/contexts/AppContext';
import { CLOUDFLARE_IPFS, TOKEN_FACTORY_CONTRACT } from '@/constants/common';
import { NotFound404 } from '@/components/NotFound404';
import useDeletion from '@/components/AppModal/useDeletion';
import { performDeletionLogic } from '@/components/AppModal/PerformDeletion';
import { truncateAddress } from '@/utils/truncateAddress';
import { formatTokensAvailable } from '@/features/conference-app/AssetsPages/AssetsHome';
import eventHelperInstance from '@/lib/event';

import { type CreatedDropForm, CreateDropModal } from '../components/CreateDropModal';
import { useSponsorDashboardParams } from '../utils/utils';
import QRViewerModal from '../components/QRViewerModal';

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
    title: 'Name',
    selector: (row) => row.name,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'dropType',
    title: 'Type',
    selector: (row) => row.type,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'numClaimed',
    title: 'Claims',
    selector: (row) => row.numClaimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'rewards',
    title: 'Reward',
    selector: (row) => row.reward,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: '',
    selector: (row) => row.action,
    loadingElement: <Skeleton height="30px" />,
  },
];

const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return `${string.charAt(0).toUpperCase() as string}${string.slice(1).toString() as string}`;
};

const SponsorDashboardPage = () => {
  const { sponsorAccountId, secretKey } = useSponsorDashboardParams();
  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const [isCreateDropModalOpen, setIsCreateDropModalOpen] = useState(false);
  const [tokensAvailable, setTokensAvailable] = useState<string>();
  const [dropsCreated, setDropsCreated] = useState<CreatedConferenceDrop[]>([]);
  const [dropType, setDropType] = useState<'nft' | 'token'>('token');
  const toast = useToast();
  const popoverClicked = useRef(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const getAccountInformation = async () => {
    try {
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
    } catch (e) {
      console.error(e);
      setIsErr(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sponsorAccountId || !secretKey) return;
    getAccountInformation();
  }, [sponsorAccountId, secretKey]);

  const handleDeleteClick = async (dropId) => {
    const deletionArgs = {
      accountId: sponsorAccountId,
      secretKey,
      dropId,
      setAppModal,
      getAccountInformation,
    };

    openConfirmationModal(
      deletionArgs,
      'Are you sure you want to delete this drop?',
      performDeletionLogic,
    );
  };

  const openConfirmationModal = useDeletion({ setAppModal }).openConfirmationModal;

  const getTableRows: GetTicketDataFn = (data, handleDeleteClick) => {
    if (!data) return [];

    return data.map((item) => ({
      id: item.base.id,
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
      type: item.amount !== undefined ? 'Token' : 'NFT',
      numClaimed: item.base.num_claimed,
      reward:
        item.amount !== undefined ? (
          eventHelperInstance.yoctoToNearWith4Decimals(item.amount)
        ) : (
          <Image
            alt={`Event image for ${item.base.id}`}
            borderRadius="12px"
            boxSize="48px"
            objectFit="contain"
            src={`${CLOUDFLARE_IPFS}/${item.base.image}`}
          />
        ),
      action: (
        <HStack justify="right" spacing={8} w="100%">
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={(e) => {
              e.stopPropagation();
              generateQRCode(item.base.id);
              onOpen();
            }}
          >
            Get QR Code
          </Button>
          <Button
            borderRadius="6xl"
            size="md"
            variant="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(item.base.id);
            }}
          >
            <DeleteIcon color="red.400" />
          </Button>
        </HStack>
      ),
    }));
  };

  const generateQRCode = async (text: string) => {
    try {
      const url = await QRCode.toDataURL(text);
      setQrCodeUrl(url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadQrCode = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const data = useMemo(() => getTableRows(dropsCreated, handleDeleteClick), [dropsCreated]);

  const handleCreateDropClose = async (
    dropCreated: CreatedDropForm | undefined,
    isScavengerHunt: boolean,
    scavengerHunt: Array<{ piece: string; description: string }>,
    setIsModalLoading: (loading: boolean) => void,
  ) => {
    console.log('Drop created: ', dropCreated);
    console.log('isScavengerHunt: ', isScavengerHunt);
    console.log('scavengerHunt: ', scavengerHunt);

    return;
    if (dropCreated) {
      setIsModalLoading(true);
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
        await getAccountInformation(); // Refresh the drop list
      } catch (e) {
        console.error('Error creating drop:', e);
        toast({
          title: 'Drop creation unsuccessful. Please try again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
      setIsModalLoading(false);
    }

    setIsCreateDropModalOpen(false);
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
    return <Spinner />;
  }

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <CreateDropModal
        isOpen={isCreateDropModalOpen}
        modalType={dropType}
        onClose={handleCreateDropClose}
      />
      <Heading>
        Welcome {capitalizeFirstLetter(sponsorAccountId?.split(`.${TOKEN_FACTORY_CONTRACT}`)[0])}!
      </Heading>
      <TokensAvailableSection tokensAvailable={tokensAvailable} />
      <DropActionsSection
        allowAction={data.length > 0}
        setDropType={setDropType}
        onCreateDrop={() => {
          setIsCreateDropModalOpen(true);
        }}
      />
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
      <QRViewerModal
        isOpen={isOpen}
        qrCodeUrl={qrCodeUrl}
        onClose={onClose}
        onDownload={handleDownloadQrCode}
      />
    </Box>
  );
};

const TokensAvailableSection = ({ tokensAvailable }) => (
  <VStack align="left" paddingTop="4" spacing="6">
    <VStack align="left" w="50%">
      <Box
        bg="border.box"
        border="2px solid transparent"
        borderRadius="12"
        borderWidth="2px"
        p={4}
        w="100%"
      >
        <VStack align="start" spacing={1}>
          <Text color="gray.700" fontSize="lg" fontWeight="medium">
            Tokens Available
          </Text>
          <Heading>{formatTokensAvailable(tokensAvailable)}</Heading>
        </VStack>
      </Box>
    </VStack>
  </VStack>
);

const DropActionsSection = ({ allowAction, onCreateDrop, setDropType }) => (
  <>
    <Show above="md">
      <HStack justify="space-between">
        <Heading paddingBottom="0" paddingTop="4">
          All Drops
        </Heading>
        <Menu>
          <MenuButton as={Button} variant="primary">
            Create Drop
          </MenuButton>
          <MenuList>
            <MenuItem
              key="token"
              icon={<LinkIcon h="4" w="4" />}
              onClick={() => {
                setDropType('token');
                onCreateDrop();
              }}
            >
              Token Drop
            </MenuItem>
            <MenuItem
              key="nft"
              icon={<NFTIcon h="4" w="4" />}
              onClick={() => {
                setDropType('nft');
                onCreateDrop();
              }}
            >
              NFT Drop
            </MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Show>
    <Hide above="md">
      <Heading paddingTop="20px" size="2xl" textAlign="left" w="full">
        All Drops
      </Heading>
    </Hide>
  </>
);

export default SponsorDashboardPage;
