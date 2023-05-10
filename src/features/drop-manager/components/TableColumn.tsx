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
    id: 'qna' /** THIS IS FOR THE QNA */,
    title: 'QnA',
    selector: (row) => row.qnaStats,
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

export const QnaTableColumns: ColumnItem[] = [
  {
    id: 'questions',
    title: 'Questions',
    selector: (row) => row.questions,
    loadingElement: <Skeleton height="30px" />,
    tdProps: {
      width: '30%',
    },
  },
  {
    id: 'answers',
    title: 'Answers',
    selector: (row) => row.answers,
    loadingElement: <Skeleton height="30px" />,
    tdProps: {
      whiteSpace: 'break-spaces',
    },
  },
];
