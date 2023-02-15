import {
  Box,
  Button,
  Heading,
  HStack,
  Stack,
  type TableProps,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { Breadcrumbs } from '@/components/Breadcrumbs';

interface DropManagerProps {
  dropName: string;
  claimedHeaderText: string;
  claimedText: string;
  tableColumns: ColumnItem[];
  showColumns?: boolean;
  data: DataItem[];
  tableProps?: TableProps;
  loading?: boolean;
  onExportCSVClick?: () => void;
  onCancelAllClick?: () => void;
}

export const DropManager = ({
  dropName,
  claimedHeaderText,
  claimedText,
  tableColumns = [],
  data = [],
  showColumns = true,
  tableProps,
  loading = false,
}: DropManagerProps) => {
  /** Pagination utils */
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0, // set the starting page index
    pageSize: 10, // set the default page size
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  );

  const hasPagination = pagination.pageSize < data.length;
  const firstPage = pagination.pageIndex === 0;
  const lastPage = pagination.pageSize * (pagination.pageIndex + 1) > data.length;

  const handleNextPage = () => {
    if (lastPage) return; // last page
    setPagination((prev) => ({
      pageIndex: prev.pageIndex + 1,
      pageSize: pagination?.pageSize,
    }));
  };

  const handlePrevPage = () => {
    if (firstPage) return; // first page
    setPagination((prev) => ({
      pageIndex: prev.pageIndex - 1,
      pageSize: pagination?.pageSize,
    }));
  };
  /** end of pagination */

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
              <Heading>{dropName}</Heading>
            </Stack>

            {/* Drops claimed */}
            <Stack maxW={{ base: 'full', md: '22.5rem' }}>
              <Text color="gray.800">{claimedHeaderText}</Text>
              <Heading>{claimedText}</Heading>
            </Stack>
          </Stack>
          <Text>Track link status and export to them to CSV for use in email campaigns here.</Text>
        </Box>

        {/* Right Section */}
        <HStack alignItems="end" justify="end" mt="1rem !important">
          {hasPagination && (
            <IconButton
              aria-label="previous-page-button"
              icon={<ChevronLeftIcon h="5" w="5" />}
              isDisabled={!!firstPage}
              onClick={handlePrevPage}
            />
          )}
          <Button variant="secondary" w={{ base: '100%', sm: 'initial' }}>
            Cancel all
          </Button>
          <Button variant="secondary" w={{ base: '100%', sm: 'initial' }}>
            Export .CSV
          </Button>
          {hasPagination && (
            <IconButton
              aria-label="next-page-button"
              icon={<ChevronRightIcon h="5" w="5" />}
              isDisabled={!!lastPage}
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
          pagination={pagination}
          setPagination={setPagination}
          showColumns={showColumns}
          {...tableProps}
        />
      </Box>
    </Box>
  );
};
