import { type TableCellProps } from '@chakra-ui/react';

type Primitive = string | number | boolean;

export interface DataItem {
  id: string | number;
  [key: string]: React.ReactNode | Primitive;
}

export interface ColumnItem {
  title: string;
  selector: (arg: DataItem) => React.ReactNode | Primitive;
  loadingElement?: React.ReactNode;
  tdProps?: TableCellProps;
}
