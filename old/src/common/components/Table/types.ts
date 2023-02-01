import { TableCellProps } from '@chakra-ui/react';

type Primitive = string | number | boolean;

export interface DataItem {
  id: string | number;
  [key: string]: React.ReactNode | Primitive;
}

export interface ColumnItem {
  title: string;
  selector: (arg: DataItem) => React.ReactNode | Primitive;
  tdProps?: TableCellProps;
}
