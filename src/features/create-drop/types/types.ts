export const NFT_ATTEMPT_KEY = 'NFT_ATTEMPT';

export interface SummaryItem {
  type: 'text' | 'image' | 'number';
  name: string;
  value: string | number;
}

export interface PaymentItem {
  name: string;
  total: number;
  isDiscount?: boolean;
  discountText?: string;
  helperText?: string;
  doNotRender?: boolean;
}

export interface PaymentData {
  costsData: PaymentItem[];
  totalCost: number;
  confirmationText: string;
}

export interface NFTType {
  title: string;
  description: string;
  artwork: string;
}
