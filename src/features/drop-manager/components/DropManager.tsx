import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  type TableProps,
  Text,
  Skeleton,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NextButton, PrevButton } from '@/components/Pagination';
import { file } from '@/utils/file';
import { useAuthWalletContext } from '@/contexts/AuthWalletContext';
import { useAppContext } from '@/contexts/AppContext';
import keypomInstance from '@/lib/keypom';

import { setConfirmationModalHelper } from './ConfirmationModal';

interface DropManagerProps {
  dropName: string;
  claimedHeaderText: string;
  claimedText: string;
  tableColumns: ColumnItem[];
  showColumns?: boolean;
  data: DataItem[];
  pagination?: {
    hasPagination: boolean;
    id: string;
    paginationLoading: {
      previous: boolean;
      next: boolean;
    };
    isFirstPage: boolean;
    isLastPage: boolean;
    handlePrevPage: () => void;
    handleNextPage: () => void;
  };
  tableProps?: TableProps;
  loading?: boolean;
}

export const DropManager = ({
  dropName,
  claimedHeaderText,
  claimedText,
  tableColumns = [],
  data = [],
  showColumns = true,
  tableProps,
  pagination,
  loading = false,
}: DropManagerProps) => {
  const navigate = useNavigate();
  const { setAppModal } = useAppContext();
  const [wallet, setWallet] = useState({});
  const { selector } = useAuthWalletContext();

  const [deleting, setDeleting] = useState<boolean>(false);
  const [exporting, setExporting] = useState<boolean>(false);

  useEffect(() => {
    if (selector === null) return;

    const getWallet = async () => {
      setWallet(await selector.wallet());
    };
    getWallet();
  }, [selector]);

  const breadcrumbItems = [
    {
      name: 'All drops',
      href: '/drops',
    },
    {
      name: dropName,
      href: '',
    },
  ];

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
        () => null,
        'drop',
      );
      console.log('deleting drop', dropId);
      setDeleting(false);
    }
  };

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
                <Heading>{dropName}</Heading>
              </Skeleton>
            </Stack>

            {/* Drops claimed */}
            <Stack maxW={{ base: 'full', md: '22.5rem' }}>
              <Text color="gray.800">{claimedHeaderText}</Text>
              <Skeleton isLoaded={!loading}>
                <Heading>{claimedText}</Heading>
              </Skeleton>
            </Stack>
          </Stack>
          <Text>Track link status and export them to CSV for use in email campaigns here.</Text>
        </Box>

        {/* Right Section */}
        <HStack alignItems="end" justify="end" mt="1rem !important">
          {pagination?.hasPagination && (
            <PrevButton
              id={pagination.id}
              isDisabled={!!pagination.isFirstPage}
              isLoading={pagination.paginationLoading.previous}
              onClick={pagination.handlePrevPage}
            />
          )}
          <Button
            isLoading={deleting}
            variant="secondary"
            w={{ base: '100%', sm: 'initial' }}
            onClick={handleCancelAllClick}
          >
            Cancel all
          </Button>
          <Button
            isLoading={exporting}
            variant="secondary"
            w={{ base: '100%', sm: 'initial' }}
            onClick={handleExportCSVClick}
          >
            Export .CSV
          </Button>
          {pagination?.hasPagination && (
            <NextButton
              id={pagination.id}
              isDisabled={!!pagination.isLastPage}
              isLoading={pagination.paginationLoading.next}
              onClick={pagination.handleNextPage}
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
