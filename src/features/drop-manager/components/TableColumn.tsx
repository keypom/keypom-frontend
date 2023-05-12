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
    title: 'Claim Status',
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

export const ticketTableColumns: ColumnItem[] = [
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
    id: 'view-details',
    title: '',
    selector: (row) => row.viewDetails,
    loadingElement: <Skeleton height="30px" />,
    tdProps: {
      textAlign: 'right',
    },
  },
  {
    id: 'action',
    title: '',
    selector: (row) => row.action,
    loadingElement: <Skeleton height="30px" />,
    tdProps: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '2',
    },
  },
];
