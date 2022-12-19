import { Td as CTd } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { useTableStyles } from './Table';

export const Td = ({ children }: PropsWithChildren) => {
  const styles = useTableStyles();
  return <CTd sx={styles.td}>{children}</CTd>;
};
