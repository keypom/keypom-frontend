import {
  Box,
  Table,
  TableContainer,
  type TableProps,
  Tbody,
  Td,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { type ColumnItem, type DataItem } from './types';

interface MobileDataTableProps extends TableProps {
  showColumns?: boolean;
  columns: ColumnItem[];
  data: DataItem[];
  loading: boolean;
  showMobileTitles: string[];
  excludeMobileTitles: string[];
}

export const MobileDataTable = ({
  columns,
  data,
  loading = false,
  showMobileTitles = [],
  excludeMobileTitles = [],
  ...props
}: MobileDataTableProps) => {
  const navigate = useNavigate();

  const actionColumn = columns[columns.length - 1];
  const getMobileTableBody = () => {
    if (loading) {
      return Array.from([1, 2, 3]).map((_, index) => (
        <Tr key={index}>
          {columns.map((column, colIndex) => (
            <Td key={`${column.id}-${index}-${colIndex}`} {...column.tdProps}>
              {column.loadingElement}
            </Td>
          ))}
        </Tr>
      ));
    }

    return data.map((drop, idx) => (
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
        <Td>
          <VStack align="flex-start" spacing="2">
            {columns
              .filter(
                (column) =>
                  actionColumn.id !== column.id && !excludeMobileTitles.includes(column.id),
              ) // exclude action column
              .map((column) => (
                <Box key={`${drop.id}-${column.id}`}>
                  {showMobileTitles.includes(column.id) ? `${column.title}: ` : ''}
                  {column.selector(drop)}
                </Box>
              ))}
          </VStack>
        </Td>
        <Td textAlign="end" verticalAlign="middle">
          {actionColumn.selector(drop)}
        </Td>
      </Tr>
    ));
  };

  return (
    <TableContainer whiteSpace="normal">
      <Table {...props} borderRadius="12px">
        <Tbody>{getMobileTableBody()}</Tbody>
      </Table>
    </TableContainer>
  );
};
