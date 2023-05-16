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

  const actionColumn = columns.find((col) => col.id === 'action');
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
        <Td width="63%">
          <VStack align="flex-start" overflow="hidden" spacing="2" width="100%">
            {columns
              .filter((column) => actionColumn?.id !== column.id) // exclude action column
              .map((column) => (
                <Box key={`${drop.id}-${column.id}`} width="100%">
                  {column.mobileSelector ? column.mobileSelector(drop) : column.selector(drop)}
                </Box>
              ))}
          </VStack>
        </Td>
        {actionColumn && (
          <Td textAlign="right" verticalAlign="middle" width="37%">
            {actionColumn?.selector(drop)}
          </Td>
        )}
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
