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
}

export const MobileDataTable = ({
  columns,
  data,
  loading = false,
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
        <Td>
          <VStack align="flex-start" spacing="2">
            {columns
              .filter((column) => actionColumn.title !== column.title) // exclude action column
              .map((column) => (
                <Box key={`${drop.id}-${column.id}`}>{column.selector(drop)}</Box>
              ))}
          </VStack>
        </Td>
        <Td verticalAlign="middle">{actionColumn.selector(drop)}</Td>
      </Tr>
    ));
  };

  return (
    <TableContainer whiteSpace="normal">
      <Table {...props}>
        <Tbody>{getMobileTableBody()}</Tbody>
      </Table>
    </TableContainer>
  );
};
