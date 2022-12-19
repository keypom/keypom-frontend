import {
  TableContainer,
  Table as CTable,
  TableProps,
  createStylesContext,
  useMultiStyleConfig,
} from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export const [StylesProvider, useTableStyles] = createStylesContext('Table');
export const Table = ({ children, ...props }: PropsWithChildren<TableProps>) => {
  const styles = useMultiStyleConfig('Table', {});
  return (
    <TableContainer>
      <CTable sx={styles} {...props}>
        <StylesProvider value={styles}>
          {/* Insert table headers and body */}
          {children}
        </StylesProvider>
      </CTable>
    </TableContainer>
  );
};
