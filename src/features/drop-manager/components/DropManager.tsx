import {
  Menu,
  MenuList,
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  type TableProps,
  Text,
  Skeleton,
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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

import {
  KEY_CLAIM_STATUS_OPTIONS,
  KEY_CLAIM_STATUS_ITEMS,
  PAGE_SIZE_ITEMS,
  createMenuItems,
} from '../../../features/all-drops/config/menuItems';

import { setConfirmationModalHelper } from './ConfirmationModal';
import { DropDownButton } from '@/features/all-drops/components/DropDownButton';

const COLUMNS: ColumnItem[] = [
  {
    id: 'link',
    title: 'Link',
    selector: (drop) => drop.name,
    thProps: {
      minW: '240px',
    },
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'claimStatus',
    title: 'Claimed',
    selector: (drop) => drop.claimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
    title: '',
    selector: (drop) => drop.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
    },
    loadingElement: <Skeleton height="30px" />,
  },
];

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
  claimedHeaderText: string;
  getClaimedText: (dropSize: number) => string;
  tableColumns: ColumnItem[];
  showColumns?: boolean;
  getData: GetDataFn;
  tableProps?: TableProps;
  loading?: boolean;
}

export const DropManager = ({
  claimedHeaderText,
  getClaimedText,
  tableColumns = [],
  getData,
  showColumns = true,
  tableProps,
}: DropManagerProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: dropId = '' } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { setAppModal } = useAppContext();
  const [wallet, setWallet] = useState({});
  const { selector, accountId } = useAuthWalletContext();
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

  const handleGetKeys = useCallback(async () => {
    setLoading(true);
    const keyInfoReturn = await keypomInstance.getKeysInfo({ dropId });
    const { dropName, publicKeys, secretKeys, dropKeyItems } = keyInfoReturn;
    const dropSize = publicKeys.length;
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

  useEffect(() => {
    if (!accountId) return;

    handleGetKeys();
  }, [accountId, selectedFilters]);

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
    console.log('item', item);
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
      <Stack direction={{ base: 'column', md: 'row' }}>
        {/* Left Section */}
        <Box flexGrow="1">
          <Stack
            direction={{ base: 'column', md: 'row' }}
            pb={{ base: '4', md: '6' }}
            pt={{ base: '4', md: '10' }}
            spacing={{ base: '4', md: '3.125rem' }}
          >
            {/* Drop name */}
            <Stack maxW={{ base: 'full', md: '22.5rem' }}>
              <Text color="gray.800">Drop name</Text>
              <Skeleton isLoaded={!loading}>
                <Heading>{name}</Heading>
              </Skeleton>
            </Stack>

            {/* Drops claimed */}
            <Stack maxW={{ base: 'full', md: '22.5rem' }}>
              <Text color="gray.800">{claimedHeaderText}</Text>
              <Skeleton isLoaded={!loading}>
                <Heading>{getClaimedText(totalKeys)}</Heading>
              </Skeleton>
            </Stack>
          </Stack>
          <Text>Track link status and export them to CSV for use in email campaigns here.</Text>
        </Box>

        {/* Right Section */}
        <HStack alignItems="end" justify="end" mt="1rem !important">
          <Menu>
            {({ isOpen }) => (
              <Box>
                <DropDownButton
                  isOpen={isOpen}
                  placeholder={`Claimed: ${selectedFilters.status}`}
                  variant="secondary"
                  onClick={() => (popoverClicked.current += 1)}
                />
                <MenuList minWidth="auto">{keyClaimStatusMenuItems}</MenuList>
              </Box>
            )}
          </Menu>
          <Button
            isDisabled={!allowAction}
            isLoading={deleting}
            variant="secondary"
            w={{ base: '100%', sm: 'initial' }}
            onClick={handleCancelAllClick}
          >
            Cancel all
          </Button>
          <Button
            isDisabled={!allowAction}
            isLoading={exporting}
            variant="secondary"
            w={{ base: '100%', sm: 'initial' }}
            onClick={handleExportCSVClick}
          >
            Export .CSV
          </Button>
      </Stack>
      <Box>
        <DataTable
          columns={tableColumns}
          data={data}
          loading={loading}
          mt={{ base: '4', md: '6' }}
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
