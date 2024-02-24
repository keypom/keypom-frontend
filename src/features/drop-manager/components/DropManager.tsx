import {
  Menu,
  Text,
  Image,
  VStack,
  MenuList,
  Box,
  Button,
  Heading,
  HStack,
  type TableProps,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type ProtocolReturnedKeyInfo } from 'keypom-js';

import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { file } from '@/utils/file';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext } from '@/contexts/AppContext';
import keypomInstance from '@/lib/keypom';
import { useValidMasterKey } from '@/hooks/useValidMasterKey';
import { share } from '@/utils/share';
import { setMasterKeyValidityModal } from '@/features/drop-manager/components/MasterKeyValidityModal';
import { PAGE_SIZE_LIMIT } from '@/constants/common';
import { DropManagerPagination } from '@/features/all-drops/components/DropManagerPagination';
import { DropDownButton } from '@/features/all-drops/components/DropDownButton';

import {
  KEY_CLAIM_STATUS_OPTIONS,
  KEY_CLAIM_STATUS_ITEMS,
  PAGE_SIZE_ITEMS,
  createMenuItems,
} from '../../../features/all-drops/config/menuItems';

import { setConfirmationModalHelper } from './ConfirmationModal';

export interface DropKeyItem {
  id: number;
  publicKey: string;
  link: string;
  slug: string;
  hasClaimed: boolean;
  keyInfo?: ProtocolReturnedKeyInfo;
}

export type GetDataFn = (
  data: DropKeyItem[],
  handleDelete: (pubKey: string) => Promise<void>,
  handleCopy: (link: string) => void,
) => DataItem[];

interface DropManagerProps {
  getClaimedText: (dropSize: number) => string;
  tableColumns: ColumnItem[];
  showColumns?: boolean;
  getData: GetDataFn;
  tableProps?: TableProps;
  loading?: boolean;
}

export const DropManager = ({
  getClaimedText,
  tableColumns = [],
  getData,
  showColumns = true,
  tableProps,
}: DropManagerProps) => {
  const { id: dropId = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { setAppModal } = useAppContext();
  const [wallet, setWallet] = useState({});
  const { selector, accountId } = useAuthWalletContext();
  const [dropData, setDropData] = useState<{
    id: string;
    name: string;
    type: string;
    media: string | undefined;
    claimed: string;
  }>({
    id: '',
    name: '',
    type: '',
    media: undefined,
    claimed: '',
  });
  const [loading, setLoading] = useState(true);
  const popoverClicked = useRef(0);

  const [name, setName] = useState('Untitled');
  const [totalKeys, setTotalKeys] = useState<number>(0);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const [hasPagination, setHasPagination] = useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(0);
  const [selectedFilters, setSelectedFilters] = useState<{
    status: string;
    pageSize: number;
  }>({
    status: KEY_CLAIM_STATUS_OPTIONS.ANY,
    pageSize: PAGE_SIZE_LIMIT,
  });

  const [filteredDropKeys, setFilteredDropKeys] = useState<DropKeyItem[]>([]);

  const { masterKeyValidity } = useValidMasterKey({ dropId });
  useEffect(() => {
    if (!masterKeyValidity) {
      setMasterKeyValidityModal(
        setAppModal,
        () => {
          window.location.reload();
        },
        () => {
          navigate('/drops');
        },
      );
    }
  }, [masterKeyValidity]);

  useEffect(() => {
    if (!keypomInstance || !dropId) return;

    handleDropData(dropId);
  }, [keypomInstance, dropId]);

  useEffect(() => {
    if (!accountId) return;

    handleGetKeys();
  }, [accountId, selectedFilters]);

  const handleDropData = async (dropId) => {
    const dropData = await keypomInstance.getDropData({ dropId });
    console.log('dropData', dropData);
    setDropData(dropData);
  };

  const handleGetKeys = useCallback(async () => {
    setLoading(true);
    const keyInfoReturn = await keypomInstance.getKeysInfo({ dropId });
    const { dropName, dropKeyItems } = keyInfoReturn;
    const dropSize = dropKeyItems.length;
    setWallet(await selector.wallet());

    setTotalKeys(dropSize);
    setName(dropName);

    let keys = dropKeyItems;
    if (selectedFilters.status !== KEY_CLAIM_STATUS_OPTIONS.ANY) {
      keys = keys.filter((key) => {
        if (selectedFilters.status === KEY_CLAIM_STATUS_OPTIONS.CLAIMED) {
          return key.hasClaimed;
        } else {
          return !key.hasClaimed;
        }
      });
    }
    const totalPages = Math.ceil(keys.length / selectedFilters.pageSize);
    setHasPagination(totalPages > 1);
    setNumPages(totalPages);

    setFilteredDropKeys(keys);
    setCurPage(0);
    setLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  const pageSizeMenuItems = createMenuItems({
    menuItems: PAGE_SIZE_ITEMS,
    onClick: (item) => {
      handlePageSizeSelect(item);
    },
  });

  const keyClaimStatusMenuItems = createMenuItems({
    menuItems: KEY_CLAIM_STATUS_ITEMS,
    onClick: (item) => {
      handleKeyClaimStatusSelect(item);
    },
  });

  const breadcrumbItems = [
    {
      name: 'My drops',
      href: '/drops',
    },
    {
      name,
      href: '',
    },
  ];

  const handlePageSizeSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      pageSize: parseInt(item.label),
    }));
  };

  const handleKeyClaimStatusSelect = (item) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      status: item.label,
    }));
  };

  const handleNextPage = () => {
    setCurPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setCurPage((prev) => prev - 1);
  };

  const handleExportCSVClick = async () => {
    if (data.length > 0) {
      setExporting(true);

      try {
        const links = await keypomInstance.getLinksToExport(data[0].dropId as string);
        file(`Drop ID ${data[0].dropId as string}.csv`, links.join('\r\n'));
      } catch (e) {
        console.error('error', e);
      } finally {
        setExporting(false);
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

  const handleCopyClick = (link: string) => {
    share(link);
    toast({ title: 'Copied!', status: 'success', duration: 1000, isClosable: true });
  };

  const handleDeleteClick = async (pubKey: string) => {
    setConfirmationModalHelper(
      setAppModal,
      async () => {
        await keypomInstance.deleteKeys({
          wallet: await selector?.wallet(),
          dropId,
          publicKeys: pubKey,
        });
        window.location.reload();
      },
      'key',
    );
  };

  const data = useMemo(
    () =>
      getData(
        filteredDropKeys.slice(
          curPage * selectedFilters.pageSize,
          (curPage + 1) * selectedFilters.pageSize,
        ),
        handleDeleteClick,
        handleCopyClick,
      ),
    [getData, filteredDropKeys, filteredDropKeys.length, handleCopyClick, handleDeleteClick],
  );

  const allowAction = data.length > 0;

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <Breadcrumbs items={breadcrumbItems} />
      {/* Left Section */}
      {/* Drop info section */}
      <VStack align="start" paddingTop="4" spacing="4">
        <HStack>
          <Image
            alt={`Drop image for ${dropData.id}`}
            borderRadius="md"
            boxSize="150px"
            objectFit="cover"
            src={dropData.media} // You would dynamically set this
          />
          <VStack align="start">
            <Heading fontFamily="" size="sm">
              Drop name
            </Heading>
            <Heading size="lg">{dropData.name}</Heading>
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
              <Text color="gray.600" fontSize="sm" fontWeight="medium">
                Claimed
              </Text>
              <Heading>{getClaimedText(totalKeys)}</Heading>
            </VStack>
          </Box>
        </HStack>
      </VStack>

      {/* Top Section */}
      <HStack justify="space-between">
        <Heading paddingBottom="0" paddingTop="4">
          All Keys
        </Heading>
        {/* Right Section */}
        <HStack alignItems="end" justify="end" mt="1rem !important">
          <Menu>
            {({ isOpen }) => (
              <Box>
                <DropDownButton
                  isOpen={isOpen}
                  placeholder={`Status: ${selectedFilters.status}`}
                  variant="secondary"
                  onClick={() => (popoverClicked.current += 1)}
                />
                <MenuList minWidth="auto">{keyClaimStatusMenuItems}</MenuList>
              </Box>
            )}
          </Menu>
          <Button
            height="auto"
            isDisabled={!allowAction}
            isLoading={deleting}
            lineHeight=""
            px="6"
            py="3"
            textColor="red.500"
            variant="secondary"
            w={{ base: '100%', sm: 'initial' }}
            onClick={handleCancelAllClick}
          >
            Cancel all
          </Button>
          <Button
            height="auto"
            isDisabled={!allowAction}
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
      <Box>
        <DataTable
          columns={tableColumns}
          data={data}
          loading={loading}
          mt={{ base: '6', md: '4' }}
          showColumns={showColumns}
          {...tableProps}
        />

        <DropManagerPagination
          curPage={curPage}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          hasPagination={hasPagination}
          numPages={numPages}
          pageSizeMenuItems={pageSizeMenuItems}
          rowsSelectPlaceholder={selectedFilters.pageSize.toString()}
          onClickRowsSelect={() => (popoverClicked.current += 1)}
        />
      </Box>
    </Box>
  );
};
