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
    title: 'Claim Status',
    selector: (row) => row.hasClaimed,
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'question1',
    title: 'Question 1',
    selector: (row) => row.q1Ans,
    tdProps: {
      wordBreak: 'break-word',
      whiteSpace: 'normal',
    },
    loadingElement: <Skeleton height="30px" />,
  },
  {
    id: 'question2',
    title: 'Question 2',
    selector: (row) => row.q2Ans,
    tdProps: {
      wordBreak: 'break-word',
      whiteSpace: 'normal',
    },
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
