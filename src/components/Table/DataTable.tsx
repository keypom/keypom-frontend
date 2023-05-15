import {
  TableContainer,
  Show,
  Hide,
  Tbody,
  Table,
  type TableProps,
  Tr,
  Td,
  Thead,
  Th,
  Center,
  Text,
  Heading,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { IconBox } from '../IconBox';

import { EMPTY_TABLE_TEXT_MAP } from './constants';
import { MobileDataTable } from './MobileDataTable';
import { type ColumnItem, type DataItem } from './types';

/**
 * Example
 *
 * data = [{ name: 'Eric', age: 21 }]
 * columns = [
 *  { title: 'Name', selector: (row) => row.name },
 *  { title: 'Age', selector: (row) => row.age }
 * ]
 */

interface DataTableProps extends TableProps {
  type?: 'all-drops' | 'drop-manager';
  showColumns?: boolean;
  columns: ColumnItem[];
  data: DataItem[];
  loading?: boolean;
  emptyText?: string;
}

export const DataTable = ({
  type = 'drop-manager',
  showColumns = true,
  columns = [],
  data = [],
  loading = false,
  emptyText,
  ...props
}: DataTableProps) => {
  const navigate = useNavigate();

  const getDesktopTableBody = () => {
    if (loading) {
      return Array.from([1, 2, 3]).map((_, index) => (
        <Tr key={index}>
          {columns.map((column, colIndex) => (
            <Td key={`${column.title}-${index}-${colIndex}`} {...column.tdProps}>
              {column.loadingElement}
            </Td>
          ))}
        </Tr>
      ));
    }

    return data.map((val) => (
      <Tr
        key={val.id}
        _hover={
          (val.href as string | undefined)
            ? {
                cursor: 'pointer',
                background: 'gray.50',
              }
            : {}
        }
        onClick={
          (val.href as string | undefined)
            ? () => {
                navigate(val.href as string);
              }
            : undefined
        }
      >
        {columns.map((column, i) => (
          <Td key={`${column.id}-${val.id}-${i}`} {...column.tdProps}>
            {column.selector(val)}
          </Td>
        ))}
      </Tr>
    ));
  };

  return (
    <>
      {loading || data.length > 0 ? (
        <>
          {/* Desktop Table */}
          <Show above="md">
            <TableContainer>
              <Table {...props}>
                {showColumns && (
                  <Thead>
                    <Tr>
                      {columns.map((col) => (
                        <Th key={col.id} fontFamily="body" {...col.thProps}>
                          {col.title}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                )}
                <Tbody>{getDesktopTableBody()}</Tbody>
              </Table>
            </TableContainer>
          </Show>

          {/* Mobile table */}
          <Hide above="md">
            <MobileDataTable columns={columns} data={data} loading={loading} {...props} />
          </Hide>
        </>
      ) : (
        <IconBox h="full" mt={{ base: '6', md: '7' }} pb={{ base: '6', md: '16' }} w="full">
          <Center>
            <VStack>
              <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="600">
                {emptyText || EMPTY_TABLE_TEXT_MAP[type].heading}
              </Heading>
              <Text>{EMPTY_TABLE_TEXT_MAP[type].text}</Text>
            </VStack>
          </Center>
        </IconBox>
      )}
    </>
  );
};
