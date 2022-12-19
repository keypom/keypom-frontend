import { Th as CTh } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

import { useTableStyles } from './Table';

export const Th = ({ children }: PropsWithChildren) => {
  const styles = useTableStyles();
  return <CTh sx={styles.th}>{children}</CTh>;
};
