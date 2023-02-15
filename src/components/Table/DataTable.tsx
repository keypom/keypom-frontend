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
} from '@chakra-ui/react';

import { MobileDataTable } from './MobileDataTable';
import { type Pagination, type ColumnItem, type DataItem } from './types';

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
  showColumns?: boolean;
  columns: ColumnItem[];
  data: DataItem[];
  loading?: boolean;
  onRowClick?: (id: string | number) => void;
  pagination?: Pagination;
}

export const DataTable = ({
  showColumns = true,
  columns = [],
  data = [],
  loading = false,
  onRowClick,
  pagination,
  ...props
}: DataTableProps) => {
  const startOfPage = pagination ? pagination.pageSize * pagination.pageIndex : 0;
  const endOfPage = pagination ? pagination.pageSize * (pagination.pageIndex + 1) - 1 : undefined;

  const getDesktopTableBody = () => {
    if (loading) {
      return Array.from([1, 2, 3]).map((_, index) => (
        <Tr key={index}>
          {columns.map((column) => (
            <Td key={`${column.title}-${index}`} {...column.tdProps}>
              {column.loadingElement}
            </Td>
          ))}
        </Tr>
      ));
    }

    return data.slice(startOfPage, endOfPage).map((drop) => (
      <Tr
        key={drop.id}
        onClick={() => {
          onRowClick?.(drop.id);
        }}
      >
        {columns.map((column) => (
          <Td key={`${column.title}-${drop.id}`} {...column.tdProps}>
            {column.selector(drop)}
          </Td>
        ))}
      </Tr>
    ));
  };

  return (
    <>
      {/* Desktop Table */}
      <Show above="md">
        <TableContainer>
          <Table {...props}>
            {showColumns && (
              <Thead>
                <Tr>
                  {columns.map((col) => (
                    <Th key={col.title} fontFamily="body" {...col.thProps}>
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
        <MobileDataTable
          columns={columns}
          data={data}
          rowEnd={endOfPage}
          rowStart={startOfPage}
          {...props}
        />
      </Hide>
    </>
  );
};
