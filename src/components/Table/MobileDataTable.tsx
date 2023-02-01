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
import React from 'react';

import { type ColumnItem, type DataItem } from './types';

interface MobileDataTableProps extends TableProps {
  showColumns?: boolean;
  columns: ColumnItem[];
  data: DataItem[];
}

export const MobileDataTable = ({ columns, data, ...props }: MobileDataTableProps) => {
  const actionColumn = columns[columns.length - 1];
  const getMobileTableBody = () =>
    data.map((drop) => (
      <Tr key={drop.id}>
        <Td>
          <VStack align="flex-start" spacing="2">
            {columns
              .filter((column) => actionColumn.title !== column.title) // exclude action column
              .map((column) => (
                <Box key={`${drop.id}-${column.title}`}>{column.selector(drop)}</Box>
              ))}
          </VStack>
        </Td>
        <Td verticalAlign="middle">{actionColumn.selector(drop)}</Td>
      </Tr>
    ));

  return (
    <TableContainer>
      <Table {...props}>
        <Tbody>{getMobileTableBody()}</Tbody>
      </Table>
    </TableContainer>
  );
};
