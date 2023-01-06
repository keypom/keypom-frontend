import { Box, Button, HStack, Stack } from '@chakra-ui/react';

import { Breadcrumbs } from '@/common/components/Breadcrumbs';
import { Heading, Text } from '@/common/components/Typography';
import { ColumnItem, DataItem } from '@/common/components/Table/types';
import { DataTable } from '@/common/components/Table';

interface DropManagerProps {
  dropName: string;
  claimedHeaderText: string;
  claimedText: string;
  tableColumns: ColumnItem[];
  showColumns?: boolean;
  data: DataItem[];
  onExportCSVClick?: () => void;
  onCancelAllClick?: () => void;
  onCopyClick?: () => void;
  onDeleteClick?: () => void;
}

export const DropManager = ({
  dropName,
  claimedHeaderText,
  claimedText,
  tableColumns = [],
  data = [],
  showColumns = true,
  onCopyClick,
  onDeleteClick,
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

  // const getDesktopTableBody = () =>
  //   data.map((drop) => (
  //     <Tr key={drop.id}>
  //       {tableColumns.map((column) => (
  //         <Td key={`${column.title}-${drop.id}`}>{column.selector(drop)}</Td>
  //       ))}
  //       <Td display="flex" justifyContent="right" verticalAlign="middle">
  //         <Button mr="1" size="sm" variant="icon" onClick={onCopyClick}>
  //           <CopyIcon />
  //         </Button>
  //         <Button size="sm" variant="icon" onClick={onDeleteClick}>
  //           <DeleteIcon color="red" />
  //         </Button>
  //       </Td>
  //     </Tr>
  //   ));

  // const getMobileTableBody = () =>
  //   data.map((drop) => (
  //     <Tr key={drop.id}>
  //       <Td>
  //         <VStack align="flex-start" spacing="2">
  //           {tableColumns.map((column) => (
  //             <Box key={`${drop.id}-${column.title}`}>{column.selector(drop)}</Box>
  //           ))}
  //         </VStack>
  //       </Td>
  //       <Td display="flex" justifyContent="right">
  //         <Button mr="1" size="sm" variant="icon" onClick={onCopyClick}>
  //           <CopyIcon />
  //         </Button>
  //         <Button size="sm" variant="icon" onClick={onDeleteClick}>
  //           <DeleteIcon color="red" />
  //         </Button>
  //       </Td>
  //     </Tr>
  //   ));

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
              <Heading>Star Invader 3</Heading>
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
          <Button variant="secondary" w={{ base: '100%', sm: 'initial' }}>
            Cancel all
          </Button>
          <Button variant="secondary" w={{ base: '100%', sm: 'initial' }}>
            Export .CSV
          </Button>
        </HStack>
      </Stack>
      <Box>
        <DataTable
          columns={tableColumns}
          data={data}
          mt={{ base: '4', md: '6' }}
          showColumns={showColumns}
        />
      </Box>
    </Box>
  );
};