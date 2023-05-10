import {
  Box,
  Table,
  TableContainer,
  type TableProps,
  Tbody,
  Td,
  Tr,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Fragment } from 'react';

import { QnaTableColumns } from '@/features/drop-manager/components/TableColumn';

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

    if (data.length > 0 && data[0].rowPanel === undefined)
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

    return data.map((drop) => {
      const panelContent = (drop.rowPanel as any[]) ?? [];
      const getRowPanel = () => (
        <TableContainer p="0" whiteSpace="inherit">
          <Table bg="unset">
            <Tbody>
              {panelContent.map((item, i) => (
                <Tr key={i}>
                  {QnaTableColumns.map((column, i) => (
                    <Td key={`${column.id}-$${item.id}-${i}`} {...column.tdProps}>
                      {column.selector(item)}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      );

      return (
        <AccordionItem key={drop.id} as={Fragment}>
          <AccordionButton
            key={drop.id}
            _hover={
              (drop.href as string | undefined)
                ? {
                    cursor: 'pointer',
                    background: 'gray.50',
                  }
                : {}
            }
            as={Tr}
            p="0"
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
          </AccordionButton>
          <Tr h="0">
            <Td colSpan={4} p="0 !important">
              <AccordionPanel p="0">{getRowPanel()}</AccordionPanel>
            </Td>
          </Tr>
        </AccordionItem>
      );
    });
  };

  return (
    <Accordion allowToggle>
      <TableContainer whiteSpace="normal">
        <Table {...props}>
          <Tbody>{getMobileTableBody()}</Tbody>
        </Table>
      </TableContainer>
    </Accordion>
  );
};
