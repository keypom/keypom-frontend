export interface SummaryItem {
  type: 'text' | 'image';
  name: string;
  value: string | number;
}

export interface PaymentItem {
  name: string;
  total: number;
  isDiscount?: boolean;
  discountText?: string;
  helperText?: string;
}

export interface PaymentData {
  costsData: PaymentItem[];
  totalCost: number;
  confirmationText: string;
}
