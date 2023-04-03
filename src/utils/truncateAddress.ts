type Placement = 'start' | 'middle' | 'end';

export const truncateAddress = (
  address: string,
  placement: Placement = 'middle',
  maxLength = 24,
) => {
  if (!address) return '';
  if (address.length > maxLength) {
    switch (placement) {
      case 'start':
        return '...' + address.slice(-maxLength);
      case 'middle':
        return address.slice(0, maxLength - 6) + '...' + address.slice(-6);
      case 'end':
      default:
        return address.slice(0, maxLength) + '...';
    }
  }

  return address;
};
