export const formatAmount = (number: number, options?: Intl.NumberFormatOptions): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    ...options,
  }).format(number);
