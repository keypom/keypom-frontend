import {
  Menu,
  Show,
  Hide,
  Spinner,
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
  useDisclosure,
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
import { FilterOptionsMobileButton } from '@/features/all-drops/components/FilterOptionsMobileButton';
import { MobileDrawerMenu } from '@/features/all-drops/components/MobileDrawerMenu';

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
  placeholderImage: string;
  getClaimedText: (dropSize: number) => string;
  tableColumns: ColumnItem[];
  showColumns?: boolean;
  getData: GetDataFn;
  tableProps?: TableProps;
  loading?: boolean;
  dropImageSize?: string;
}

export const DropManager = ({
  placeholderImage,
  getClaimedText,
  tableColumns = [],
  getData,
  showColumns = true,
  dropImageSize = '150px',
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
    media: 'loading',
    claimed: '',
  });
  const [loading, setLoading] = useState(true);
  const [isAllKeysLoading, setIsAllKeysLoading] = useState(true);

  const popoverClicked = useRef(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [name, setName] = useState('Untitled');
  const [totalKeys, setTotalKeys] = useState<number>(0);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

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

    // First get enough data with the current filters to fill the page size
    handleGetInitialKeys();
  }, [accountId]);

  useEffect(() => {
    if (!accountId) return;

    // In parallel, fetch all the drops
    handleGetAllKeys();
  }, [accountId, selectedFilters]);

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

  const getTableType = () => {
    if (filteredDropKeys.length === 0 && totalKeys === 0) {
      return 'drop-manager';
    }
    return 'no-filtered-keys';
  };

  const handleDropData = async (dropId) => {
    const dropData = await keypomInstance.getDropData({ dropId });
    setName(dropData.name);
    setDropData(dropData);
  };

  const handleFiltering = (keys) => {
    if (selectedFilters.status !== KEY_CLAIM_STATUS_OPTIONS.ANY) {
      keys = keys.filter((key) => {
        if (selectedFilters.status === KEY_CLAIM_STATUS_OPTIONS.CLAIMED) {
          return key.hasClaimed;
        } else {
          return !key.hasClaimed;
        }
      });
    }
    return keys;
  };

  const handleGetAllKeys = useCallback(async () => {
    setIsAllKeysLoading(true);
    const keyInfoReturn = await keypomInstance.getAllKeysInfo({ dropId });
    const { dropKeyItems } = keyInfoReturn;
    const filteredKeys = handleFiltering(dropKeyItems);
    setFilteredDropKeys(filteredKeys);

    const totalPages = Math.ceil(filteredKeys.length / selectedFilters.pageSize);
    setNumPages(totalPages);

    setCurPage(0);
    setIsAllKeysLoading(false);
  }, [accountId, selectedFilters, keypomInstance]);

  const handleGetInitialKeys = useCallback(async () => {
    setLoading(true);

    const dropInfo = await keypomInstance.getDropInfo({ dropId });
    const totalKeySupply = dropInfo.next_key_id;
    setTotalKeys(totalKeySupply);

    // Loop until we have enough filtered drops to fill the page size
    let keysFetched = 0;
    let filteredKeys = [];
    while (keysFetched < totalKeySupply && filteredKeys.length < selectedFilters.pageSize) {
      const dropKeyItems = await keypomInstance.getPaginatedKeysInfo({
        dropId,
        start: keysFetched,
        limit: selectedFilters.pageSize,
      });

      keysFetched += dropKeyItems.length;

      const curFiltered = handleFiltering(dropKeyItems);
      filteredKeys = filteredKeys.concat(curFiltered);
    }

    if (filteredKeys.length !== 0) {
      setFilteredDropKeys(filteredKeys);
    }
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

  const mobileCancelButton = (
    <Button
      height="auto"
      isDisabled={!allowAction}
      isLoading={deleting}
      lineHeight=""
      px="6"
      py="3"
      textColor="red.500"
      variant="secondary"
      w={{ base: '100%' }}
      onClick={handleCancelAllClick}
    >
      Cancel all
    </Button>
  );

  return (
    <Box px="1" py={{ base: '3.25rem', md: '5rem' }}>
      <Breadcrumbs items={breadcrumbItems} />
      {/* Drop info section */}
      <VStack align="start" paddingTop="4" spacing="4">
        <HStack>
          {dropData.media === 'loading' ? (
            <Spinner />
          ) : (
            <Image
              alt={`Drop image for ${dropData.id}`}
              borderRadius="12px"
              boxSize={dropImageSize}
              objectFit="cover"
              src={dropData.media || placeholderImage} // Use dropData.media or fallback to placeholder
              onError={(e) => {
                // eslint-disable-next-line no-console
                console.warn('error loading image', e);
                setDropData((prev) => ({ ...prev, media: placeholderImage }));
              }}
            />
          )}
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
              <Text color="gray.400" fontSize="lg" fontWeight="medium">
                Claimed
              </Text>
              <Heading>{getClaimedText(totalKeys)}</Heading>
            </VStack>
          </Box>
        </HStack>
      </VStack>

      {/* Desktop Menu */}
      <Show above="md">
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
          excludeMobileColumns={[]}
          loading={loading}
          mt={{ base: '6', md: '4' }}
          showColumns={showColumns}
          showMobileTitles={[]}
          type={getTableType()}
          {...tableProps}
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
        customButton={mobileCancelButton}
        filters={[
          {
            label: 'Status',
            value: selectedFilters.status,
            menuItems: keyClaimStatusMenuItems,
          },
        ]}
        isOpen={isOpen}
        title="More Options"
        onClose={onClose}
      />
    </Box>
  );
};
