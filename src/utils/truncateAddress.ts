type Placement = 'start' | 'middle' | 'end';

export const truncateAddress = (
  address: string,
  placement: Placement = 'middle',
  maxLength = 24,
) => {
  if (address.length > maxLength) {
    switch (placement) {
      case 'start':
        return '...' + address.slice(-10);
      case 'middle':
        return address.slice(0, 4) + '...' + address.slice(-6);
      case 'end':
      default:
        return address.slice(0, 12) + '...';
    }
  }

  return address;
};
