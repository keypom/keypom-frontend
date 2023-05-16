import { Skeleton } from '@chakra-ui/react';

import { type ColumnItem } from '@/components/Table/types';

export const eventTableColumn: ColumnItem[] = [
  {
    id: 'ticket',
    title: 'Ticket',
    selector: (row) => row.ticket,
    loadingElement: <Skeleton height="30px" />,
    thProps: {
      width: '30%',
    },
  },
  {
    id: 'date',
    title: 'Date',
    selector: (row) => row.date,
    loadingElement: <Skeleton height="30px" />,
    thProps: {
      textAlign: 'center',
    },
    tdProps: {
      textAlign: 'center',
    },
  },
  {
    id: 'quantity',
    title: 'Available tickets',
    selector: (row) => row.quantity,
    loadingElement: <Skeleton height="30px" />,
    thProps: {
      textAlign: 'center',
    },
    tdProps: {
      textAlign: 'center',
    },
  },
  {
    id: 'price',
    title: 'Price (NEAR)',
    selector: (row) => row.price,
    loadingElement: <Skeleton height="30px" />,
    tdProps: {
      textAlign: 'center',
    },
    thProps: {
      textAlign: 'center',
    },
  },
  {
    id: 'mobile-action', // this is to show the action buttons properly in mobile view
    title: '',
    selector: (row) => row.action,
    loadingElement: <Skeleton height="30px" />,
  },
];
