import { Skeleton } from '@chakra-ui/react';

import { type ColumnItem } from '@/components/Table/types';

export const tableColumns: ColumnItem[] = [
  { title: 'Link', selector: (row) => row.link, loadingElement: <Skeleton height="30px" /> },
  {
    title: 'Claim Status',
    selector: (row) => row.hasClaimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    title: 'Action',
    selector: (row) => row.action,
    tdProps: {
      display: 'flex',
      justifyContent: 'right',
      verticalAlign: 'middle',
    },
    loadingElement: <Skeleton height="30px" />,
  },
];
