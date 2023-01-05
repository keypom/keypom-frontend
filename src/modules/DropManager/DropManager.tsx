import { Box, Button, HStack, Stack, TableContainer, Tbody, Th, Thead, Tr } from '@chakra-ui/react';

import { Breadcrumbs } from '@/common/components/Breadcrumbs';
import { Heading, Text } from '@/common/components/Typography';
import { DeleteIcon } from '@/common/components/Icons';
import { Td, Table } from '@/common/components/Table';

type Primitive = string | number | boolean;

interface DataItem {
  id: string | number;
  [key: string]: React.ReactNode | Primitive;
}

interface ColumnItem {
  title: string;
  selector: (arg: DataItem) => React.ReactNode | Primitive;
}

interface DropManagerProps {
  dropName: string;
  claimedHeaderText: string;
  claimedText: string;
  onExportCSVClick?: () => void;
  onCancelAllClick?: () => void;
  tableColumns: ColumnItem[];
  showColumns?: boolean;
  data: DataItem[];
}

export const DropManager = ({
  dropName,
  claimedHeaderText,
  claimedText,
  tableColumns = [],
  data = [],
  showColumns = true,
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

  const getDesktopTableBody = () =>
    data.map((drop) => (
      <Tr key={drop.id}>
        {tableColumns.map((column) => (
          <Td key={`${column.title}-${drop.id}`}>{column.selector(drop)}</Td>
        ))}
        <Td display="flex" justifyContent="right">
          <Button size="sm" variant="icon">
            <DeleteIcon color="red" />
          </Button>
        </Td>
      </Tr>
    ));

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
        <HStack alignItems="end" justify="center" mt="1rem !important">
          <Button variant="secondary" w={{ base: '100%', sm: 'initial' }}>
            Cancel all
          </Button>
          <Button variant="secondary" w={{ base: '100%', sm: 'initial' }}>
            Export .CSV
          </Button>
        </HStack>
      </Stack>
      <Box>
        {/* Desktop Table - TODO: Refactor Table component to include mobile version */}
        <TableContainer>
          <Table mt={{ base: '4', md: '6' }}>
            {showColumns && (
              <Thead>
                <Tr>
                  {tableColumns.map((col) => (
                    <Th key={col.title}>{col.title}</Th>
                  ))}
                  {/* Actions header */}
                  <Th></Th>
                </Tr>
              </Thead>
            )}
            <Tbody>{getDesktopTableBody()}</Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
