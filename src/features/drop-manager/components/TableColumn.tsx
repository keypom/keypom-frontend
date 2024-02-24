import { Skeleton } from '@chakra-ui/react';

import { type ColumnItem } from '@/components/Table/types';

export const tableColumns: ColumnItem[] = [
  {
    id: 'title',
    title: 'Link',
    selector: (row) => row.link,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'claimStatus',
    title: 'Status',
    selector: (row) => row.hasClaimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'action',
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
