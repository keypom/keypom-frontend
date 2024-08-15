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
import { useEffect, useState, useMemo } from 'react';
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

import { CreateDropModal } from '../components/CreateDropModal/CreateDropModal';
import QRViewerModal from '../components/QRViewerModal';
import { Wallet } from '@near-wallet-selector/core';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';

export interface ScavengerHunt {
  piece: string;
  description: string;
}

export interface ConferenceDropBase {
  scavenger_hunt?: ScavengerHunt[];
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

function isTokenDrop(item: CreatedConferenceDrop): item is CreatedTokenConferenceDrop {
  return (item as CreatedTokenConferenceDrop).amount !== undefined;
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
    id: 'scavengers',
    title: 'Scavenger Pieces',
    selector: (row) => row.numPieces,
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

const AdminDashboardPage = () => {
  const { setAppModal } = useAppContext();
  const { selector, account } = useAuthWalletContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isErr, setIsErr] = useState(false);
  const [isCreateDropModalOpen, setIsCreateDropModalOpen] = useState(false);
  const [tokensAvailable, setTokensAvailable] = useState<string>();
  const [dropsCreated, setDropsCreated] = useState<CreatedConferenceDrop[]>([]);
  const [dropType, setDropType] = useState<'nft' | 'token'>('token');
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [qrCodeUrls, setQrCodeUrls] = useState<string[]>([]);
  const [dropName, setDropName] = useState<string>('');
  const [wallet, setWallet] = useState<Wallet>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function fetchWallet() {
      if (!selector) return;
      try {
        const wallet = await selector.wallet();
        setWallet(wallet);
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    }

    fetchWallet();
  }, [selector]);

  const getAccountInformation = async () => {
    try {
      let keyOrAccountId = account?.public_key;

      // We're not in one click connect therefore default to using the logged in user
      if (wallet?.id !== 'keypom') {
        keyOrAccountId = account.account_id;
      }

      const accountDetails = await eventHelperInstance.getAccountDetails({ keyOrAccountId });
      setTokensAvailable(eventHelperInstance.yoctoToNearWith4Decimals(accountDetails.ft_balance));

      // Assuming account status is used to determine admin role
      if (accountDetails.account_status === 'Admin') {
        setIsAdmin(true);
      }

      const drops = await eventHelperInstance.viewCall({
        contractId: TOKEN_FACTORY_CONTRACT,
        methodName: 'get_drops_created_by_account',
        args: { account_id: accountDetails.account_id },
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
    if (!account) return;
    getAccountInformation();
  }, [account]);

  const handleDeleteClick = async (dropId) => {
    const deletionArgs = {
      wallet,
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
      type: isTokenDrop(item) ? 'Token' : 'NFT',
      numClaimed: item.base.num_claimed,
      numPieces: item.base.scavenger_hunt ? item.base.scavenger_hunt.length : 'None',
      reward:
        isTokenDrop(item) ? (
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
              generateQRCode(item.base.name, item.base.id, isTokenDrop(item) ? 'token' : 'nft', item.base.scavenger_hunt);
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

  const generateQRCode = async (dropName: string, dropId: string, type: 'nft' | 'token', scavengerHunt?: ScavengerHunt[]) => {
    try {
      setDropName(dropName)
      if (scavengerHunt && scavengerHunt.length > 0) {
        const qrCodes = await Promise.all(
          scavengerHunt.map(({ piece }) => QRCode.toDataURL(`${type}:${dropId}:${piece}`)),
        );
        setQrCodeUrls(qrCodes);
      } else {
        const url = await QRCode.toDataURL(`${type}:${dropId}`);
        setQrCodeUrls([url]);
      }
      onOpen();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadQrCode = (name: string, url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${name}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAllQrCodes = (name: string, urls: string[]) => {
    urls.forEach((url, index) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name}-piece-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const data = useMemo(() => getTableRows(dropsCreated, handleDeleteClick), [dropsCreated]);

  const handleCreateDropClose = async (
    dropCreated: any,
    isScavengerHunt: boolean,
    scavengerHunt: Array<{ piece: string; description: string }>,
    setIsModalLoading: (loading: boolean) => void,
  ) => {
    if (dropCreated) {
      setIsModalLoading(true);
      try {
        const { dropId, completeScavengerHunt } = await eventHelperInstance.createConferenceDrop({
          wallet: wallet!,
          createdDrop: dropCreated,
          isScavengerHunt,
          scavengerHunt,
        });
        toast({
          title: 'Drop created successfully.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        await getAccountInformation(); // Refresh the drop list
        const type = isTokenDrop(dropCreated) ? 'token' : 'nft';
        if (isScavengerHunt) {
          generateQRCode(dropCreated.name, dropId, type, completeScavengerHunt);
        } else {
          generateQRCode(dropCreated.name, dropId, type);
        }
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

  const TokensAvailableSection = ({ isAdmin, tokensAvailable }) => (
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
            {isAdmin ? (
              <Heading>Infinite</Heading>
              ) : (
                <Heading>{formatTokensAvailable(tokensAvailable)}</Heading>
              )}            
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

  if (isErr) {
    return (
      <NotFound404
        cta="Return to homepage"
        header="Account Unauthorized"
        subheader="Check the signed in account and try again later."
      />
    );
  }

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <CreateDropModal
        isOpen={isCreateDropModalOpen}
        modalType={dropType}
        onClose={handleCreateDropClose}
      />
      {isLoading ? (
        <Skeleton height="40px" mb="4" width="200px" />
      ) : (
        <Heading>
          Welcome {account?.display_name ? capitalizeFirstLetter(account.display_name) : ''}
        </Heading>
      )}
      {isLoading ? (
        <Skeleton height="80px" mb="4" width="100%" />
      ) : (
        <TokensAvailableSection isAdmin={isAdmin} tokensAvailable={tokensAvailable} />
      )}
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
        excludeMobileColumns={['rewards', 'dropType', 'scavengers']}
        loading={isLoading}
        mt={{ base: '6', md: '4' }}
        showColumns={true}
        showMobileTitles={['dropName', 'numClaimed']}
        type="conference-drops"
      />
      <QRViewerModal
        isOpen={isOpen}
        onClose={onClose}
        qrCodeUrls={qrCodeUrls}
        dropName={dropName}
        onDownload={(name, url) => handleDownloadQrCode(name, url)}
        onDownloadAll={(name, urls) => handleDownloadAllQrCodes(name, urls)}
      />

      {/* Admin-Specific Features */}
      {isAdmin && (
        <>
          <Heading size="md" mt="8">
            Admin Controls
          </Heading>
          <VStack align="start" spacing="4" mt="4">
            <Button onClick={() => {/* Functionality to set agenda */}}>
              Set Event Agenda
            </Button>
            <Button onClick={() => {/* Functionality to set alerts */}}>
              Set Alerts
            </Button>
            <Button onClick={() => {/* Functionality to manage sponsors */}}>
              Manage Sponsors
            </Button>
          </VStack>
        </>
      )}
    </Box>
  );
};

export default AdminDashboardPage;
