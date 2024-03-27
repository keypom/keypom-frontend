import {
  TableContainer,
  Show,
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
  type?:
    | 'all-drops'
    | 'drop-manager'
    | 'no-filtered-keys'
    | 'no-filtered-drops'
    | 'event-manager'
    | 'all-tickets'
    | 'no-filtered-events'
    | 'all-events'
    | 'no-filtered-tickets'
    | 'create-tickets'
    | 'collect-info';
  showColumns?: boolean;
  columns: ColumnItem[];
  data: DataItem[];
  loading?: boolean;
  showMobileTitles: string[];
  excludeMobileColumns: string[];
}

export const DataTable = ({
  type = 'drop-manager',
  showColumns = true,
  columns = [],
  data = [],
  loading = false,
  showMobileTitles = [],
  excludeMobileColumns = [],
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

    return data.map((drop) => (
      <Tr
        key={drop.id}
        _hover={
          (drop.href as string | undefined)
            ? {
                cursor: 'pointer',
                background: 'gray.50',
              }
            : {}
        }
        onClick={
          (drop.href as string | undefined)
            ? () => {
                navigate(drop.href as string);
              }
            : undefined
        }
      >
        {columns.map((column, i) => (
          <Td key={`${column.id}-${drop.id}-${i}`} {...column.tdProps}>
            {column.selector(drop)}
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
              <Table {...props} borderRadius="12px">
                {showColumns && (
                  <Thead>
                    <Tr>
                      {columns.map((col, index) => (
                        <Th
                          key={col.id}
                          fontFamily="body"
                          {...col.thProps}
                          // Apply a border radius of 12px to the first and last Th elements
                          borderTopLeftRadius={index === 0 ? '12px !important' : undefined}
                          borderTopRightRadius={
                            index === columns.length - 1 ? '12px !important' : undefined
                          }
                        >
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
          <Show below="md">
            <MobileDataTable
              columns={columns}
              data={data}
              excludeMobileTitles={excludeMobileColumns}
              loading={loading}
              showMobileTitles={showMobileTitles}
              {...props}
            />
          </Show>
        </>
      ) : (
        <IconBox h="full" mt={{ base: '6', md: '7' }} pb={{ base: '6', md: '16' }} w="full">
          <Center>
            <VStack>
              <Heading fontSize={{ base: 'xl', md: '2xl' }} fontWeight="600">
                {EMPTY_TABLE_TEXT_MAP[type].heading}
              </Heading>
              <Text>{EMPTY_TABLE_TEXT_MAP[type].text}</Text>
            </VStack>
          </Center>
        </IconBox>
      )}
    </>
  );
};
