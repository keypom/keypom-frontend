import { TableCellProps, Td as CTd } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { useTableStyles } from './Table';

export const Td = ({ children, ...props }: PropsWithChildren<TableCellProps>) => {
  const styles = useTableStyles();
  return (
    <CTd sx={styles.td} {...props}>
      {children}
    </CTd>
  );
};
