import { Box, Button, Heading, HStack, Stack, type TableProps, Text } from '@chakra-ui/react';

import { type ColumnItem, type DataItem } from '@/components/Table/types';
import { DataTable } from '@/components/Table';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { NextButton, PrevButton } from '@/components/Pagination';
import { file } from '@/utils/file';

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
    firstPage: boolean;
    lastPage: boolean;
    handlePrevPage: () => void;
    handleNextPage: () => void;
  };
  tableProps?: TableProps;
  loading?: boolean;
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
  pagination,
  onCancelAllClick,
  loading = false,
}: DropManagerProps) => {
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

  const handleExportCSVClick = () => {
    if (data.length > 0) {
      const links = data.map(({ dropLink }) => `${dropLink as string}`);
      file(`Drop ID ${data[0].dropId as string}`, links.join('\r\n'));
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
              <Heading>{dropName}</Heading>
            </Stack>

            {/* Drops claimed */}
            <Stack maxW={{ base: 'full', md: '22.5rem' }}>
              <Text color="gray.800">{claimedHeaderText}</Text>
              <Heading>{claimedText}</Heading>
            </Stack>
          </Stack>
          <Text>Track link status and export them to CSV for use in email campaigns here.</Text>
        </Box>

        {/* Right Section */}
        <HStack alignItems="end" justify="end" mt="1rem !important">
          {pagination?.hasPagination && (
            <PrevButton
              id={pagination.id}
              isDisabled={!!pagination.firstPage}
              isLoading={pagination.paginationLoading.previous}
              onClick={pagination.handlePrevPage}
            />
          )}
          <Button
            variant="secondary"
            w={{ base: '100%', sm: 'initial' }}
            onClick={onCancelAllClick}
          >
            Cancel all
          </Button>
          <Button
            variant="secondary"
            w={{ base: '100%', sm: 'initial' }}
            onClick={handleExportCSVClick}
          >
            Export .CSV
          </Button>
          {pagination?.hasPagination && (
            <NextButton
              id={pagination.id}
              isDisabled={!!pagination.lastPage}
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
