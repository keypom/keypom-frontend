import {
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
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { type ProtocolReturnedKeyInfo } from 'keypom-js';

import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NextButton, PrevButton } from '@/components/Pagination';
import { file } from '@/utils/file';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext } from '@/contexts/AppContext';
import keypomInstance from '@/lib/keypom';
import { useValidMasterKey } from '@/hooks/useValidMasterKey';
import { usePagination } from '@/hooks/usePagination';
import { PAGE_QUERY_PARAM, PAGE_SIZE_LIMIT } from '@/constants/common';
import getConfig from '@/config/config';
import { share } from '@/utils/share';
import { setMasterKeyValidityModal } from '@/features/drop-manager/components/MasterKeyValidityModal';

import { setConfirmationModalHelper } from './ConfirmationModal';
import { setMissingDropModal } from './MissingDropModal';

export interface DropKeyItem {
  id: number;
  publicKey: string;
  link: string;
  slug: string;
  hasClaimed: boolean;
  keyInfo?: ProtocolReturnedKeyInfo;
  secretKey: string;
  [key: string]: any;
}

export type GetDataFn = (
  data: DropKeyItem[],
  handleDelete: (pubKey: string) => Promise<void>,
  handleCopy: (link: string) => void,
) => Promise<DataItem[]>;

interface DropManagerProps {
  claimedHeaderText: string;
  getClaimedText: (dropSize: number) => string;
  tableColumns: ColumnItem[];
  showColumns?: boolean;
  getData: GetDataFn;
  tableProps?: TableProps;
  loading?: boolean;
}

// TODO: might want to reconsider refactoring this into a context instead
// there's a lot of data passing back and forth between child and parent component
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

  const [name, setName] = useState('Untitled');
  const [data, setData] = useState<DataItem[]>([]);
  const [dropKeys, setDropKeys] = useState<DropKeyItem[]>([]);
  const [totalKeys, setTotalKeys] = useState<number>(0);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  const {
    setPagination,
    hasPagination,
    pagination,
    isFirstPage,
    isLastPage,
    loading: paginationLoading,
    handleNextPage,
    handlePrevPage,
  } = usePagination({
    dataSize: totalKeys,
    handlePrevApiCall: async () => {
      const prevPageIndex = pagination.pageIndex - 1;
      await handleGetDrops({
        pageIndex: prevPageIndex,
        pageSize: pagination.pageSize,
      });
      const newQueryParams = new URLSearchParams({
        [PAGE_QUERY_PARAM]: (prevPageIndex + 1).toString(),
      });
      setSearchParams(newQueryParams);
    },
    handleNextApiCall: async () => {
      const nextPageIndex = pagination.pageIndex + 1;
      await handleGetDrops({
        pageIndex: nextPageIndex,
        pageSize: pagination.pageSize,
      });
      const newQueryParams = new URLSearchParams({
        [PAGE_QUERY_PARAM]: (nextPageIndex + 1).toString(),
      });
      setSearchParams(newQueryParams);
    },
  });

  const getWallet = async () => {
    if (selector === null) {
      return;
    }
    try {
      const selectorWallet = await selector?.wallet();
      setWallet(selectorWallet);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getWallet();
  }, [selector]);

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

  const handleGetDrops = useCallback(
    async ({ pageIndex = 0, pageSize = PAGE_SIZE_LIMIT }) => {
      if (!accountId) return;
      const keyInfoReturn = await keypomInstance.getKeysInfo(dropId, pageIndex, pageSize, () => {
        setMissingDropModal(setAppModal); // User will be redirected if getDropInformation fails
        navigate('/drops');
      });
      if (
        keyInfoReturn === undefined ||
        keyInfoReturn?.secretKeys === undefined ||
        keyInfoReturn?.publicKeys === undefined
      ) {
        navigate('/drops');
        return;
      }
      const { dropSize, dropName, publicKeys, secretKeys, keyInfo } = keyInfoReturn;
      setTotalKeys(dropSize);
      setName(dropName);

      const dropKeys = secretKeys.map((key: string, i) => ({
        id: i,
        publicKey: publicKeys[i],
        link: `${window.location.origin}/claim/${getConfig().contractId}#${key.replace(
          'ed25519:',
          '',
        )}`,
        slug: key.substring(8, 16),
        hasClaimed: keyInfo[i] === null,
        keyInfo: keyInfo[i],
        secretKey: key,
      }));

      setData(await getData(dropKeys, handleDeleteClick, handleCopyClick));
      setLoading(false);
    },
    [pagination],
  );

  useEffect(() => {
    // page query param should be indexed from 1
    const pageQuery = searchParams.get('page');
    const currentPageIndex = pageQuery !== null ? parseInt(pageQuery) - 1 : 0;
    setPagination((pagination) => ({ ...pagination, pageIndex: currentPageIndex }));

    handleGetDrops({ ...pagination, pageIndex: currentPageIndex });
  }, [accountId]);

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
          {hasPagination && (
            <PrevButton
              isDisabled={!!isFirstPage}
              isLoading={paginationLoading.previous}
              onClick={handlePrevPage}
            />
          )}
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
          {hasPagination && (
            <NextButton
              isDisabled={!!isLastPage}
              isLoading={paginationLoading.next}
              onClick={handleNextPage}
            />
          )}
        </HStack>
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
      </Box>
    </Box>
  );
};
